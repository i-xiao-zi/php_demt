import * as vscode from 'vscode';
import Panel from './Panel';
import { ViewProvider } from './ViewProvider';
import MainProvider from './provider/main';
import NginxProvider from './provider/nginx';
import PhpProvider from './provider/php';
import ExtensionProvider from './provider/extension';
import MysqlProvider from './provider/mysql';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pde" is now active!');
	
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

	const main_provider = new MainProvider(context);
	const main_view = main_provider.createView();
	const main_disposables = main_provider.registerCommands();
	// nginx config view
	const nginx_provider = new NginxProvider(context);
	const nginx_view = new NginxProvider(context).createView();
	const nginx_disposables = nginx_provider.registerCommands();
	// php config view
	const php_provider = new PhpProvider(context);
	const php_view = php_provider.createView();
	const php_disposables = php_provider.registerCommands();
	// php config view
	const mysql_provider = new MysqlProvider(context);
	const mysql_view = mysql_provider.createView();
	const mysql_disposables = mysql_provider.registerCommands();
	// extension view
	const extension_provider = new ExtensionProvider(context);
	const extension_view = extension_provider.createView();
	const extension_disposables = extension_provider.registerCommands();

	context.subscriptions.push(
		editFile,
		main_view, ...main_disposables, 
		nginx_view, ...nginx_disposables,
		php_view, ...php_disposables,
		mysql_view, ...mysql_disposables,
		extension_view, ...extension_disposables
	);
}

export function deactivate() {}
