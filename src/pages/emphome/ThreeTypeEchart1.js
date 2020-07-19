import React from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default class ThreeTypeEchart extends  React.Component{
    getOptions=()=>{
             var data1 = [{
            text: '待完善',
            value: '11',
            color: '#5dd054'
        }, {
            text: '待约谈',
            value: '0',
            color: '#097ff9'
        }, {
            text: '待上报',
            value: '11',
            color: '#ff6804'
        }];

        function dataFormat(v = {
            value: '12345,12',
            color: '#5dd054'
        }) {
            return [{
                value: 0,
                name:v.text +"\n\n"+ v.value,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [{
                                offset: 0,
                                color: '#00feff'
                            },
                                {
                                    offset: 1,
                                    color: v.color
                                }
                            ]
                        )
                    }
                },
                label: {
                    normal: {
                        textStyle: {
                            fontSize: 22,
                            fontWeight: 500,
                            color: '#fff'
                        }
                    }
                }
            }]
        }

        const  option = {
            backgroundColor:'#04184A',
            legend: {
                show: false
            },
            tooltip: {
                show: false
            },
            series: [{
                type: 'pie',
                radius: ['55%', '70%'],
                center: ['18%', '50%'],
                hoverAnimation: false,
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: dataFormat(data1[0])
            }, {
                type: 'pie',
                radius: ['55%', '70%'],
                center: ['50%', '50%'],
                hoverAnimation: false,
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: dataFormat(data1[1])
            }, {
                type: 'pie',
                radius: ['55%', '70%'],
                center: ['82%', '50%'],
                hoverAnimation: false,
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: dataFormat(data1[2])
            }],
        };
        return option
    }
    getStyle(){
        return {height:'30vh', width:'100%'};
    }
    render(){
        return (
            <ReactEcharts option={this.getOptions()}
                          style={this.getStyle()}
                          className="react_for_echarts" />)
    }
}