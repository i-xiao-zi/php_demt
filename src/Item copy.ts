import * as vscode from 'vscode';

export class Item extends vscode.TreeItem {
  constructor(
    public readonly id: string;
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly parent?: Item,
    iconName?: string
  ) {
    super(label, collapsibleState);
    this.id = id;
    if (iconName) {
      this.iconPath = new vscode.ThemeIcon(iconName);
    }
    this.contextValue = parent ? 'child' : 'parent';
  }

  public setContextValue(contextValue: string): Item {
    this.contextValue = contextValue;
    return this;
  }

  public setCommand(title: string, command: string, tooltip?: string, arguments?: any[]): Item {
    this.command = {title, command, tooltip, arguments};
    return this;
  }
}