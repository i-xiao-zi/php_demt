import * as vscode from 'vscode';
import Panel from './Panel';
import { ViewProvider } from './ViewProvider';
import { MainTreeProvider } from './MainTreeProvider';
import NginxProvider from './provider/nginx';
import ExtensionProvider from './provider/extension';
import PhpProvider from './provider/php';

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
	const main_disposables = main_provider.registerCommands();
	// nginx config view
	const nginx_provider = new NginxProvider(context);
	const nginx_view = new NginxProvider(context).createView();
	const nginx_disposables = nginx_provider.registerCommands();

	const extension_provider = new ExtensionProvider(context);
	const extension_view = extension_provider.createView();
	const extension_disposables = extension_provider.registerCommands();
	// php config view
	const php_provider = new PhpProvider(context);
	const php_view = php_provider.createView();
	const php_disposables = php_provider.registerCommands();

	context.subscriptions.push(
		disposable, 
		main_view, ...main_disposables, 
		nginx_view, ...nginx_disposables,
		editFile,
		extension_view, ...extension_disposables,
		php_view, ...php_disposables
	);
}

export function deactivate() {}
