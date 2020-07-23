import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const matchableFileTypes: string[] = ['xmind', 'km'];
const viewType = 'vscode-mindmap.editor';
export class MindEditorProvider implements vscode.CustomTextEditorProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}
  static register(context: vscode.ExtensionContext) {
    const provider = new MindEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      }
    );

    return providerRegistration;
  }
  resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    const onDiskPath = vscode.Uri.file(
      path.join(this.context.extensionPath, 'webui', 'mindmap.html')
    );
    const resourcePath = vscode.Uri.file(
      path.join(this.context.extensionPath, 'webui')
    );

    const resourceRealPath = webviewPanel.webview.asWebviewUri(resourcePath);
    // const resourceRealPath = resourcePath.with({ scheme: resourceSchema });
    const fileContent =
      process.platform === 'win32'
        ? fs.readFileSync(onDiskPath.path.slice(1)).toString()
        : fs.readFileSync(onDiskPath.path).toString();
    const html = fileContent.replace(
      /\$\{vscode\}/g,
      resourceRealPath.toString()
    );
    const fileName = document.fileName;
    const extName = path.extname(fileName);

    const importData = document.getText() || '{}';

    if (!matchableFileTypes.includes(extName.slice(1))) {
      return;
    }
    const panel = webviewPanel;
    panel.webview.options = {
      enableScripts: true,
    };
    panel.webview.html = html;
    panel.webview.onDidReceiveMessage(
      (message: any) => {
        switch (message.command) {
          case 'loaded':
            panel.webview.postMessage({
              command: 'import',
              importData,
              extName,
            });
            return;

          case 'save':
            try {
              const retData = JSON.parse(message.exportData);
              this.updateDocument(
                document,
                JSON.stringify(retData, null, 4),
                true
              );
            } catch (ex) {
              console.error(ex);
            }
            return;
          case 'draft':
            try {
              const retData = JSON.parse(message.exportData);
              this.updateDocument(
                document,
                JSON.stringify(retData, null, 4),
                false
              );
            } catch (ex) {
              console.error(ex);
            }
            return;
          case 'clicklink':
            this.notifyExternalExtensions({
              type: 'clicklink',
              from: 'mindmap',
              link: message.link,
            });
            break;
          //   case 'exportToImage':
          //     const buffer = imgService.base64ToPng(message.exportData);
          //     destFileName = fileName.replace(/(\.xmind|\.kme|\.km)/, '.png');
          //     writeFileToDisk(destFileName, buffer);
          //     return;
        }
      },
      undefined,
      this.context.subscriptions
    );

    panel.onDidDispose(
      () => {
        // emit event to webview
      },
      null,
      this.context.subscriptions
    );
  }

  //   /**
  //    * processing source data
  //    * @param fileName
  //    * @param extName
  //    */
  //   private getImportData(fileName: string, extName: string, xmind: Xmind) {
  //     if (extName === '.xmind') {
  //       return JSON.stringify(xmind.process());
  //     }

  //     return fs.readFileSync(fileName).toString();
  //   }

  private notifyExternalExtensions(message: any) {
    this.extensionChannels.forEach((chanel) => {
      chanel.postMessage(message);
    });
  }
  private updateDocument(
    document: vscode.TextDocument,
    newContent: string,
    save?: boolean
  ) {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      newContent
    );
    const editTask = vscode.workspace.applyEdit(edit);
    if (save) {
      editTask.then(() => {
        document.save();
      });
    }
  }

  get extensionChannels() {
    return vscode.extensions.all
      .filter(
        (ext) =>
          ext.isActive && ext.exports && ext.exports.exportedMessageChannel
      )
      .map((ext) => ext.exports.exportedMessageChannel);
  }
}
