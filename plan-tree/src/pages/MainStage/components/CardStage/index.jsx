import  React , {useEffect, useRef, useState} from 'react';
import { Input, Button, ResponsiveGrid, Card } from '@alifd/next';
import styles from './index.module.scss';
const { Cell } = ResponsiveGrid;
import CardLayout from '../CardLayout';
import { observer, Provider, inject } from "mobx-react";
import CardModel, {StageStatusCurrent, StageStatusNone, StageStatusFirstChild} from '@/models/card-stage';
import { useHistory } from 'react-router';
import CardDetail from '../CardDetail';
const CardStageWrap = (props) => {
  const _cardModel = new CardModel(props.cardId, props.parentCardId);
  const [isInit, setIsInit] = useState(false);
  const [cardModel, setCardModel] = useState(null);
  useEffect(() => {
    _cardModel.initCardData().then(() => {
      setCardModel(_cardModel);
      setIsInit(true);
    });
  }, []);
  var timer;
  return (
    isInit ? <Provider cardModel={cardModel}>
      <CardStage {...props} />
   </Provider> : null
  );
};
const CardStage = inject('cardModel')(observer((props) => {
  const history = useHistory();
  const container = useRef(null);
  return <div  className={styles.stageWrap}>
      <div className={styles.title} >
        <div style={{
          flex: 1
        }}>
          <CardDetail
            colIndex={props.parentColIndex}
            cardId={props.cardId}
            showGo={(props.cardModel.stageStatus & (StageStatusFirstChild)) == StageStatusFirstChild}
            showEdit={(props.cardModel.stageStatus & (StageStatusFirstChild|StageStatusCurrent)) == StageStatusNone}
          />
        </div>
        { ((props.cardModel.stageStatus & (StageStatusCurrent)) != StageStatusNone) && <Button.Group size={'small'}>
        <Button className="basic-button" onClick={() => {
          container.current.updateLayout(1);
        }}>1行</Button>
        <Button className="basic-button" onClick={() => {
          container.current.updateLayout(2);
        }}>2行</Button>
        <Button className="basic-button" onClick={() => {
          container.current.updateLayout(3);
        }}>3行</Button>
        <Button className="basic-button" onClick={() => {
          container.current.updateLayout(4);
        }}>4行</Button>
        <Button className="basic-button" onClick={() => {
          container.current.updateLayout(5);
        }}>5行</Button>
      </Button.Group>}
      </div>
      <div className={styles.content_wrap}>
        <CardLayout ref={container} />
      </div>
    </div>
}));

export default CardStageWrap;
