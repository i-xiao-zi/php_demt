import * as vscode from 'vscode';
import Panel from './Panel';
import { ViewProvider } from './ViewProvider';
import { MainTreeProvider } from './MainTreeProvider';
import { NginxConfigProvider } from './NginxConfigProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pde" is now active!');
	
	// 存储SettingPanel实例
	const disposable = vscode.commands.registerCommand('pde.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from pde!');
		// 创建SettingPanel实例并传递'setting'参数
		const settingPanel = new Panel(context.extensionUri ,Panel.metas.SETTING);
		// 调用实例的render方法
		settingPanel.render();
		// 将dispose方法添加到context.subscriptions，确保在扩展停用时正确清理资源
		context.subscriptions.push({
			dispose: () => {
				if (settingPanel) {
					settingPanel.dispose();
				}
			}
		});
	});
	// left view
	const leftView = vscode.window.registerWebviewViewProvider('pde-view', new ViewProvider(context.extensionUri, ViewProvider.metas.LEFT));
	const header = vscode.window.createTreeView('pde-header', {
		treeDataProvider: new MainTreeProvider(),
	});
	const nginx_config = new NginxConfigProvider().create();

	context.subscriptions.push(disposable, leftView, header, nginx_config);
}

export function deactivate() {}
