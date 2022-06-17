import * as vscode from "vscode";
import { spawn } from "node:child_process";
import { displayError } from "./utils";

export async function openMendix() {
  const findMendixProject = await vscode.workspace.findFiles("**/*.mpr");

  if (findMendixProject.length) {
    const mxPath = findMendixProject[0].path;

    spawn("open", [mxPath]);
  } else {
    displayError("Cant find .mpr for Mendix Project");
  }
}
