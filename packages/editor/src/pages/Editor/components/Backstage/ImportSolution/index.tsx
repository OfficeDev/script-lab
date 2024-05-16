import React from "react";
import { useState } from "react";
import Content from "../Content";

import { TextField } from "office-ui-fabric-react/lib/TextField";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

import YAML from "js-yaml";
import { convertSnippetToSolution } from "../../../../../utils";
import { get } from "lodash";

interface IProps {
  importGist: (gistId?: string, gist?: string) => void;
}

export function ImportSolution({ importGist }: IProps) {
  const [importFieldText, setImportFieldText] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  function updateImportFieldText(event: any, newValue?: string | undefined) {
    setImportFieldText(newValue || "");
  }

  // IMPORT CODE
  async function onImportClick() {
    debugger;
    const input = importFieldText.trim();
    let content = undefined;

    function testContent(text: string) {
      const content = YAML.load(text) as ISnippet;
      const { name, host } = convertSnippetToSolution(content);
      if (!name && !host) {
        throw new Error();
      }
    }

    async function getUrlContent(url: string) {
      const request = await fetch(url);
      const text = await request.text();
      return text;
    }

    /**
     * @param gistId
     * @returns content of the fist file in the gist
     */
    async function getGistContent(gistId: string) {
      // Get information about the gist
      const request = await fetch(`https://api.github.com/gists/${gistId}`);
      const gist = await request.json();

      // Get gists first files raw_url
      const gistFiles = gist.files;
      const file = Object.values(gistFiles)[0];
      const raw_url = file["raw_url"];

      // load the first files content
      const text = await getUrlContent(raw_url);
      return text;
    }

    try {
      if (input.startsWith("https://gist.github.com/")) {
        // Load GIST
        const gistId = input.split("/").pop();
        const text = await getGistContent(gistId);
        content = text;
      } else if (input.startsWith("https://") || input.startsWith("http://")) {
        // Load URL
        const text = await getUrlContent(input);
        content = text;
      } else {
        // Load TEXT
        content = input;
      }

      // Verify that the content is a valid snippet
      testContent(content);

      // Import the snippet
      importGist(undefined, content);

      // Reset the form
      setImportFieldText("");
      setErrorMessage(undefined);
    } catch (err) {
      setErrorMessage("You must provide valid YAML, gist URL, or URL.");
    }
  }

  return (
    <Content
      title="Import snippet"
      description="Enter the snippet's URL or paste the YAML below, then choose Import."
    >
      <span className="ms-font-m">Snippet URL or YAML</span>
      <TextField
        multiline={true}
        rows={8}
        onChange={updateImportFieldText}
        placeholder="e.g.: https://gist.github.com/sampleGistId"
        errorMessage={errorMessage}
      />
      <PrimaryButton
        style={{ marginTop: "1.5rem", float: "right" }}
        text="Import"
        onClick={onImportClick}
      />
    </Content>
  );
}
