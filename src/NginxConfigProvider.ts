import * as vscode from 'vscode';
import { Item } from './Item';
import { Node } from './types';
import datas from './data';

export class NginxConfigProvider implements vscode.TreeDataProvider<Item> {
  private readonly _viewId: string = "view-nginx-conig";
  private _onDidChangeTreeData = new vscode.EventEmitter<Item | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private data: Node[];

  constructor() {
    this.data = datas;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Item): vscode.TreeItem {
    return element;
  }
  getChildren(element?: Item): Thenable<Item[]> {
    if (element) {
      // 查找对应节点的子节点
      const parentNode = this.findNodeById(element.id, this.data);
      if (parentNode && parentNode.children) {
        return Promise.resolve(
          parentNode.children.map(child => new Item(child.label, child.collapsibleState, element, child.icon))
        );
      }
      return Promise.resolve([]);
    } else {
        return Promise.resolve(this.rootNodes());
      }
  }
  rootNodes(): Item[] {
    // 创建PHP开发环境条目
    const phpItem = new Item("PHP开发环境", vscode.TreeItemCollapsibleState.Collapsed, undefined, 'file');
    phpItem.contextValue = 'phpItem';
    // 添加按钮
    phpItem.buttons = [
      {
        iconPath: new vscode.ThemeIcon('settings'),
        tooltip: '配置PHP开发环境'
      }
    ];
    
    return [
      phpItem,
      new Item("MySQL数据库", vscode.TreeItemCollapsibleState.Collapsed, undefined, 'file'),
      new Item("Nginx服务器", vscode.TreeItemCollapsibleState.Collapsed, undefined, 'file'),
      new Item("Redis缓存", vscode.TreeItemCollapsibleState.Collapsed, undefined, 'file'),
      new Item("Memcached缓存", vscode.TreeItemCollapsibleState.Collapsed, undefined, 'file'),
      new Item("PHP扩展", vscode.TreeItemCollapsibleState.Collapsed, undefined, 'file'),
      new Item("PHP配置", vscode.TreeItemCollapsibleState.Collapsed, undefined, 'file'),
      new Item("PHP-FPM", vscode.TreeItemCollapsibleState.Collapsed, undefined, 'file'),
    ];
  }

  // 辅助方法：根据ID查找节点
  private findNodeById(id: string, nodes: Node[]): Node | undefined {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const found = this.findNodeById(id, node.children);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }
  public create(): vscode.TreeView<Item> {
      return vscode.window.createTreeView(this._viewId, {
        treeDataProvider: this,
      });
  }
}