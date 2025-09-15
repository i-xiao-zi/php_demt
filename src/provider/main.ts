import * as vscode from 'vscode';
import Item from '../Item';
import { Node } from '../types';
import datas from '../data';
import fs from 'fs';
import Panel from '../Panel';

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
    const php = new Item("php","PHP", vscode.TreeItemCollapsibleState.None, undefined, 'gear~spin')
      .setContextValue('php')
      .setCommand('切换PHP版本', 'pde.switchPhpVersion', [], '切换PHP版本');
    const nginx = new Item("nginx","Nginx", vscode.TreeItemCollapsibleState.None, undefined, 'loading~spin')
      .setContextValue('nginx');
    const mysql = new Item("mysql","MySQL", vscode.TreeItemCollapsibleState.None, undefined, 'sync~spin')
      .setContextValue('mysql');
    return [ php, nginx, mysql ];
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
    const setting = vscode.commands.registerCommand(`${this._viewId}/setting`, () => {
      const settingPanel = new Panel(this._context.extensionUri ,Panel.metas.SETTING);
      settingPanel.render();
      this._context.subscriptions.push({
        dispose: () => {
          if (settingPanel) {
            settingPanel.dispose();
          }
        }
      });
    });
    const start = vscode.commands.registerCommand(`${this._viewId}/start`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/start`);
    });
    const restart = vscode.commands.registerCommand(`${this._viewId}/restart`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/restart`);
    });
    const stop = vscode.commands.registerCommand(`${this._viewId}/stop`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/stop`);
    });
    const switch_php = vscode.commands.registerCommand(`${this._viewId}/switch_php`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/switch_php`);
    });
    const start_php = vscode.commands.registerCommand(`${this._viewId}/start_php`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/start_php`);
    });
    const restart_php = vscode.commands.registerCommand(`${this._viewId}/restart_php`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/restart_php`);
    });
    const stop_php = vscode.commands.registerCommand(`${this._viewId}/stop_php`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/restart_php`);
    });
    const start_nginx = vscode.commands.registerCommand(`${this._viewId}/start_nginx`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/start_nginx`);
    });
    const restart_nginx = vscode.commands.registerCommand(`${this._viewId}/restart_nginx`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/restart_nginx`);
    });
    const stop_nginx = vscode.commands.registerCommand(`${this._viewId}/stop_nginx`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/stop_nginx`);
    });
    const start_mysql = vscode.commands.registerCommand(`${this._viewId}/start_mysql`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/start_mysql`);
    });
    const restart_mysql = vscode.commands.registerCommand(`${this._viewId}/restart_mysql`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/restart_mysql`);
    });
    const stop_mysql = vscode.commands.registerCommand(`${this._viewId}/stop_mysql`, () => {
      vscode.window.showInformationMessage(`${this._viewId}/stop_mysql`);
    });
    return [ 
      setting,
      start, restart, stop, 
      switch_php, start_php, restart_php, stop_php, 
      start_nginx, restart_nginx, stop_nginx, 
      start_mysql, restart_mysql, stop_mysql 
    ];
  }
}

export default MainProvider;