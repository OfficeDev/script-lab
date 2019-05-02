import { JupyterNotebook, PythonCodeHelper } from 'common/lib/utilities/Jupyter';

export function initializeJupyter(pythonConfig: IPythonConfig) {
  const notebook = new JupyterNotebook(
    {
      baseUrl: pythonConfig.url,
      token: pythonConfig.token,
    },
    pythonConfig.notebook,
  );

  CustomFunctions.setCustomFunctionInvoker(new JupyterCustomFunctionInvoker(notebook));
}

// tslint:disable:no-namespace

declare namespace CustomFunctions {
  function setCustomFunctionInvoker(invoker: ICustomFunctionInvoker): void;

  interface ICustomFunctionInvoker {
    invoke(functionName: string, parameters: any[], context: InvocationContext): void;
  }

  interface InvocationContext {
    onCanceled: (() => void);
    functionName: string;
    address: string;
    setResult(result: any): void;
  }
}

class JupyterCustomFunctionInvoker implements CustomFunctions.ICustomFunctionInvoker {
  constructor(private _notebook: JupyterNotebook) {}

  invoke(
    functionName: string,
    parameters: any[],
    context: CustomFunctions.InvocationContext,
  ): void {
    let code: string;
    if (functionName === 'code') {
      code = parameters[0];
    } else {
      code = PythonCodeHelper.buildFunctionInvokeStatement(functionName, parameters);
    }

    this._notebook.executeCode(code).then((codeResult: string) => {
      const value = PythonCodeHelper.parseFromPythonLiteral(codeResult);
      context.setResult(value);
    });
  }
}
