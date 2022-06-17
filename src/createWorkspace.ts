import * as vscode from "vscode";
import { readFile, writeFile } from "node:fs/promises";
import {
  CodeWorkSpace,
  displayError,
  displayMessage,
  filesInProject,
} from "./utils";

type FilesToWorkOn = {
  path: string;
  env?: string;
  packageJson?: string;
};

export async function findFiles() {
  displayMessage("Creating Workspace");
  const filesFound = await filesInProject();
  if (!filesFound) {
    displayError("READ DIR ERROR");
    throw new Error("READ DIR ERROR");
  }
  const cleanFolders = filesFound.filter((x) => x !== undefined);

  const widget: FilesToWorkOn | undefined = cleanFolders[0];

  if (!widget) {
    displayError("No Widget found");
    throw new Error("No Widget found");
  }
  if (!widget.env) {
    displayError("NO ENV found");
    throw new Error("NO ENV found");
  }
  // Assume First OBJ with PackageJSON is Widget
  const readEnv = await readFile(`${widget.path}/${widget.env}`, "utf8");
  const readJson = await readFile(
    `${widget.path}/${widget.packageJson}`,
    "utf8"
  );

  const ENVMATCH = /MX_PROJECT_PATH=(.*)/;

  const processEnv = ENVMATCH.exec(readEnv);

  if (processEnv) {
    const mendixPath = processEnv[1];
    const parsePackageJson = JSON.parse(readJson);
    const spaceName = parsePackageJson.widgetName;

    const workspaceFile: CodeWorkSpace = {
      folders: [
        {
          name: "Mendix Project",
          path: mendixPath.replace(/\"/g, ""),
          type: "mendix",
        },
        { name: spaceName, path: cleanFolders[0]!.path, type: "mainWidget" },
      ],
      settings: {},
    };

    const workspacePath = `${widget.path}/${spaceName}.code-workspace`;

    await writeFile(workspacePath, JSON.stringify(workspaceFile));

    const uri = vscode.Uri.file(workspacePath);
    await vscode.commands.executeCommand("vscode.openFolder", uri);
    displayMessage("Reloading Workspace");
  }
}
