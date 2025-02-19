import * as React from 'react';
import { Box, Search, Card, Tag, ResponsiveGrid, Divider, Typography, Icon, Loading } from '@alifd/next';
import styles from './index.module.css';
import XifunSdk from '@/utils/XifunSdk';
import { useHistory } from 'react-router';
const { useState, useEffect } = React;
const { Group: TagGroup, Selectable: SelectableTag } = Tag;
const { Cell } = ResponsiveGrid;
const DEFAULT_DATA = {
  tagsA: ['类目一', '类目二', '类目三', '类目四', '类目五', '类目六', '类目七', '类目八', '类目九', '类目十'],
  tagA: '类目一',
  tagsB: ['不到一年', '一年以上三年以下', '三年以上五年以下', '五年以上'],
  tagB: '一年以上三年以下',
  cards: new Array(7).fill({
    title: '图片型卡片标题',
    content: '图片型卡片描述图片型卡片描述图片型卡片描述图片型卡片描述图片型卡片描述',
    link: ['链接一', '链接二'],
  }),
};

const CardList = (props) => {
  const { dataSource = DEFAULT_DATA, onSearch = () => {} } = props;
  const [projectList, setProjectList] = useState([]);
  const [tagAValue, setTagAValue] = useState(dataSource.tagA);
  const [tagBValue, setTagBValue] = useState(dataSource.tagB);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const sdk = XifunSdk.getSite();
    sdk.getProjectList(1).then(list => {
      setProjectList(list);
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  const history = useHistory();
  const onTagAValueChange = (v) => {
    setLoading(true);
    setTagAValue(v);
  };

  const onTagBValueChange = (v) => {
    setLoading(true);
    setTagBValue(v);
  };

  const onSearchClick = () => {
    setLoading(true);
    onSearch();
  };

  const renderTagListA = () => {
    return dataSource.tagsA.map((name) => (
      <SelectableTag key={name} checked={tagAValue === name} onChange={() => onTagAValueChange(name)} {...props}>
        {name}
      </SelectableTag>
    ));
  };

  const renderTagListB = () => {
    return dataSource.tagsB.map((name) => (
      <SelectableTag key={name} checked={tagBValue === name} onChange={() => onTagBValueChange(name)} {...props}>
        {name}
      </SelectableTag>
    ));
  };

  const renderCards = () => {
    return projectList.map((c, i) => (
      <Cell colSpan={3} className={styles.listItem} key={i}>
        <div className={styles.listMain} onClick={() => {
          history.push('/detail/' + c.id);
        }}>
          <img src="https://shadow.elemecdn.com/app/element/list.76b098b1-1732-11ea-948d-7d2ddf6d1c39.png" alt="img" />
          <div className={styles.listContent}>
            <div className={styles.listTitle}>{c.name}</div>
            <div className={styles.listInfo}>{c.name}</div>
            <div className={styles.listLink}>
              {/* <a href="#">{c.link[0]}</a>
              <a href="#">{c.link[1]}</a> */}
            </div>
          </div>
        </div>
      </Cell>
    ));
  };
  const addCard = async () => {
    const sdk = XifunSdk.getSite();
    const projectData = await sdk.createProject('随机数' + new Date().getTime(), 1, {
      a: 1
    });
    // 创建一个默认节点
    setProjectList([...projectList, projectData]);
  }
  return (
    <>
      <Card free className={styles.cardList}>
        <Box align="center">
          <Search type="primary" hasIcon={false} searchText="搜索" onSearch={onSearchClick} />
        </Box>
        <Divider
          dashed
          style={{
            margin: '24px 0',
          }}
        />
        <Box className={styles.tagBox}>
          <div className={styles.tagBoxItem}>
            <Typography.Text className={styles.tagTitleName}>内容分类</Typography.Text>
            <TagGroup>{renderTagListA()}</TagGroup>
          </div>
          <div className={styles.tagBoxItem}>
            <Typography.Text className={styles.tagTitleName}>时间</Typography.Text>
            <TagGroup>{renderTagListB()}</TagGroup>
          </div>
        </Box>
      </Card>
      <Loading
        visible={loading}
        style={{
          display: 'block',
        }}
      >
        <ResponsiveGrid gap={20}>
          <Cell colSpan={3} className={styles.listItem}>
            <Box className={styles.listAdd} justify="center" align="center" onClick={() => {
              addCard();
            }}>
              <Icon type="add" className={styles.listIcon} />
              <div className={styles.addText}>添加内容</div>
            </Box>
          </Cell>
          {renderCards()}
        </ResponsiveGrid>
      </Loading>
    </>
  );
};

export default CardList;
