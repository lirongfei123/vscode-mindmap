import  React , {createRef, useEffect, useRef, useState} from 'react';
import CardContainer from '../CardContainer/index';
import styles from './index.module.scss';
import { observer, inject } from "mobx-react";
import CardModel from '@/models/card-stage';

@inject('cardModel')
@observer
export default  class CardLayout extends React.Component<{
    cardModel: CardModel
}> {
    updateLayout(colNum) {
        const currentCard = this.props.cardModel.currentCard;
        const cols = currentCard.cols;
        if (cols.length > colNum) {
            // 要删除
            for (let i = cols.length - 1; i >= colNum; i--) {
                if (cols[i].cards.length == 0) {
                    currentCard.cols.splice(i, 1);
                }
            }
        } else {
            // 要增加
            for (let i = cols.length; i < colNum; i++) {
                currentCard.cols.push({
                    width: 0,
                    cards: []
                });
            }
        }
        this.props.cardModel.saveCurrentCard();
    }
    render() {
        return (
            <div className={styles.container}>
               {
                this.props.cardModel.currentCard.cols.map((item, key) => {
                    return <CardContainer childLength={this.props.cardModel.currentCard.cols.length} key={key} colIndex={key} />
                })
               }
            </div>
        );
    }
};
