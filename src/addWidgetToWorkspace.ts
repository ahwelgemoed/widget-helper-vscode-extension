import * as vscode from "vscode";
import { readFile, writeFile } from "node:fs/promises";
import { CodeWorkSpace, displayMessage, FolderTypes } from "./utils";
import { writeEnv } from "./createEnv";

export async function addWidgetToWorkspace(ctx: {
  widgetPath: string;
  envPath: string;
}) {
  const { widgetPath, envPath } = ctx;
  displayMessage("Adding Widget to Workspace");
  const { workspaceFile } = vscode.workspace;

  if (workspaceFile) {
    const readWorkspaceFile = await readFile(workspaceFile.path, "utf8");
    if (!workspaceFile) {
      return;
    }

    const parsedWorkspaceFile: CodeWorkSpace = JSON.parse(readWorkspaceFile);
    const splitPath = widgetPath.split("/");
    const widgetName = splitPath[splitPath.length - 1];

    const newWidget: FolderTypes = {
      name: widgetName,
      path: widgetPath,
      type: "widget",
    };

    parsedWorkspaceFile.folders.push(newWidget);

    await writeFile(workspaceFile.path, JSON.stringify(parsedWorkspaceFile));
    const uri = vscode.Uri.file(workspaceFile.path);
    await vscode.commands.executeCommand("vscode.openFolder", uri);
    await writeEnv(envPath, widgetPath);
  }
}
