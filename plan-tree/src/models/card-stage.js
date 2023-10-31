import { makeObservable, observable, computed, action, flow, runInAction, has } from "mobx"
import { useHistory } from 'react-router';
import XifunSdk from '@/utils/XifunSdk';
export const StageStatusNone = 0b00000000;
export const StageStatusCurrent = 0b00000001;
export const StageStatusFirstChild = 0b00000010;
const sdk = XifunSdk.getSite();

export default class CardStageModel {
    @observable currentCard;
    @observable stageStatus = StageStatusNone;
    parentCardId;
    currentProjectDb;
    rootCardId = 'root';
    projectId;
    cardParents = [];
    constructor(currentCardId, parentCardId) {
        this.parentCardId = parentCardId;
        this.currentCardId = currentCardId;
        // 获取root
        const hash = location.hash;
        const hashes = hash.split('/');
        if (hashes.length >= 3) {
            this.cardParents = hashes.slice(2);
            this.projectId = hashes[2];
            this.currentProjectDb = sdk.getProject(this.projectId);
        } else {
            throw (new Error('不够'));
        }
        makeObservable(this);
    }
    async initCardData() {
        const currentCardId = this.currentCardId;
        const parentCardId = this.parentCardId;
        // 如果root 数据不存在, 那么就创建
        if (!currentCardId) {
            var newData = await this.createNewCard('根节点', true);
            this.currentCardId = newData.id;
            runInAction(() => {
                this.currentCard = newData;
            });
        } else {
            if (this.cardParents[this.cardParents.length - 1] == currentCardId) {
                this.stageStatus |= StageStatusCurrent;
            } else if (this.cardParents[this.cardParents.length - 1] == parentCardId) {
                this.stageStatus = StageStatusFirstChild;
            }
            var cardData = await this.getCardData(currentCardId);
            // 如果不存在, 就创建
            if (cardData == null) {
                await this.createNewCard('根节点', true);
            }
            runInAction(async () => {
                this.currentCard = cardData;
            });
        }
    }
    createId() {
        return new Date().getTime()
    }
    async setCardData(id, data) {
        await this.currentProjectDb.setItem(id, data);
    }
    getCurrentId() {
        const pathname = location.hash;
        var paths = pathname.split('/');
        if (paths.length >= 3) {
            const currentCardId = pathname.slice(pathname.lastIndexOf('/') + 1);
            return currentCardId;
        }
        return null;
    }
    async getCardData(id) {
        const result = await this.currentProjectDb.getItem(id);
        return result;
    }
    async delCardData(id) {
        const result = await this.currentProjectDb.delItem(id);
        return result;
    }
    async saveCurrentCard() {
        await this.setCardData(this.currentCard.id, this.currentCard);
    }
    async createNewCard(title, isInit) {
        if (isInit) {
            var id = this.rootCardId;
        } else {
            this.currentCard.idIndex++;
            var id = this.currentCard.id + '_' + (this.currentCard.idIndex || 1);
        }
        var data = {
            title: title,
            id: id,
            idIndex: 1,
            cols: [{
                width: '100',
                cards: []
            }],
        }
        await this.currentProjectDb.setItem(data.id, data);
        return data;
    }
    // get double() {
    //     return this.value * 2
    // }

    // increment() {
    //     this.value++
    // }

    // *fetch() {
    //     const response = yield fetch("/api/value")
    //     this.value = response.json()
    // }
}