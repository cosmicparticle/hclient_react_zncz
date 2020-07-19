import React from 'react'
import './index.css'
import { Row, Col,Button } from 'antd';
import AnyEchart from "./AnyEchart";
import LineEchart from "./LineEchart";
import AniEchart from "./AniEchart";
import ThreeTypeEchart from "./ThreeTypeEchart";
import ThreeTypeEchart1 from "./ThreeTypeEchart1";
import LiquidFillEchart from "./LiquidFillEchart";
import RootTypeEchart from "./RootTypeEchart";
import ColTypeEchart from "./ColTypeEchart";
import MBarTypeEchart from "./MBarTypeEchart";
import M3BarTypeEchart from "./M3BarTypeEchart";
import ColTypeEchart2 from "./ColTypeEchart2";
import Super from "../../super";
/**
const HOME_CONFIG = {
    component       : HomePage,
    blockIds        : null,
    excludeBlockIds : null
};
**/
export default class Home extends React.Component{

    // state={
    //     mbarData:{}
    //
    // }
    //
    // componentDidMount(){
    //     Super.super({
    //         url:"ks/c/waiting/classdistrib",
    //     }).then((res)=>{
    //         console.log(res)
    //         let mbarDataKey = res.result.queryKey
    //         Super.super({
    //             url:"ks/query/"+mbarDataKey+"/1",
    //         }).then((res)=>{
    //             console.log(res)
    //
    //             this.setState({
    //               //  mbarDataKey:res,
    //             })
    //         })
    //         this.setState({
    //             mbarDataKey:res,
    //         })
    //     })
    //
    // }


        render(){

    //        const {mbarData}=this.state;

            const titleStyle={
                color:'black',
                fontSize:'30px',
                paddingBottom:'20px',
                paddingTop:'10px',
                //border:'1px solid blue',
            };
            return (
                <div >
                    <Row  >
                        <Col className="gutter-row" style={titleStyle} align={"middle"}>
                            * * * * ** *** 待  办  事  项 *** ** * * * *
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <ThreeTypeEchart1  />
                        </Col>
                        <Col span={12}>
                            <ThreeTypeEchart />
                        </Col>
                    </Row>
                    <Row  >
                        <Col className="gutter-row" style={titleStyle} align={"middle"}>
                           * * * * ** *** 待  就 业 情 况 分 析 *** ** * * * *
                        </Col>
                    </Row>
                    <Row type={"flex"} align={"middle"} justify={"space-around"}>
                        <Col span={24}>
                            <MBarTypeEchart />
                        </Col>

                        <Col span={0}>
                            <M3BarTypeEchart />
                        </Col>

                    </Row>
                    <Row  >
                        <Col className="gutter-row" style={titleStyle} align={"middle"}>
                            * * * * ** *** 已 就 业 情 况 分 析 *** ** * * * *
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <LiquidFillEchart />
                        </Col>
                        <Col span={9}>
                            <AnyEchart />
                        </Col>
                        <Col span={9}>
                            <ColTypeEchart />
                        </Col>
                    </Row>



                </div>
        );
    }
}