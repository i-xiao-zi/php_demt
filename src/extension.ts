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
	const editFile = vscode.commands.registerCommand('pde.editFile', async (...args: string[]) => {
		vscode.window.showInformationMessage('Hello World from pde.editFile!');
		console.log({args});
		const doc = await vscode.workspace.openTextDocument(args[0]);
		const editor = await vscode.window.showTextDocument(doc, {
			viewColumn: vscode.ViewColumn.Active,
			preserveFocus: true,
			preview: false,
		});
	});

	const main_provider = new MainTreeProvider(context);
	const main_view = main_provider.createView();
	main_provider.registerCommands();
	// nginx config view
	const nginx_config_provider = new NginxConfigProvider(context);
	const nginx_config_view = new NginxConfigProvider(context).createView();
	const nginx_config_disposables = nginx_config_provider.registerCommands();

	context.subscriptions.push(disposable, main_view, nginx_config_view, editFile, ...nginx_config_disposables);
}

export function deactivate() {}
