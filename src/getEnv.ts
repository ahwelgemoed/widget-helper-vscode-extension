import { readFile, writeFile } from "node:fs/promises";
import * as vscode from "vscode";
import { CodeWorkSpace, displayMessage, filesInProject } from "./utils";

export async function getEnv() {
  const { workspaceFile } = vscode.workspace;
  if (workspaceFile) {
    displayMessage("Getting ENV for Workspace");
    const readWorkspaceFile = await readFile(workspaceFile.path, "utf8");
    if (!workspaceFile) {
      return;
    }
    const parsedWorkspaceFile: CodeWorkSpace = JSON.parse(readWorkspaceFile);

    const mendixObj = parsedWorkspaceFile.folders.find(
      (x) => x.type === "mendix"
    );

    return mendixObj?.path;
  }
  /**
   * Getting ENV from Non Workspace
   */
  if (!workspaceFile) {
    displayMessage("Getting ENV for Non Workspace");
    const filesFound = await filesInProject();
    if (!filesFound) {
      return;
    }
    const widget = filesFound[0];
    if (!widget) {
      return;
    }
    const readEnv = await readFile(`${widget?.path}/${widget?.env}`, "utf8");
    const ENVMATCH = /MX_PROJECT_PATH=(.*)/;

    const processEnv = ENVMATCH.exec(readEnv);
    if (!processEnv) {
      return;
    }
    const mendixPath = processEnv[1];
    return mendixPath.replace(/\"/g, "");
  }
}
