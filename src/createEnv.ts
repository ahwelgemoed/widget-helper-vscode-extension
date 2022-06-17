import { writeFile } from "node:fs/promises";
import { displayError, filesInProject } from "./utils";

export async function createEnv(pathName: string) {
  const filesFound = await filesInProject();

  const widget = filesFound[0];
  if (!widget) {
    displayError("READ DIR ERROR");
    throw new Error("READ DIR ERROR");
  }

  await writeEnv(pathName, widget.path);
}

export async function writeEnv(mxPath: string, projectPath: string) {
  const MX_PROJECT_PATH = `MX_PROJECT_PATH="${mxPath}"`;
  await writeFile(`${projectPath}/.env`, MX_PROJECT_PATH);
}
