import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import CardStage from './components/CardStage';
import { observer, inject } from "mobx-react";
import { useLocation } from 'react-router';

const MainStage = (props) => {
  const [currentCardId, setCurrentCardId] = useState(null);
  const location = useLocation();
  useEffect(() => {
    const pathname = location.pathname;
    const paths = pathname.split('/');
    setCurrentCardId(paths[paths.length - 1]);
  }, []);
  return (
    <div className={styles.stageWrap}>
      {currentCardId && <CardStage cardId={currentCardId}></CardStage>}
    </div>
  );
};

export default MainStage;
