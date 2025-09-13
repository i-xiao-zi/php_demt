import * as vscode from 'vscode';

class Item extends vscode.TreeItem {
  constructor(
    public readonly id: string,
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

  public setDescription(description: string): Item {
    this.description = description;
    return this;
  }

  public setCommand(title: string, command: string, args?: any[], tooltip?: string): Item {
    this.command = {title, command, arguments: args, tooltip};
    return this;
  }
}

export default Item;