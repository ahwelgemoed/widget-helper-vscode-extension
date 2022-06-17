import * as vscode from "vscode";
import { readdir } from "node:fs/promises";

export const envParamName = "MX_PROJECT_PATH";

export type CodeWorkSpace = {
  folders: FolderTypes[];
  settings: {};
};
export type FolderTypes = {
  name: string;
  path: string;
  type: TTypes;
};
type TTypes = "mendix" | "mainWidget" | "widget";

export function displayError(error: string) {
  vscode.window.showErrorMessage(error);
}
export function displayMessage(message: string) {
  vscode.window.showInformationMessage(message);
}

export async function filesInProject() {
  const arrayOfCurrentFolders = vscode.workspace.workspaceFolders;

  if (vscode.workspace.workspaceFile) {
    displayError("Work Space Already Here");
    throw new Error("Work Space Already Here");
  }

  if (!arrayOfCurrentFolders) {
    displayError("NO PATH FOUND");
    throw new Error("NO PATH FOUND");
  }

  const filesFound = await Promise.all(
    arrayOfCurrentFolders.map(async (dir) => {
      if (!dir.uri.fsPath) {
        displayError("NO PATH FOUND");
        throw new Error("NO PATH FOUND");
      }
      try {
        const files = await readdir(dir.uri.fsPath);
        const env = files.find((x) => x === ".env");
        const packageJson = files.find((x) => x === "package.json");
        if (!packageJson) {
          return;
        }
        return {
          path: dir.uri.fsPath,
          env,
          packageJson,
        };
      } catch (error) {
        displayError("READ DIR ERROR");
        throw new Error("READ DIR ERROR");
      }
    })
  );
  return filesFound;
}
