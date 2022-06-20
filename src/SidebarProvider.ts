import * as vscode from "vscode";
import { addWidgetToWorkspace } from "./addWidgetToWorkspace";
import { createEnv } from "./createEnv";
import { findFiles } from "./createWorkspace";
import { getEnv } from "./getEnv";
import { isWorkspace } from "./isWorkspace";
import { openMendix } from "./openMendix";

export function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case "create-workspace": {
          await findFiles();
          break;
        }
        case "create-env": {
          await createEnv(data.value);
          break;
        }
        case "open-mx": {
          await openMendix();
          break;
        }
        case "get-env": {
          const mxPath = await getEnv();
          const isWorkspaceBool = await isWorkspace();
          webviewView.webview.postMessage({
            command: "is-workspace",
            value: isWorkspaceBool,
          });
          webviewView.webview.postMessage({
            command: "mx-path",
            value: mxPath,
          });
          break;
        }
        case "add-widget-to-workspace": {
          await addWidgetToWorkspace(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const nonce = getNonce();
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/SidePannel.js")
    );

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta http-equiv="Content-Security-Policy" content=" img-src https: data:;">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: var(--vscode-editor-font-family);
          }
          button {
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
            border-radius: 4px;
            font-family: var(--vscode-editor-font-family);
            background-color: var(--vscode-button-background);
          }
          a{
            width:100%;
            margin-top:10px;
            padding-top:10px;
            border-radius:4px;
            padding-bottom:10px;
            border:1px solid var(--vscode-button-background);
          }
          .btn-container {
            display: flex;
            padding-top:10px;
            flex-direction: column;
            text-align: center;
          }
          input {
            border-radius: 4px;
            width: 100%;
            font-size: 14px;
            border: none;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            padding-top: 10px;
            padding-left: 6px;
            padding-right: 6px;
            padding-bottom: 10px;
          }
          .container-btn {
            display: flex;
            padding-top: 12px;
            justify-content: space-between;
          }
          input[type="file"] {
            display:none;
          }
          button:disabled {
            background-color: var(--vscode-button-secondaryBackground);
          }
          .custom-file-upload {
              border-radius: 4px;
              border: 1px solid var(--vscode-button-background);
              display: inline-block;
              padding: 6px 12px;
              cursor: pointer;
          }
          h3,h4{
            color:var(--vscode-input-placeholderForeground)
          }
        </style>
			</head>
      <body>
			</body>
      <script nonce="${nonce}">const tsVscode = acquireVsCodeApi()</script>
      <script nonce="${nonce}" src="${scriptUri}"></script>
			</html>`;
  }
}
