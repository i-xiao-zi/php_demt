import * as vscode from 'vscode';

class Document {
  private path: string;
  private document: vscode.TextDocument | undefined = undefined;
  private editor: vscode.TextEditor | undefined = undefined;
  constructor(path: string) {
    this.path = path;
  }
  public async open(): Promise<vscode.TextDocument> {
    this.document = await vscode.workspace.openTextDocument(this.path);
    return this.document;
  }
  public async show(): Promise<vscode.TextEditor> {
    if (!this.document) {
      return Promise.reject('document not open');
    }
    this.editor = await vscode.window.showTextDocument(this.document, {
        viewColumn: vscode.ViewColumn.Active,
        preserveFocus: true,
        preview: false,
    });
    return this.editor;
  }
}

export default Document;
