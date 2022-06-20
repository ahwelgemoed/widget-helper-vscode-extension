import * as vscode from "vscode";

export async function isWorkspace(): Promise<boolean> {
  const workspaceFile = vscode.workspace.workspaceFile;
  return workspaceFile !== undefined;
}
