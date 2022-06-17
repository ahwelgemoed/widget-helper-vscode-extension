import * as vscode from "vscode";

import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "pluggablewidgethelper-sidebar",
      sidebarProvider
    )
  );
}

export function deactivate() {}
