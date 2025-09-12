import * as vscode from 'vscode';

export class Item extends vscode.TreeItem {
  public readonly id: string;
  public buttons?: Array<{
    iconPath: string | vscode.Uri | { light: string | vscode.Uri; dark: string | vscode.Uri } | vscode.ThemeIcon;
    tooltip: string;
    command?: string;
  }>;

  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly parent?: Item,
    iconName?: string
  ) {
    super(label, collapsibleState);
    // 生成唯一ID
    this.id = parent ? `${parent.id}-${label}` : label;
    
    // 设置图标
    if (iconName) {
      this.iconPath = new vscode.ThemeIcon(iconName);
    } else {
      this.iconPath = new vscode.ThemeIcon(parent ? 'file' : 'folder');
    }

    // 设置命令
    this.command = {
      command: 'lnmp.openItem',
      title: 'Open Item',
      arguments: [this.label, this.id]
    };

    // 上下文值（可用于右键菜单）
    this.contextValue = parent ? 'child' : 'parent';
  }
}