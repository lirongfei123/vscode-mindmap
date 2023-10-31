import  React , {useEffect, useRef, useState} from 'react';
import styles from './index.module.scss';
import { observer, inject } from "mobx-react";
import NormalCard from '../NormalCard';
import CardModel, {StageStatusCurrent, StageStatusNone, StageStatusFirstChild} from '@/models/card-stage';
import { Button } from '@alifd/next';
@inject('cardModel')
@observer
export default class CardContainer extends React.Component<{
    cardModel: CardModel
    colIndex: Number,
    childLength: Number
}> {
    state = {
    }
    async addCard() {
        var newData = await this.props.cardModel.createNewCard('实力');
        const cardModel = this.props.cardModel;
        cardModel.currentCard.cols[this.props.colIndex].cards.push({
            id: newData.id
        });;
        cardModel.saveCurrentCard();
    }
 
    render() {
        const cards = this.props.cardModel.currentCard.cols[this.props.colIndex].cards;
        return (
            <div className={styles.container} style={{
                flex: 1,
                width: `${100/this.props.childLength}%`
            }}>
                {((this.props.cardModel.stageStatus & StageStatusCurrent) == StageStatusCurrent)
                    && <Button size='small' onClick={this.addCard.bind(this)}>添加</Button>}
                <div className={styles.cardWrap}>
                    {cards.map(cardItem => {
                        return <NormalCard childLength={Object.keys(cards).length} key={cardItem.id} cardId={cardItem.id} colIndex={this.props.colIndex} />;
                    })}
                </div>
            </div>
           );
    }
};
