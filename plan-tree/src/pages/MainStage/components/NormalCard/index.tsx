import  React , {createRef, useEffect, useRef, useState} from 'react';
import styles from './index.module.scss';
import { useHistory } from 'react-router';

import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CardStage from '../CardStage';
import { Input } from '@alifd/next';
import { runInAction } from 'mobx';
import CardDetail from '../CardDetail';
import {StageStatusCurrent, StageStatusNone, StageStatusFirstChild} from '@/models/card-stage';

function NormalCard(props) {
    const [childLen, setChildLen] = useState(0);
    useEffect(() => {
        // 看看有没有子节点
        props.cardModel.getCardData(props.cardId).then(currentNode => {
            var childLen = currentNode.cols.reduce((total, item) => {
                return total + Object.keys(item.cards).length;
            }, 0);
            setChildLen(childLen);
        });
    }, [props.cardModel.currentCard]);
    if (childLen == 0) {
        return <div style={{
            display: 'flex'
        }}>
            <CardDetail
                colIndex={props.colIndex}
                cardId={props.cardId}
                isLastChild={true}
                showGo={true}
                showEdit={(props.cardModel.stageStatus & (StageStatusCurrent)) == StageStatusNone}
            />
        </div>;
    } else {
        return <CardStage cardId={props.cardId} parentCardId={props.cardModel.currentCardId} parentColIndex={props.colIndex}></CardStage>;
    }
}
export default inject('cardModel')(observer(NormalCard));