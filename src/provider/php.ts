import * as vscode from 'vscode';
import Item from '../Item';
import { Node } from '../types';
import datas from '../data';
import fs from 'fs';
import path from 'path';
import { mkdir } from '../utils';

class PhpProvider implements vscode.TreeDataProvider<Item> {
  private readonly _viewId: string = "view:php";
  private readonly _context: vscode.ExtensionContext;
  private readonly _dir: string;
  private _onDidChangeTreeData = new vscode.EventEmitter<Item | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private data: Node[];

  constructor(private readonly context: vscode.ExtensionContext) {
    this._context = context;
    this._dir = path.join(this._context.extensionPath, 'extensions', 'php');
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
    if (element) {
      // 查找对应节点的子节点
      const parentNode = this.findNodeById(element.id, this.data);
      if (parentNode && parentNode.children) {
        return Promise.resolve(
          parentNode.children.map(child => new Item(child.id, child.label, child.collapsibleState, element, child.icon))
        );
      }
      return Promise.resolve([]);
    } else {
      return Promise.resolve(this.rootNodes());
    }
  }
  rootNodes(): Item[] {
    let items: Item[] = [];
    items.push(
      new Item("php/7.1", "php/7.1", vscode.TreeItemCollapsibleState.None, undefined, 'code-oss')
      .setContextValue('phpItem')
      .setDescription("php 7.1")
    );
    items.push(
      new Item("php/5.6", "php/5.6", vscode.TreeItemCollapsibleState.None, undefined, 'code-oss')
      .setContextValue('phpItem')
      .setDescription("php 5.6")
    );
    return [
      new Item("php/5.6", "php/5.6", vscode.TreeItemCollapsibleState.None, undefined, 'code-oss')
      .setContextValue('phpItem')
      .setDescription("php 5.6")
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
  public createView(): vscode.TreeView<Item> {
      return vscode.window.createTreeView(this._viewId, {
        treeDataProvider: this,
      });
  }
  public registerCommands(): vscode.Disposable[] {
    const install = vscode.commands.registerCommand(`${this._viewId}/install`, async (item: Item) => {
      if (item) {
        const confirmation = await vscode.window.showWarningMessage(
            `确定要安装 "${item.label}" 吗?`,
            { modal: true },
            'ok'
        );
        console.log({confirmation});
      }
    });
    return [ install ];
  }
}

export default PhpProvider;