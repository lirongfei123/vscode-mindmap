import { IRouterConfig, lazy } from 'ice';
import BasicLayout from '@/layouts/BasicLayout';
const CardDetail = lazy(() => import('@/pages/CardDetail'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const routerConfig: IRouterConfig[] = [
  {
    path: '/detail',
    component: CardDetail
  },
  {
    path: '/',
    children: [
      {
        path: '/',
        exact: true,
        component: Dashboard,
      },
    ],
  },
 
];
export default routerConfig;
