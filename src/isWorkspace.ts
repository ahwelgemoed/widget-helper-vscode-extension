import * as vscode from "vscode";

export function isWorkspace(): boolean {
  const { workspaceFile } = vscode.workspace;
  return !!workspaceFile;
}
