import * as vscode from 'vscode';

export interface Meta {
    title: string;
    name: string;
}

export class Webview {
    protected readonly _uri: vscode.Uri;
    protected readonly _meta: Meta;
    public static metas: { [key: string]: Meta } = {
        SETTING: {
            title: '设置',
            name: 'setting',
        },
        MAIN: {
            title: '主界面',
            name: 'main',
        },
        LEFT: {
            title: '左侧导航',
            name: 'left',
        },
    };

    public constructor(extensionUri: vscode.Uri, meta: Meta) {
        this._uri = vscode.Uri.joinPath(extensionUri, "dist", "webview");
        this._meta = meta;
    }
    public _getHtml(webview: vscode.Webview) {
        const webviewUri = webview.asWebviewUri(vscode.Uri.joinPath(this._uri, this._meta.name + ".js"));
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${this._meta.title}</title>
          </head>
          <body>
            <div id="root"></div>
            <script defer src="${webviewUri.toString()}"></script>
          </body>
      </html>
    `;
    }
}