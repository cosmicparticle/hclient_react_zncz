import React from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default class ThreeTypeEchart extends  React.Component{
    getOptions=()=>{

       const textStyle= {
            color: '#fff',
                fontSize: 22
        }

        const countStyle= {
            color: '#fff',
            fontSize: 28
        }

        const countData=[0,1,1];

        const option = {
            backgroundColor:'#04184A',
            title:{
                text: '就业颜色'
            },
            series: [
                {
                    name: '黄码',
                    type: 'pie',
                    radius: ['40%', '60%'],
                    center: ['20%', '50%'],
                    startAngle: 225,
                    color: [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#FDFF5C'
                    }, {
                        offset: 1,
                        color: '#FFDB5C'
                    }]), "transparent"],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    data: [{
                        value: 75,
                        name: '需跟进',
                        label: {
                            normal: {
                                formatter: '需跟进',
                                textStyle: textStyle
                            }
                        }
                    }, {
                        value: 25,
                        name: '%',
                        label: {
                            normal: {
                                formatter: '\n\n\n\n'+countData[0],
                                textStyle:countStyle
                            }
                        }
                    },
                        {
                            value: 0,
                            name: '%',
                            label: {
                                normal: {
                                    formatter: '',
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 16

                                    }
                                }
                            }
                        }]
                },
                {
                    name: '绿码',
                    type: 'pie',
                    radius: ['40%', '60%'],
                    center: ['53%', '50%'],
                    startAngle: 225,
                    color: [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#9FE6B8'
                    }, {
                        offset: 1,
                        color: '#32C5E9'
                    }]), "transparent"],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    data: [{
                        value: 75,
                        name: '快了',
                        label: {
                            normal: {
                                textStyle: textStyle
                            }
                        }
                    }, {
                        value: 25,
                        name: '%',
                        label: {
                            normal: {
                                formatter: '\n\n\n\n'+countData[1],
                                textStyle: countStyle
                            }
                        }
                    },
                        {
                            value: 0,
                            name: '%',
                            label: {
                                normal: {
                                    formatter: '',
                                    textStyle: textStyle
                                }
                            }
                        }]
                },
                {
                    name: '红码',
                    type: 'pie',
                    radius: ['40%', '60%'],
                    center: ['85%', '50%'],
                    startAngle: 225,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    data: [{
                        value: 75,
                        "itemStyle": {
                            "normal": {
                                "color": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    "offset": 0,
                                    "color": '#FF9F7F'
                                }, {
                                    "offset": 1,
                                    "color": '#FB7293'
                                }]),
                            }
                        },
                        name: '有困难',
                        label: {
                            normal: {
                                textStyle: textStyle
                            }
                        }
                    }, {
                        value: 25,
                        name: '%',
                        label: {
                            normal: {
                                formatter: '\n\n\n\n'+countData[2],
                                textStyle: countStyle
                            }
                        }
                    },
                        {
                            value: 0,
                            name: '%',
                            label: {
                                normal: {
                                    formatter: '',
                                    textStyle: textStyle
                                }
                            }
                        }]
                }
            ]
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