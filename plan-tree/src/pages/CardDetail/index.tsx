
import React, { useEffect, useState } from "react";
import './index.scss';
import styles from './index.module.scss';
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useLocation,
  useParams
} from "react-router-dom";
import CardStageModel from '@/models/card-stage';
import Breadcrumb from './components/Breadcrumb';
import MainStage from '@/pages/MainStage/index';
import { useHistory } from 'react-router';
import XifunSdk from "@/utils/XifunSdk";
const sdk = XifunSdk.getSite();
export default function AnimationExample() {
  const history = useHistory();
  const [newRootId, setNewRootId] = useState(null);
  useEffect(() => {
    console.log(sdk);
    const hash = history.location.pathname;
    const paths = hash.split('/');
    if (paths.length <= 2) {
      const cardModel = new CardStageModel();
      cardModel.initCardData().then(() => {
        setNewRootId(cardModel.currentCardId);
      });
    }
    console.log(history);
  }, []);
  return (
    <Router>
      <Switch>
        <Route exact path="/detail/:projectId">
          <Redirect to={`${history.location.pathname}/root`} />
        </Route>
        <Route path="*">
          <AnimationApp />
        </Route>
      </Switch>
    </Router>
    
  );
}

function AnimationApp() {
  let location = useLocation();
  const [oldPathLength, setOldPathLength] = useState(0);
  const [transitionType, setTransitionType] = useState('slideLeft');
  useEffect(() => {
    const pathname = location.pathname;
    const pathLength = pathname.split('/').length;
    if (pathLength > oldPathLength) {
      setTransitionType('slideLeft');
    } else {
      setTransitionType('slideRight');
    }
    setOldPathLength(pathLength);
  }, [location]);
  return (
    <div className={styles.body_wrap}>
      <Breadcrumb />
      <div className={[styles.main_wrap, transitionType].join(' ')}>
        <TransitionGroup>
          <CSSTransition
            key={location.pathname}
            classNames={'slide'}
            timeout={350}
          >
            <Switch location={location}>
              <Route path="/detail/*" children={<MainStage />} />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
}

