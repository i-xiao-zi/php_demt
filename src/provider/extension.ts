import * as vscode from 'vscode';
import Item from '../Item';
import { Node } from '../types';
import datas from '../data';
import fs from 'fs';
import path from 'path';
import Document from '../Document';
import { mkdir } from '../utils';

class ExtensionProvider implements vscode.TreeDataProvider<Item> {
  private readonly _viewId: string = "view:extension";
  private readonly _context: vscode.ExtensionContext;
  private readonly _dir: string;
  private _onDidChangeTreeData = new vscode.EventEmitter<Item | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private data: Node[];

  constructor(private readonly context: vscode.ExtensionContext) {
    this._context = context;
    this._dir = path.join(this._context.extensionPath, 'configs', 'php');
    mkdir(this._dir);
    this.data = datas;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Item): vscode.TreeItem {
    return element;
  }
  getChildren(element?: Item): Thenable<Item[]> {
    console.log({element});
    if (element) {
      switch(element.id) {
        case 'php':
          return Promise.resolve(this.phpNodes());
        case 'nginx':
          return Promise.resolve(this.nginxNodes());
        default: 
          return Promise.resolve([]);
      }
    } else {
      return Promise.resolve(this.rootNodes());
    }
  }
  private rootNodes(): Item[] {
    const items: Item[] = [];
    items.push(new Item("php", "php", vscode.TreeItemCollapsibleState.Collapsed, undefined, 'code-oss')
      .setContextValue('php')
      .setDescription("php")
    );
    items.push(new Item("nginx", "nginx", vscode.TreeItemCollapsibleState.Collapsed, undefined, 'code-oss')
      .setContextValue('nginx')
      .setDescription("nginx")
    );
    return items;
  }
  private phpNodes(): Item[] {
    const items: Item[] = [];
    items.push(new Item("php/7.1", "php/7.1", vscode.TreeItemCollapsibleState.None, undefined, 'code-oss')
      .setContextValue('phpItem')
      .setDescription("php 7.1")
    );
    items.push(new Item("php/5.6", "php/5.6", vscode.TreeItemCollapsibleState.None, undefined, 'code-oss')
      .setContextValue('phpItem')
      .setDescription("php 5.6")
    );
    return items;
  }
  private nginxNodes(): Item[] {
    const items: Item[] = [];
    items.push(new Item("nginx/1.14", "nginx/1.14", vscode.TreeItemCollapsibleState.None, undefined, 'code-oss')
      .setContextValue('nginxItem')
      .setDescription("nginx 1.14")
    );
    return items;
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
    const reload = vscode.commands.registerCommand(`view:extension/reload`, async (item: Item) => {
      console.log({item});
      if (item) {
        const confirmation = await vscode.window.showWarningMessage(
            `确定要删除 "${item.label}" 吗?`,
            { modal: true },
            'ok'
        );
        console.log({confirmation});
        }
      });
    return [ reload ];
  }
}

export default ExtensionProvider;
