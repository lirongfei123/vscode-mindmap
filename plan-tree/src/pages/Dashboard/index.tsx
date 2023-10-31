import * as React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import Guide from './components/Guide';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

const { Cell } = ResponsiveGrid;

const Dashboard = () => {
  const history = useHistory();
  useEffect(() => {
    if (window.vscode) {
      window.addEventListener('message', function (event) {
        console.log(event);
        window.message = event.data;
        const { command, extName } = window.message;
        window.fileExtName = extName;
        switch (command) {
          case 'import': {
            const importData = window.message.importData;
            console.log(importData, command, extName);
            window.initTreeData = importData;
            history.push('/detail/1');
            break;
          }
        }
      });
      window.vscode.postMessage({
        command: 'loaded',
      });
    }
  });
  return <div>等待数据</div>;
};

export default Dashboard;
