import React from 'react'
import './index.css'
import { Row } from 'antd';
import HCWelcome from './HCWelcome'
import BrushController from "echarts/src/component/helper/BrushController";
/**
const HOME_CONFIG = {
    component       : HomePage,
    blockIds        : null,
    excludeBlockIds : null
};
**/
export default class Home extends React.Component{
    render(){
        return (
            <div >
                <Row>
                    <HCWelcome ></HCWelcome>
                </Row>

            </div>
        );
    }
}