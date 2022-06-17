/// <reference types="svelte" />

import * as _vscode from "vscode";

declare global {
  const tsVscode: {
    postMessage: ({ command: string, value: any }) => void;
  };
}
