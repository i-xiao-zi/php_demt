import * as vscode from 'vscode';
import Item from '../Item';
import { Node } from '../types';
import datas from '../data';
import fs from 'fs';

class MainProvider implements vscode.TreeDataProvider<Item> {
  private readonly _viewId: string = "view:main";
  private readonly _context: vscode.ExtensionContext;
  private _onDidChangeTreeData = new vscode.EventEmitter<Item | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private data: Node[];

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
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
          parentNode.children.map(child => new Item(child.id,child.label, child.collapsibleState, element, child.icon))
        );
      }
      return Promise.resolve([]);
    } else {
        return Promise.resolve(this.rootNodes());
      }
  }
  rootNodes(): Item[] {
    const php = new Item("php","PHP", vscode.TreeItemCollapsibleState.None, undefined, 'file')
      .setContextValue('php')
      .setCommand('切换PHP版本', 'pde.switchPhpVersion', [], '切换PHP版本');
    const nginx = new Item("nginx","Nginx", vscode.TreeItemCollapsibleState.None, undefined, 'file')
      .setContextValue('nginx');
    const mysql = new Item("mysql","MySQL", vscode.TreeItemCollapsibleState.None, undefined, 'file')
      .setContextValue('mysql');
    const redis = new Item("redis","Redis", vscode.TreeItemCollapsibleState.None, undefined, 'file')
      .setContextValue('redis');
    const kafka = new Item("kafka","Kafka", vscode.TreeItemCollapsibleState.None, undefined, 'file')
      .setContextValue('kafka');
    const zookeeper = new Item("zookeeper","Zookeeper", vscode.TreeItemCollapsibleState.None, undefined, 'file')
      .setContextValue('zookeeper');
    return [ php, nginx, mysql, redis, kafka, zookeeper ];
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
  public createView(): vscode.TreeView<Item> {
      return vscode.window.createTreeView(this._viewId, {
        treeDataProvider: this,
      });
  }
  public registerCommands(): vscode.Disposable[] {
    const switchPhpVersion = vscode.commands.registerCommand('pde.switchPhpVersion', async () => {
      const phpVersion = await vscode.window.showQuickPick([
        {
          label: '7.4',
          description: 'PHP 7.4',
        },
        {
          label: '8.0',
          description: 'PHP 8.0',
        },
      ]);
    });
    return [ switchPhpVersion ];
  }
}

export default MainProvider;