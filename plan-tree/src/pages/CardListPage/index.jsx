import * as React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import CardList from './components/CardList';

const { Cell } = ResponsiveGrid;

const CardListPage = () => {
  return (
    <ResponsiveGrid gap={20}>

      <Cell colSpan={12}>
        <CardList />
      </Cell>
    </ResponsiveGrid>
  );
};

export default CardListPage;
