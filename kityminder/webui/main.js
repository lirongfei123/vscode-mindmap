/**
 * initial kityminder-editor
 */
angular
  .module('kityminderDemo', ['kityminderEditor'])
  .config(function (configProvider) {
    configProvider.set('imageUpload', '../server/imageUpload.php');
  })
  .controller('MainController', function ($scope) {
    function listenContentChange() {
      if (listenContentChange.listened) return;
      window.minder.on('contentchange', (e) => {
        if (window.fileExtName === '.svg') {
          window.minder.exportData('svg').then((data) => {
            window.vscode.postMessage({
              command: 'draft',
              exportData: data,
            });
          });
        } else {
          window.vscode.postMessage({
            command: 'draft',
            exportData: JSON.stringify(window.minder.exportJson(), null, 4),
          });
        }
      });
      listenContentChange.listened = true;
    }
    $scope.initEditor = function (editor, minder) {
      window.editor = editor;
      window.minder = minder;

      /**
       * receive message event from extension
       */
      window.addEventListener('message', function (event) {
        window.message = event.data;
        const { command, extName } = window.message;
        window.fileExtName = extName;

        switch (command) {
          case 'import': {
            let importTask = Promise.resolve();
            try {
              importTask = importTask.then(() => {
                const importData = window.message.importData;
                if (extName === '.svg') {
                  return new Promise((resolve) => {
                    // 可能出现格式不正确内部抛异常
                    window.minder.importData('svg', importData).then(resolve, resolve);
                  });
                } else {
                  // 可能出现格式不正确内部抛异常
                  window.minder.importJson(JSON.parse(importData || '{}'));
                }
              });
            } catch (ex) {
              console.error(ex);
            }
            importTask.then(listenContentChange, listenContentChange);
            break;
          }
        }
      });

      window.addEventListener('keydown', (e) => {
        const keyCode = e.keyCode || e.which || e.charCode;
        const ctrlKey = e.ctrlKey || e.metaKey;
        if (ctrlKey && keyCode === 83) {
          const btnSave = document.querySelector('.km-export-save');
          btnSave.click();
        }
      });

      window.minder.on('click', (e) => {
        try {
          const link = e.minder.queryCommandValue('HyperLink');
          if (link && link.url && e.kityEvent.targetShape.container.getType() === 'HyperLink') {
            window.vscode.postMessage({
              command: 'clicklink',
              link: link.url,
            });
          }
          // 捕获不到markdown中的链接点击,可能监听window可以做到
        } catch (e) {}
      });

      window.vscode.postMessage({
        command: 'loaded',
      });
    };
  });
