import * as vscode from 'vscode';
import Item from '../Item';
import { Node } from '../types';
import datas from '../data';
import fs from 'fs';
import path from 'path';
import Document from '../Document';
import { mkdir } from '../utils';

class NginxProvider implements vscode.TreeDataProvider<Item> {
  private readonly _viewId: string = "view:nginx";
  private readonly _context: vscode.ExtensionContext;
  private readonly _dir: string;
  private _onDidChangeTreeData = new vscode.EventEmitter<Item | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private data: Node[];

  constructor(private readonly context: vscode.ExtensionContext) {
    this._context = context;
    this._dir = path.join(this._context.extensionPath, 'configs', 'nginx');
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
    const files = fs.readdirSync(this._dir);
    const items: Item[] = [];
    files.map(file => {
      if (file.endsWith(".conf")) {
        const stat = fs.statSync(path.join(this._dir, file));
        if (stat.isFile()) {
          items.push(
            new Item(file, file, vscode.TreeItemCollapsibleState.None, undefined, 'code-oss')
            .setContextValue('nginxConfigItem')
            .setDescription(file)
            .setCommand('Open Item', 'pde.editFile', [path.join(this._dir, file)], 'Open Item')
          );
        }
      }
    });
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
    const newNginxConfigFile = vscode.commands.registerCommand('pde.newNginxConfigFile', async () => {
        const name = await vscode.window.showInputBox({
          prompt: '请输入文件名',
          placeHolder: '请输入文件名',
          validateInput: (value: string) => {
            if (/[<>:"/\\|?*]/.test(value)) {
                return '文件名不能包含特殊字符: < > : " / \\ | ? *';
            }
            if (value.endsWith('.conf')) {
              const stat = fs.existsSync(path.join(this._dir, value));
              return stat ? '文件已存在' : null;
            }
            return '请输入.conf文件';
          },
        });
        console.log({name});
        if (name) {
          fs.writeFileSync(path.join(this._dir, name), `
          server {
              default_type 'text/html';
              charset utf-8;
              listen 8070; # 监听的端口号
              autoindex off; 
              server_name localhost;  #监听的域名
              # 存放nginx日志的路径
              access_log /usr/src/nginx/logs/welink.log combined;
              index index.html index.htm index.jsp index.php;
              #error_page 404 /404.html
              if ( $query_string ~* ".*[\;'\<\>].*" ) {
                  return 404;
              }
              location / {
                  index index.html; # 请求入口文件
                  root  /data/welink/dist/; # 请求的目录
              }
          }
          `);
          const doc = new Document(path.join(this._dir, name));
          await doc.open();
          await doc.show();
        }
      });
      const delNginxConfigFile = vscode.commands.registerCommand('pde.delNginxConfigFile', async (item: Item) => {
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
    return [ newNginxConfigFile, delNginxConfigFile ];
  }
}

export default NginxProvider;