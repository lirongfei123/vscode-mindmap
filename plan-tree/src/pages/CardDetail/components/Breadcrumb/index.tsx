import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { Breadcrumb } from '@alifd/next';
import { observer, inject } from "mobx-react";
import { useHistory } from 'react-router';
import CardModel from '@/models/card-stage';
import { Link } from 'react-router-dom';

const HeaderLink = (props: {
}) => {
    const [links, setLinks] = useState([]);
    const [projectId, setProjectId] = useState(null);
    let history = useHistory();
    const initLinks = async () => {
        const pathname = history.location.pathname;
        const pathArrs = pathname.split('/').slice(3);
        setProjectId(pathname.split('/')[2]);
        const cardModel = new CardModel(pathArrs[pathArrs.length - 1]);
        const links = [];
        for (var i = 0; i < pathArrs.length; i++) {
            const item = pathArrs[i];
            const nodeData = await cardModel.getCardData(item);
            console.log(nodeData, item, '0000================================');
            if (nodeData) {
                links.push({
                    id: nodeData.id,
                    title: nodeData.title
                });
            }
            
        }
        setLinks(links);
    }
    useEffect(() => {
        initLinks();
        history.listen(() => {
            initLinks();
        });
        return () => {
        }
    }, []);
    return (
        <Breadcrumb>
            {
                links.map((item, index) => {
                    console.log(links);
                    const linkto = links.slice(0, index).reduce((total, item) => {
                        return total + "/" + item.id;
                    }, '');
                    return <Breadcrumb.Item key={item.id} >
                        <Link to={`/detail/${projectId}${linkto}/${item.id}`} component={() => {
                            return <div style={{
                                color: '#fff'
                            }} onClick={() => {
                                history.push(`/detail/${projectId}${linkto}/${item.id}`);
                            }}>{item.title}</div>
                        }}></Link>
                    </Breadcrumb.Item>
                })
            }
        </Breadcrumb>
    );
};

export default HeaderLink;
