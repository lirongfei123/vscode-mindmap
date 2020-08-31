# 启动

安装

```
npm install -g grunt-cli rollup
# 到kityminder的目录下执行bower install
```

1. 按 vscode 的调试按钮，自动运行 npm run watch（自动编译 vscode 插件）
2. 进入 webui 目录,运行`npm run build:watch`，自动编译 webui/main.js 文件，这个文件是脑图与 vscode 桥接。
3. 如果修改了脑图源码要运行`npm run build`, 但是这样会删除第二步生成的文件,需要让 2 重新编译

# 参考资料

- https://github.com/SeakeyCode/kityminder-editor
- https://github.com/fex-team/kityminder-core
  - [文档](https://github.com/fex-team/kityminder-core/wiki)
- [第三方组织](https://github.com/naotu)
