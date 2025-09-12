const esbuild = require('esbuild');
const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');
const webviewOnly = process.argv.includes('--webview');
const extensionOnly = process.argv.includes('--extension');
const fs = require('fs');
const path = require('path');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

// 编译扩展主文件
async function buildExtension() {
	const ctx = await esbuild.context({
		entryPoints: [
			'src/extension.ts'
		],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outfile: 'dist/extension.js',
		external: ['vscode'],
		logLevel: 'silent',
		plugins: [
			/* add to the end of plugins array */
			esbuildProblemMatcherPlugin,
		],
	});
	if (watch) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}

// 获取 webview 目录下的所有子文件夹
function getWebviewEntryPoints() {
	const webviewDir = path.join(__dirname, 'src', 'webview');
	let entryPoints = {};

	try {
		const items = fs.readdirSync(webviewDir, { withFileTypes: true });
		items.forEach(item => {
			if (item.isDirectory()) {
				if (fs.existsSync(path.join(webviewDir, item.name, 'index.tsx'))) {
					entryPoints[item.name] = path.join('src/webview', item.name, 'index.tsx');
				}
			}
		});
	} catch (error) {
		console.error('读取 webview 目录失败:', error);
	}

	return entryPoints;
}

// 编译 WebView React 组件
async function buildWebView() {
	// 获取所有 webview 子文件夹
	const entryPoints = getWebviewEntryPoints();
	
	if (Object.keys(entryPoints).length === 0) {
		console.log('没有找到需要编译的 webview 文件夹');
		return;
	}
	const ctx = await esbuild.context({
		entryPoints,
		bundle: true,
		format: 'iife', // 立即调用函数表达式，适合浏览器环境
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'browser',
		target: 'es2015',
		outdir: 'dist/webview', // 使用 outdir 而不是 outfile
		loader: {
			'.jsx': 'jsx',
			'.tsx': 'tsx',
			'.ts': 'ts'
		},
		jsx: 'automatic', // 自动引入 React
		logLevel: 'silent',
		plugins: [
			esbuildProblemMatcherPlugin,
		],
	});
	if (watch) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}

async function main() {
	// 根据参数决定编译内容
	if (webviewOnly) {
		// 只编译 WebView
		await buildWebView();
	} else if (extensionOnly) {
		// 只编译扩展
		await buildExtension();
	} else {
		// 并行编译扩展和 WebView
		await Promise.all([
			buildExtension(),
			buildWebView()
		]);
	}
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
