# 启动

1. 按vscode的调试按钮，自动运行npm run watch（自动编译vscode插件）
2. 进入webui目录,运行`npm run build:rollup`，自动编译webui/main.js文件，这个文件是脑图与vscode桥接。
3. 如果修改了脑图源码要运行`npm run build`, 但是这样会删除第二步生成的文件,需要让2重新编译