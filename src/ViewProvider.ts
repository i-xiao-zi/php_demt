import * as vscode from 'vscode';
import { Meta, Webview } from './Webveiw';

export class ViewProvider extends Webview implements vscode.WebviewViewProvider {
  public constructor(private readonly extensionUri: vscode.Uri, meta: Meta) {
    super(extensionUri, meta);
  }

  resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): void | Thenable<void> {
    webviewView.webview.options = {
        enableScripts: true,
        localResourceRoots: [
          this._uri,
        ]
      };
    webviewView.webview.html = this._getHtml(webviewView.webview);
  }
}