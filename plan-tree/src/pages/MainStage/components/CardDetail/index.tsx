import React, { createRef, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { useHistory } from 'react-router';
import CardModel from '@/models/card-stage';

import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CardStage from '../CardStage';
import { Input, Tag } from '@alifd/next';
import { runInAction } from 'mobx';
function CardDetail(props) {
    const [cardModel, setCardModel] = useState(null);
    const history = useHistory();
    const pathname = history.location.pathname;
    const delCard = async (cardId) => {
        const cardModel = props.cardModel;
        cardModel.delCardData(cardId).then(async () => {
            // 看看有没有子元素,如果有子元素, 提示先删除子元素
            const cardData = await props.cardModel.getCardData(cardId);
            let childLen = cardData.cols.reduce((total, item) => {
                return total + item.cards.length;
            }, 0);
            if (childLen > 0) {
                alert('请删除子元素');
                return;
            }
            cardModel.currentCard.cols[props.colIndex].cards = cardModel.currentCard.cols[props.colIndex].cards.filter(item => {
                return item.id != cardId;
            });
            cardModel.saveCurrentCard();
        });

    };
    useEffect(() => {
        const tempModel = new CardModel(props.cardId, props.cardModel.currentCardId);
        tempModel.initCardData().then(() => {
            setCardModel(tempModel);
          });
    }, []);
    if (cardModel) {
        return props.showEdit ? <div onClick={() => {
            history.push(`${pathname}/${props.cardId}`);
        }} className={styles.wrap}>
            {props.isLastChild ? <div className={styles.tagText}>
                {cardModel.currentCard.title}
            </div> : <span className={styles.detailTitle}>{cardModel.currentCard.title}</span>}
        </div> : <div className={styles.wrap} style={{
        }} >
            <Input style={{
               flex: 1
            }} disabled={props.disabled} value={cardModel.currentCard.title} onChange={(value) => {
                runInAction(() => {
                    cardModel.currentCard.title = value;
                    cardModel.saveCurrentCard();
                });
            }} />
            {props.showGo && <span style={{
                marginLeft: '10px',
                marginRight: '10px',
                color: '#fff'
            }} onClick={() => {
                history.push(`${pathname}/${props.cardId}`);
            }}>拆分</span>}
            {props.isLastChild && <span style={{
                marginLeft: '10px',
                marginRight: '10px',
                color: '#fff'
            }} onClick={() => {
                delCard(props.cardId);
            }}>删除</span>}
        </div>;
    } else {
        return null;
    }
    
}
export default inject('cardModel')(observer(CardDetail));
