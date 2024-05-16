// Copy of https://github.com/OfficeDev/Office-Addin-Scripts/blob/master/packages/custom-functions-metadata/src/parseTree.ts
// Pulled directly into Script Lab

import * as ts from "typescript";
import XRegExp = require("xregexp");

/* global console */

export interface ICustomFunctionsMetadata {
  functions: IFunction[];
}

export interface IFunction {
  id: string;
  name: string;
  description?: string;
  helpUrl?: string;
  parameters: IFunctionParameter[];
  result?: IFunctionResult;
  options?: IFunctionOptions;
}

export interface IFunctionOptions {
  cancelable?: boolean;
  requiresAddress?: boolean;
  stream?: boolean;
  volatile?: boolean;
  requiresParameterAddresses?: boolean;
  excludeFromAutoComplete?: boolean;
  linkedEntityDataProvider?: boolean;
}

export interface IFunctionParameter {
  name: string;
  description?: string;
  type: string;
  dimensionality?: string;
  optional?: boolean;
  repeating?: boolean;
}

export interface IFunctionResult {
  type?: string;
  dimensionality?: string;
}

export interface IGenerateResult {
  metadataJson: string;
  associate: IAssociate[];
  errors: string[];
}

export interface IFunctionExtras {
  errors: string[];
  javascriptFunctionName: string;
}

export interface IParseTreeResult {
  associate: IAssociate[];
  extras: IFunctionExtras[];
  functions: IFunction[];
}

export interface IAssociate {
  sourceFileName: string;
  functionName: string;
  id: string;
}

export interface IExperimentalOptions {
  /** @deprecated */
  allowRepeatingParameters?: boolean;
}

export interface IOptions {
  experimental?: IExperimentalOptions;
}

interface IArrayType {
  dimensionality: number;
  type: ts.SyntaxKind;
}

interface IGetParametersArguments {
  enumList: string[];
  extra: IFunctionExtras;
  jsDocParamInfo: { [key: string]: string };
  jsDocParamOptionalInfo: { [key: string]: string };
  jsDocParamTypeInfo: { [key: string]: IJsDocParamType };
  parametersToParse: ts.ParameterDeclaration[];
}

interface IJsDocParamType {
  type: string;
  returnType: string;
  dimensionality: string;
}

const CUSTOM_FUNCTION = "customfunction"; // case insensitive @CustomFunction tag to identify custom functions in JSDoc
const HELPURL_PARAM = "helpurl";
const VOLATILE = "volatile";
const STREAMING = "streaming";
const CANCELABLE = "cancelable";
const REQUIRESADDRESS = "requiresaddress";
const REQUIRESPARAMETERADDRESSES = "requiresparameteraddresses";
const EXCLUDEFROMAUTOCOMPLETE = "excludefromautocomplete";
const LINKEDENTITYDATAPROVIDER = "linkedentitydataprovider";

const TYPE_MAPPINGS_SIMPLE = {
  [ts.SyntaxKind.NumberKeyword]: "number",
  [ts.SyntaxKind.StringKeyword]: "string",
  [ts.SyntaxKind.BooleanKeyword]: "boolean",
  [ts.SyntaxKind.AnyKeyword]: "any",
  [ts.SyntaxKind.UnknownKeyword]: "any",
};

const TYPE_MAPPINGS = {
  [ts.SyntaxKind.NumberKeyword]: "number",
  [ts.SyntaxKind.StringKeyword]: "string",
  [ts.SyntaxKind.BooleanKeyword]: "boolean",
  [ts.SyntaxKind.AnyKeyword]: "any",
  [ts.SyntaxKind.UnionType]: "any",
  [ts.SyntaxKind.TupleType]: "any",
  [ts.SyntaxKind.EnumKeyword]: "any",
  [ts.SyntaxKind.ObjectKeyword]: "any",
  [ts.SyntaxKind.VoidKeyword]: "any",
  [ts.SyntaxKind.UnknownKeyword]: "any",
};

const TYPE_CUSTOM_FUNCTIONS_STREAMING = {
  ["customfunctions.streaminghandler"]: 1,
  ["customfunctions.streaminginvocation"]: 2,
};

const TYPE_CUSTOM_FUNCTION_CANCELABLE = {
  ["customfunctions.cancelablehandler"]: 1,
  ["customfunctions.cancelableinvocation"]: 2,
};
const TYPE_CUSTOM_FUNCTION_INVOCATION = "customfunctions.invocation";

type CustomFunctionsSchemaDimensionality = "invalid" | "scalar" | "matrix";

/**
 * Takes the sourceCode and attempts to parse the functions information
 * @param sourceCode source containing the custom functions
 * @param sourceFileName source code file name or path
 * @param parseTreeOptions options to enable or disable
 */
export function parseTree(sourceCode: string, sourceFileName: string): IParseTreeResult {
  const associate: IAssociate[] = [];
  const functions: IFunction[] = [];
  const extras: IFunctionExtras[] = [];
  const enumList: string[] = [];
  const functionNames: string[] = [];
  const metadataFunctionNames: string[] = [];
  const ids: string[] = [];

  const sourceFile = ts.createSourceFile(sourceFileName, sourceCode, ts.ScriptTarget.Latest, true);

  buildEnums(sourceFile);
  visit(sourceFile);
  const parseTreeResult: IParseTreeResult = {
    associate,
    extras,
    functions,
  };
  return parseTreeResult;

  function buildEnums(node: ts.Node) {
    if (ts.isEnumDeclaration(node)) {
      enumList.push(node.name.getText());
    }
    ts.forEachChild(node, buildEnums);
  }

  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node)) {
      if (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile) {
        const functionDeclaration = node as ts.FunctionDeclaration;
        const position = getPosition(functionDeclaration);
        const functionErrors: string[] = [];
        const functionName = functionDeclaration.name ? functionDeclaration.name.text : "";

        if (checkForDuplicate(functionNames, functionName)) {
          const errorString = `Duplicate function name: ${functionName}`;
          functionErrors.push(logError(errorString, position));
        }

        functionNames.push(functionName);

        if (isCustomFunction(functionDeclaration)) {
          const extra: IFunctionExtras = {
            errors: functionErrors,
            javascriptFunctionName: functionName,
          };
          const idName = getTagComment(functionDeclaration, CUSTOM_FUNCTION);
          const idNameArray = idName.split(" ");
          const jsDocParamInfo = getJSDocParams(functionDeclaration);
          const jsDocParamTypeInfo = getJSDocParamsType(functionDeclaration);
          const jsDocParamOptionalInfo = getJSDocParamsOptionalType(functionDeclaration);

          const [lastParameter] = functionDeclaration.parameters.slice(-1);
          const isStreamingFunction = hasStreamingInvocationParameter(
            lastParameter,
            jsDocParamTypeInfo,
          );
          const isCancelableFunction = hasCancelableInvocationParameter(
            lastParameter,
            jsDocParamTypeInfo,
          );
          const isInvocationFunction = hasInvocationParameter(lastParameter, jsDocParamTypeInfo);

          const parametersToParse =
            isStreamingFunction || isCancelableFunction || isInvocationFunction
              ? functionDeclaration.parameters.slice(0, functionDeclaration.parameters.length - 1)
              : functionDeclaration.parameters.slice(0, functionDeclaration.parameters.length);

          const parameterItems: IGetParametersArguments = {
            enumList,
            extra,
            jsDocParamInfo,
            jsDocParamOptionalInfo,
            jsDocParamTypeInfo,
            parametersToParse,
          };
          const parameters = getParameters(parameterItems);

          const description = getDescription(functionDeclaration);
          const helpUrl = normalizeLineEndings(getTagComment(functionDeclaration, HELPURL_PARAM));

          const result = getResults(
            functionDeclaration,
            isStreamingFunction,
            lastParameter,
            jsDocParamTypeInfo,
            extra,
            enumList,
          );

          const options = getOptions(
            functionDeclaration,
            isStreamingFunction,
            isCancelableFunction,
            isInvocationFunction,
            extra,
          );

          const funcName: string = functionDeclaration.name ? functionDeclaration.name.text : "";
          const id = normalizeCustomFunctionId(idNameArray[0] || funcName);
          const name = idNameArray[1] || id;

          validateId(id, position, extra);
          validateName(name, position, extra);

          if (checkForDuplicate(metadataFunctionNames, name)) {
            const errorString = `@customfunction tag specifies a duplicate name: ${name}`;
            functionErrors.push(logError(errorString, position));
          }

          metadataFunctionNames.push(name);

          if (checkForDuplicate(ids, id)) {
            const errorString = `@customfunction tag specifies a duplicate id: ${id}`;
            functionErrors.push(logError(errorString, position));
          }

          ids.push(id);
          associate.push({ sourceFileName, functionName, id });

          const functionMetadata: IFunction = {
            description,
            helpUrl,
            id,
            name,
            options,
            parameters,
            result,
          };

          if (
            !options.cancelable &&
            !options.requiresAddress &&
            !options.stream &&
            !options.volatile &&
            !options.requiresParameterAddresses &&
            !options.excludeFromAutoComplete &&
            !options.linkedEntityDataProvider
          ) {
            delete functionMetadata.options;
          } else {
            if (!options.cancelable) {
              delete options.cancelable;
            }

            if (!options.requiresAddress) {
              delete options.requiresAddress;
            }

            if (!options.stream) {
              delete options.stream;
            }

            if (!options.volatile) {
              delete options.volatile;
            }

            if (!options.requiresParameterAddresses) {
              delete options.requiresParameterAddresses;
            }

            if (!options.excludeFromAutoComplete) {
              delete options.excludeFromAutoComplete;
            }

            if (!options.linkedEntityDataProvider) {
              delete options.linkedEntityDataProvider;
            }
          }

          if (!functionMetadata.helpUrl) {
            delete functionMetadata.helpUrl;
          }

          if (!functionMetadata.description) {
            delete functionMetadata.description;
          }

          if (!functionMetadata.result) {
            delete functionMetadata.result;
          }

          extras.push(extra);
          functions.push(functionMetadata);
        }
      }
    }

    ts.forEachChild(node, visit);
  }
}

/**
 * Case insensitive check of item in list
 * @param list Array of strings
 * @param item String to check against the list
 */
function checkForDuplicate(list: string[], item: string): boolean {
  let duplicate = false;
  list.forEach((value: string) => {
    if (areStringsEqual(value, item)) {
      duplicate = true;
    }
  });

  return duplicate;
}

/**
 * Function to compare strings
 * @param first First string
 * @param second Second string
 * @param ignoreCase Ignore the case of the string
 */
function areStringsEqual(first: string, second: string, ignoreCase = true): boolean {
  return typeof first === "string" && typeof second === "string"
    ? first.localeCompare(second, undefined, ignoreCase ? { sensitivity: "accent" } : undefined) ===
        0
    : first === second;
}

/**
 * Get the position of the object
 * @param node function, parameter, or node
 */
function getPosition(
  node: ts.FunctionDeclaration | ts.ParameterDeclaration | ts.TypeNode,
  position?: number,
): ts.LineAndCharacter | null {
  let positionLocation = null;
  if (node) {
    const pos = position ? position : node.pos;
    positionLocation = node.getSourceFile().getLineAndCharacterOfPosition(pos);
  }
  return positionLocation;
}

/**
 * Verifies if the id is valid and logs error if not.
 * @param id Id of the function
 */
function validateId(
  id: string,
  position: ts.LineAndCharacter | null,
  extra: IFunctionExtras,
): void {
  const idRegExString = "^[a-zA-Z0-9._]*$";
  const idRegEx = new RegExp(idRegExString);
  if (!idRegEx.test(id)) {
    if (!id) {
      id = "Function name is invalid";
    }
    const errorString = `The custom function id contains invalid characters. Allowed characters are ('A-Z','a-z','0-9','.','_'):${id}`;
    extra.errors.push(logError(errorString, position));
  }
  if (id.length > 128) {
    const errorString = `The custom function id exceeds the maximum of 128 characters allowed.`;
    extra.errors.push(logError(errorString, position));
  }
}

/**
 * Verifies if the name is valid and logs error if not.
 * @param name Name of the function
 */
function validateName(
  name: string,
  position: ts.LineAndCharacter | null,
  extra: IFunctionExtras,
): void {
  // Modify
  const startsWithLetterRegEx = XRegExp("^[\\pL]");
  const validNameRegEx = XRegExp("^[\\pL][\\pL0-9._]*$");
  let errorString: string;

  if (!name) {
    errorString = `You need to provide a custom function name.`;
    extra.errors.push(logError(errorString, position));
  }
  if (!startsWithLetterRegEx.test(name)) {
    errorString = `The custom function name "${name}" should start with an alphabetic character.`;
    extra.errors.push(logError(errorString, position));
  }
  if (!validNameRegEx.test(name)) {
    errorString = `The custom function name "${name}" should contain only alphabetic characters, numbers (0-9), period (.), and underscore (_).`;
    extra.errors.push(logError(errorString, position));
  }
  if (name.length > 128) {
    errorString = `The custom function name is too long. It must be 128 characters or less.`;
    extra.errors.push(logError(errorString, position));
  }
}

/**
 * Normalize the id of the custom function
 * @param id Parameter id of the custom function
 */
function normalizeCustomFunctionId(id: string): string {
  return id ? id.toLocaleUpperCase() : id;
}

/**
 * Determines the options parameters for the json
 * @param func - Function
 * @param isStreamingFunction - Is is a steaming function
 */
function getOptions(
  func: ts.FunctionDeclaration,
  isStreamingFunction: boolean,
  isCancelableFunction: boolean,
  isInvocationFunction: boolean,
  extra: IFunctionExtras,
): IFunctionOptions {
  const optionsItem: IFunctionOptions = {
    cancelable: isCancelableTag(func, isCancelableFunction),
    requiresAddress: isAddressRequired(func),
    stream: isStreaming(func, isStreamingFunction),
    volatile: isVolatile(func),
    requiresParameterAddresses: isRequiresParameterAddresses(func),
    excludeFromAutoComplete: isExcludedFromAutoComplete(func),
    linkedEntityDataProvider: isLinkedEntityDataProvider(func),
  };

  if (optionsItem.requiresAddress || optionsItem.requiresParameterAddresses) {
    const errorParam = optionsItem.requiresAddress
      ? "@requiresAddress"
      : "@requiresParameterAddresses";

    if (!isStreamingFunction && !isCancelableFunction && !isInvocationFunction) {
      const functionPosition = getPosition(func, func.parameters.end);
      const errorString = `Since ${errorParam} is present, the last function parameter should be of type CustomFunctions.Invocation :`;
      extra.errors.push(logError(errorString, functionPosition));
    }

    if (isStreamingFunction) {
      const functionPosition = getPosition(func);
      const errorString = `${errorParam} cannot be used with @streaming.`;
      extra.errors.push(logError(errorString, functionPosition));
    }
  }

  if (
    optionsItem.linkedEntityDataProvider &&
    (optionsItem.excludeFromAutoComplete ||
      optionsItem.volatile ||
      optionsItem.stream ||
      optionsItem.requiresAddress ||
      optionsItem.requiresParameterAddresses)
  ) {
    let errorParam = "";
    const functionPosition = getPosition(func);

    if (optionsItem.excludeFromAutoComplete) {
      errorParam = "@excludeFromAutoComplete";
    } else if (optionsItem.volatile) {
      errorParam = "@volatile";
    } else if (optionsItem.stream) {
      errorParam = "@streaming";
    } else if (optionsItem.requiresAddress) {
      errorParam = "@requiresAddress";
    } else if (optionsItem.requiresParameterAddresses) {
      errorParam = "@requiresParameterAddresses";
    }

    const errorString = `${errorParam} cannot be used with @linkedEntityDataProvider.`;
    extra.errors.push(logError(errorString, functionPosition));
  }

  return optionsItem;
}

/**
 * Determines the results parameter for the json
 * @param func - Function
 * @param isStreaming - Is a streaming function
 * @param lastParameter - Last parameter of the function signature
 */
function getResults(
  func: ts.FunctionDeclaration,
  isStreamingFunction: boolean,
  lastParameter: ts.ParameterDeclaration,
  jsDocParamTypeInfo: { [key: string]: IJsDocParamType },
  extra: IFunctionExtras,
  enumList: string[],
): IFunctionResult {
  let resultType = "any";
  let resultDim = "scalar";
  const defaultResultItem: IFunctionResult = {
    dimensionality: resultDim,
    type: resultType,
  };

  const lastParameterPosition = getPosition(lastParameter);

  // Try and determine the return type.  If one can't be determined we will set to any type
  if (isStreamingFunction) {
    const lastParameterType = lastParameter.type as ts.TypeReferenceNode;
    if (!lastParameterType) {
      // Need to get result type from param {type}
      const name = (lastParameter.name as ts.Identifier).text;
      const ptype = jsDocParamTypeInfo[name];
      resultType = ptype.returnType;
      resultDim = ptype.dimensionality;
      const paramResultItem: IFunctionResult = {
        dimensionality: resultDim,
        type: resultType,
      };

      if (paramResultItem.dimensionality === "scalar") {
        delete paramResultItem.dimensionality;
      }

      return paramResultItem;
    }
    if (!lastParameterType.typeArguments || lastParameterType.typeArguments.length !== 1) {
      const errorString =
        "The 'CustomFunctions.StreamingHandler' needs to be passed in a single result type (e.g., 'CustomFunctions.StreamingHandler < number >') :";
      extra.errors.push(logError(errorString, lastParameterPosition));
      return defaultResultItem;
    }
    const returnType = func.type as ts.TypeReferenceNode;
    if (returnType && returnType.getFullText().trim() !== "void") {
      const errorString = `A streaming function should return 'void'. Use CustomFunctions.StreamingHandler.setResult() to set results.`;
      extra.errors.push(logError(errorString, lastParameterPosition));
      return defaultResultItem;
    }
    resultType = getParamType(lastParameterType.typeArguments[0], extra, enumList);
    resultDim = getParamDim(lastParameterType.typeArguments[0]);
  } else if (func.type) {
    if (
      func.type.kind === ts.SyntaxKind.TypeReference &&
      (func.type as ts.TypeReferenceNode).typeName.getText() === "Promise" &&
      (func.type as ts.TypeReferenceNode).typeArguments &&
      (func.type as ts.TypeReferenceNode).typeArguments.length === 1
    ) {
      resultType = getParamType(
        (func.type as ts.TypeReferenceNode).typeArguments[0],
        extra,
        enumList,
      );
      resultDim = getParamDim((func.type as ts.TypeReferenceNode).typeArguments[0]);
    } else {
      resultType = getParamType(func.type, extra, enumList);
      resultDim = getParamDim(func.type);
    }
  }

  // Check the code comments for @return parameter
  const returnTypeFromJSDoc = ts.getJSDocReturnType(func);
  if (returnTypeFromJSDoc) {
    if (func.type && func.type.kind !== returnTypeFromJSDoc.kind) {
      const name = (func.name as ts.Identifier).text;
      const returnPosition = getPosition(returnTypeFromJSDoc);
      const errorString = `Type {${ts.SyntaxKind[func.type.kind]}:${
        ts.SyntaxKind[returnTypeFromJSDoc.kind]
      }} doesn't match for return type : ${name}`;
      extra.errors.push(logError(errorString, returnPosition));
    }
    if (
      returnTypeFromJSDoc.kind === ts.SyntaxKind.TypeReference &&
      (returnTypeFromJSDoc as ts.TypeReferenceNode).typeName.getText() === "Promise" &&
      (returnTypeFromJSDoc as ts.TypeReferenceNode).typeArguments &&
      (returnTypeFromJSDoc as ts.TypeReferenceNode).typeArguments.length === 1
    ) {
      resultType = getParamType(
        (returnTypeFromJSDoc as ts.TypeReferenceNode).typeArguments[0],
        extra,
        enumList,
      );
      resultDim = getParamDim((returnTypeFromJSDoc as ts.TypeReferenceNode).typeArguments[0]);
    } else {
      resultType = getParamType(returnTypeFromJSDoc, extra, enumList);
      resultDim = getParamDim(returnTypeFromJSDoc);
    }
  }

  const resultItem: IFunctionResult = {
    dimensionality: resultDim,
    type: resultType,
  };

  // Only return dimensionality = matrix.  Default assumed scalar
  if (resultDim === "scalar") {
    delete resultItem.dimensionality;
  }

  if (resultType === "any") {
    delete resultItem.type;
  }

  return resultItem;
}

/**
 * Determines the parameter details for the json
 * @param params - Parameters
 * @param jsDocParamTypeInfo - jsDocs parameter type info
 * @param jsDocParamInfo = jsDocs parameter info
 */
function getParameters(parameterItem: IGetParametersArguments): IFunctionParameter[] {
  const parameterMetadata: IFunctionParameter[] = [];
  parameterItem.parametersToParse
    .map((p: ts.ParameterDeclaration) => {
      const parameterPosition = getPosition(p);
      // Get type node of parameter from typescript
      let typeNode = p.type as ts.TypeNode;
      const name = (p.name as ts.Identifier).text;
      // Get type node of parameter from jsDocs
      const parameterJSDocTypeNode = ts.getJSDocType(p);
      if (parameterJSDocTypeNode && typeNode) {
        if (parameterJSDocTypeNode.kind !== typeNode.kind) {
          const errorString = `Type {${ts.SyntaxKind[parameterJSDocTypeNode.kind]}:${
            ts.SyntaxKind[typeNode.kind]
          }} doesn't match for parameter : ${name}`;
          parameterItem.extra.errors.push(logError(errorString, parameterPosition));
        }
      }
      if (!typeNode && parameterJSDocTypeNode) {
        typeNode = parameterJSDocTypeNode;
      }
      const ptype = getParamType(typeNode, parameterItem.extra, parameterItem.enumList);

      const pMetadataItem: IFunctionParameter = {
        description: parameterItem.jsDocParamInfo[name],
        dimensionality: getParamDim(typeNode),
        name,
        optional: getParamOptional(p, parameterItem.jsDocParamOptionalInfo),
        repeating: isRepeatingParameter(typeNode),
        type: ptype,
      };

      // Only return dimensionality = matrix.  Default assumed scalar
      if (pMetadataItem.dimensionality === "scalar") {
        delete pMetadataItem.dimensionality;
      }

      // only include optional if true
      if (!pMetadataItem.optional) {
        delete pMetadataItem.optional;
      }

      // only include description if it has a value
      if (!pMetadataItem.description) {
        delete pMetadataItem.description;
      }

      // only return repeating if true and allowed
      if (!pMetadataItem.repeating) {
        delete pMetadataItem.repeating;
      }

      parameterMetadata.push(pMetadataItem);
    })
    .filter((meta) => meta);

  return parameterMetadata;
}

/**
 * Used to set repeating parameter true for 1d and 3d arrays
 * @param type Node to check
 * @param jsDocParamType Type from jsDoc
 */
function isRepeatingParameter(type: ts.TypeNode): boolean {
  let repeating = false;
  // Set repeating true for 1D and 3D array types
  if (type) {
    if (ts.isTypeReferenceNode(type) || ts.isArrayTypeNode(type)) {
      const array = getArrayDimensionalityAndType(type);
      if (array.dimensionality === 1 || array.dimensionality === 3) {
        repeating = true;
      }
    }
  }
  return repeating;
}

function normalizeLineEndings(text: string): string {
  return text ? text.replace(/\r\n|\r/g, "\n") : text;
}

/**
 * Determines the description parameter for the json
 * @param node - jsDoc node
 */
function getDescription(node: ts.Node): string {
  let description = "";

  const doc = (node as any).jsDoc[0] as undefined | { comment: string };
  if (doc) {
    description = doc.comment;
  }

  return normalizeLineEndings(description);
}

/**
 * Find the tag with the specified name.
 * @param node - jsDocs node
 * @returns the tag if found; undefined otherwise.
 */
function findTag(node: ts.Node, tagName: string): ts.JSDocTag | undefined {
  return ts.getJSDocTags(node).find((tag: ts.JSDocTag) => containsTag(tag, tagName));
}

/**
 * If a node contains the named tag, returns the tag comment, otherwise returns "".
 */
function getTagComment(node: ts.Node, tagName: string): string {
  const tag = findTag(node, tagName);
  return tag?.comment?.toString() || "";
}

/**
 * Determine if a node contains a tag.
 * @param node - jsDocs node
 * @returns true if the node contains the tag; false otherwise.
 */
function hasTag(node: ts.Node, tagName: string): boolean {
  return findTag(node, tagName) !== undefined;
}

/**
 * Returns true if function is a custom function
 * @param node - jsDocs node
 */
function isCustomFunction(node: ts.Node): boolean {
  return hasTag(node, CUSTOM_FUNCTION);
}

/**
 * Returns true if volatile tag found in comments
 * @param node jsDocs node
 */
function isVolatile(node: ts.Node): boolean {
  return hasTag(node, VOLATILE);
}

/**
 * Returns true if requiresAddress tag found in comments
 * @param node jsDocs node
 */
function isAddressRequired(node: ts.Node): boolean {
  return hasTag(node, REQUIRESADDRESS);
}

/**
 * Returns true if RequiresParameterAddresses tag found in comments
 * @param node jsDocs node
 */
function isRequiresParameterAddresses(node: ts.Node): boolean {
  return hasTag(node, REQUIRESPARAMETERADDRESSES);
}

/**
 * Returns true if excludedFromAutoComplete tag found in comments
 * @param node jsDocs node
 */
function isExcludedFromAutoComplete(node: ts.Node): boolean {
  return hasTag(node, EXCLUDEFROMAUTOCOMPLETE);
}

/**
 * Returns true if linkedEntityDataProvider tag found in comments
 * @param node jsDocs node
 */
function isLinkedEntityDataProvider(node: ts.Node): boolean {
  return hasTag(node, LINKEDENTITYDATAPROVIDER);
}

function containsTag(tag: ts.JSDocTag, tagName: string): boolean {
  return (tag.tagName.escapedText as string).toLowerCase() === tagName;
}

/**
 * Returns true if function is streaming
 * @param node - jsDocs node
 * @param streamFunction - Is streaming function already determined by signature
 */
function isStreaming(node: ts.Node, streamFunction: boolean): boolean {
  // If streaming already determined by function signature then return true
  return streamFunction || hasTag(node, STREAMING);
}

/**
 * Returns true if streaming function is cancelable
 * @param node - jsDocs node
 */
function isCancelableTag(node: ts.Node, cancelableFunction: boolean): boolean {
  return cancelableFunction || hasTag(node, CANCELABLE);
}

/**
 * This method will parse out all of the @param tags of a JSDoc and return a dictionary
 * @param node - The function to parse the JSDoc params from
 */
function getJSDocParams(node: ts.Node): { [key: string]: string } {
  const jsDocParamInfo = {};

  ts.getAllJSDocTagsOfKind(node, ts.SyntaxKind.JSDocParameterTag).forEach((tag: ts.JSDocTag) => {
    if (tag.comment) {
      const tagComment = tag.comment.toString();
      const comment = (tagComment.startsWith("-") ? tagComment.slice(1) : tagComment).trim();
      jsDocParamInfo[(tag as ts.JSDocPropertyLikeTag).name.getFullText()] = comment;
    } else {
      // Description is missing so add empty string
      jsDocParamInfo[(tag as ts.JSDocPropertyLikeTag).name.getFullText()] = "";
    }
  });

  return jsDocParamInfo;
}

/**
 * This method will parse out all of the @param tags of a JSDoc and return a dictionary
 * @param node - The function to parse the JSDoc params from
 */
function getJSDocParamsType(node: ts.Node): { [key: string]: IJsDocParamType } {
  const jsDocParamTypeInfo = {};

  ts.getAllJSDocTagsOfKind(node, ts.SyntaxKind.JSDocParameterTag).forEach(
    (tag: ts.JSDocParameterTag) => {
      if (tag.typeExpression) {
        // Should be in the form {string}, so removing the {} around type
        const paramType: string = tag.typeExpression
          .getFullText()
          .slice(1, tag.typeExpression.getFullText().length - 1);
        const openBracket: number = paramType.indexOf("<");
        let insertValue;

        // Check for generic type
        if (openBracket > -1) {
          const subType = paramType.slice(openBracket + 1, paramType.length - 1);
          const dimCount: number = (subType.match(/\[/g) || []).length;
          if (dimCount > 0) {
            insertValue = {
              type: paramType.slice(0, openBracket),
              returnType: subType.slice(0, subType.indexOf("[")),
              dimensionality: dimCount == 1 ? "scalar" : "matrix",
            };
          } else {
            insertValue = { type: paramType.slice(0, openBracket), returnType: subType };
          }
        } else {
          insertValue = { type: paramType };
        }

        jsDocParamTypeInfo[(tag as ts.JSDocPropertyLikeTag).name.getFullText()] = insertValue;
      } else {
        // Set as any
        jsDocParamTypeInfo[(tag as ts.JSDocPropertyLikeTag).name.getFullText()] = { type: "any" };
      }
    },
  );

  return jsDocParamTypeInfo;
}

/**
 * This method will parse out all of the @param tags of a JSDoc and return a dictionary
 * @param node - The function to parse the JSDoc params from
 */
function getJSDocParamsOptionalType(node: ts.Node): { [key: string]: string } {
  const jsDocParamOptionalTypeInfo = {};

  ts.getAllJSDocTagsOfKind(node, ts.SyntaxKind.JSDocParameterTag).forEach(
    (tag: ts.JSDocParameterTag) => {
      jsDocParamOptionalTypeInfo[(tag as ts.JSDocPropertyLikeTag).name.getFullText()] =
        tag.isBracketed;
    },
  );

  return jsDocParamOptionalTypeInfo;
}

/**
 * Determines if the last parameter is streaming
 * @param param ParameterDeclaration
 */
function hasStreamingInvocationParameter(
  param: ts.ParameterDeclaration,
  jsDocParamTypeInfo: { [key: string]: IJsDocParamType },
): boolean {
  const isTypeReferenceNode = param && param.type && ts.isTypeReferenceNode(param.type);

  if (param) {
    const name = (param.name as ts.Identifier).text;
    if (name && jsDocParamTypeInfo[name]) {
      const ptype = jsDocParamTypeInfo[name].type;
      // Check to see if the streaming parameter is defined in the comment section
      if (ptype) {
        const typecheck = TYPE_CUSTOM_FUNCTIONS_STREAMING[ptype.toLocaleLowerCase()];
        if (typecheck) {
          return true;
        }
      }
    }
  }

  if (!isTypeReferenceNode) {
    return false;
  }

  const typeRef = param.type as ts.TypeReferenceNode;
  const typeName = typeRef.typeName.getText();
  return (
    typeName === "CustomFunctions.StreamingInvocation" ||
    typeName === "CustomFunctions.StreamingHandler" ||
    typeName === "IStreamingCustomFunctionHandler" /* older version*/
  );
}

/**
 * Determines if the last parameter is of type cancelable
 * @param param ParameterDeclaration
 * @param jsDocParamTypeInfo
 */
function hasCancelableInvocationParameter(
  param: ts.ParameterDeclaration,
  jsDocParamTypeInfo: { [key: string]: IJsDocParamType },
): boolean {
  const isTypeReferenceNode = param && param.type && ts.isTypeReferenceNode(param.type);

  if (param) {
    const name = (param.name as ts.Identifier).text;
    if (name && jsDocParamTypeInfo[name]) {
      const ptype = jsDocParamTypeInfo[name].type;
      // Check to see if the cancelable parameter is defined in the comment section
      if (ptype) {
        const cancelableTypeCheck = TYPE_CUSTOM_FUNCTION_CANCELABLE[ptype.toLocaleLowerCase()];
        if (cancelableTypeCheck) {
          return true;
        }
      }
    }
  }

  if (!isTypeReferenceNode) {
    return false;
  }

  const typeRef = param.type as ts.TypeReferenceNode;
  const typeName = typeRef.typeName.getText();
  return (
    typeName === "CustomFunctions.CancelableHandler" ||
    typeName === "CustomFunctions.CancelableInvocation"
  );
}

/**
 * Determines if the last parameter is of type invocation
 * @param param ParameterDeclaration
 * @param jsDocParamTypeInfo
 */
function hasInvocationParameter(
  param: ts.ParameterDeclaration,
  jsDocParamTypeInfo: { [key: string]: IJsDocParamType },
): boolean {
  const isTypeReferenceNode = param && param.type && ts.isTypeReferenceNode(param.type);

  if (param) {
    const name = (param.name as ts.Identifier).text;
    if (name && jsDocParamTypeInfo[name]) {
      const ptype = jsDocParamTypeInfo[name].type;
      // Check to see if the invocation parameter is defined in the comment section
      if (ptype) {
        if (ptype.toLocaleLowerCase() === TYPE_CUSTOM_FUNCTION_INVOCATION) {
          return true;
        }
      }
    }
  }

  if (!isTypeReferenceNode) {
    return false;
  }

  const typeRef = param.type as ts.TypeReferenceNode;
  return typeRef.typeName.getText() === "CustomFunctions.Invocation";
}

/**
 * Gets the parameter type of the node
 * @param t TypeNode
 */
function getParamType(t: ts.TypeNode, extra: IFunctionExtras, enumList: string[]): string {
  let type = "any";
  // Only get type for typescript files.  js files will return any for all types
  if (t) {
    let kind = t.kind;
    const typePosition = getPosition(t);
    if (ts.isTypeReferenceNode(t) || ts.isArrayTypeNode(t)) {
      let arrayType: IArrayType = {
        dimensionality: 0,
        type: ts.SyntaxKind.AnyKeyword,
      };
      if (ts.isTypeReferenceNode(t)) {
        const array = t as ts.TypeReferenceNode;
        if (enumList.indexOf(array.typeName.getText()) >= 0) {
          // Type found in the enumList
          return type;
        }
        if (array.typeName.getText() !== "Array") {
          extra.errors.push(logError("Invalid type: " + array.typeName.getText(), typePosition));
          return type;
        }
      }
      arrayType = getArrayDimensionalityAndType(t);
      kind = arrayType.type;
    }
    type = TYPE_MAPPINGS[kind];
    if (!type) {
      extra.errors.push(logError("Type doesn't match mappings", typePosition));
    }
  }
  return type;
}

/**
 * Wrapper function which will return the dimensionality and type of the array
 * @param node TypeNode
 */
function getArrayDimensionalityAndType(node: ts.TypeNode): IArrayType {
  let array: IArrayType = {
    dimensionality: 0,
    type: ts.SyntaxKind.AnyKeyword,
  };
  if (ts.isArrayTypeNode(node)) {
    array = getArrayDimensionalityAndTypeForArrayTypeNode(node);
  } else if (ts.isTypeReferenceNode(node)) {
    array = getArrayDimensionalityAndTypeForReferenceNode(node as ts.TypeReferenceNode);
  }
  return array;
}

/**
 * Returns the dimensionality and type of array for TypeNode
 * @param node TypeNode
 */
function getArrayDimensionalityAndTypeForArrayTypeNode(node: ts.TypeNode): IArrayType {
  const array: IArrayType = {
    dimensionality: 1,
    type: ts.SyntaxKind.AnyKeyword,
  };

  let nodeCheck = (node as ts.ArrayTypeNode).elementType;
  array.type = nodeCheck.kind;
  while (ts.isArrayTypeNode(nodeCheck)) {
    array.dimensionality++;
    nodeCheck = (nodeCheck as ts.ArrayTypeNode).elementType;
    array.type = nodeCheck.kind;
  }

  return array;
}

/**
 * Returns the dimensionality and type of array for ReferenceNode
 * @param node TypeReferenceNode
 */
function getArrayDimensionalityAndTypeForReferenceNode(node: ts.TypeReferenceNode): IArrayType {
  const array: IArrayType = {
    dimensionality: 0,
    type: ts.SyntaxKind.AnyKeyword,
  };

  if (node.typeArguments && node.typeArguments.length === 1) {
    let nodeCheck = node;
    let dimensionalityCount = 1;
    while (nodeCheck.typeArguments) {
      if (TYPE_MAPPINGS_SIMPLE[nodeCheck.typeArguments[0].kind]) {
        array.dimensionality = dimensionalityCount;
        array.type = nodeCheck.typeArguments[0].kind;
      }
      nodeCheck = nodeCheck.typeArguments[0] as ts.TypeReferenceNode;
      dimensionalityCount++;
    }
  }

  return array;
}

/**
 * Get the parameter dimensionality of the node
 * @param t TypeNode
 */
function getParamDim(t: ts.TypeNode): string {
  let dimensionality: CustomFunctionsSchemaDimensionality = "scalar";
  if (t) {
    if (ts.isTypeReferenceNode(t) || ts.isArrayTypeNode(t)) {
      const array = getArrayDimensionalityAndType(t);
      if (array.dimensionality > 1) {
        dimensionality = "matrix";
      }
    }
  }

  return dimensionality;
}

function getParamOptional(
  p: ts.ParameterDeclaration,
  jsDocParamOptionalInfo: { [key: string]: string },
): boolean {
  let optional = false;
  const name = (p.name as ts.Identifier).text;
  const isOptional = p.questionToken != null || p.initializer != null || p.dotDotDotToken != null;
  // If parameter is found to be optional in ts
  if (isOptional) {
    optional = true;
    // Else check the comments section for [name] format
  } else {
    optional = jsDocParamOptionalInfo[name] as any;
  }
  return optional;
}

/**
 * Log containing all the errors found while parsing
 * @param error Error string to add to the log
 */
export function logError(error: string, position?: ts.LineAndCharacter | null): string {
  if (position) {
    error = `${error} (${position.line + 1},${position.character + 1})`;
  }
  return error;
}
