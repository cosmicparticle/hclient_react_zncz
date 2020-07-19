import React from 'react'
import { Row } from 'antd';
import HouseWelcome from './HouseWelcome'
import BrushController from "echarts/src/component/helper/BrushController";
/**
const HOME_CONFIG = {
    component       : HomePage,
    blockIds        : null,
    excludeBlockIds : null
};
**/
/**
 * 苏州优房
 */
export default class Home extends React.Component{
    render(){
        return (
            <div >
                <Row>
                    <HouseWelcome ></HouseWelcome>
                </Row>

            </div>
        );
    }
}