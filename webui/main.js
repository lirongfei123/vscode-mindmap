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
        window.vscode.postMessage({
          command: 'draft',
          exportData: JSON.stringify(window.minder.exportJson(), null, 4),
        });
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
        const { command } = window.message;

        switch (command) {
          case 'import':
            try {
              const importData = JSON.parse(window.message.importData);
              window.minder.importJson(importData);
              listenContentChange();
            } catch (ex) {
              console.error(ex);
            }
            break;
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
          if (
            link &&
            link.url &&
            e.kityEvent.targetShape.container.getType() === 'HyperLink'
          ) {
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
