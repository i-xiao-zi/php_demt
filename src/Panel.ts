import * as vscode from 'vscode';
import { Meta, Webview } from './Webveiw';

export interface PanelType {
    title: string;
    name: string;
}

class Panel extends Webview {
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    public constructor(extensionUri: vscode.Uri, meta: Meta) {
        super(extensionUri, meta);
        const panel = vscode.window.createWebviewPanel("hello-world", this._meta.title, vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(vscode.Uri.file(__dirname), '..', 'dist', 'webview')]
        });
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getHtml(this._panel.webview);
    }
    
    public render() {
        this._panel.reveal(vscode.ViewColumn.One);
    }
    
    public dispose() {
        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}

export default Panel;