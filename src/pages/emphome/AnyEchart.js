import React from 'react';
import ReactEcharts from 'echarts-for-react';


export default class AnyEchart extends React.Component{

    getOptions=()=>{
        const options  = {
            backgroundColor: "#38445E",
            title: {
                text: '就业去向分布',
                padding:20,
                x: 'center',
                textStyle: {
                    color:'#fff',
                    fontSize: 22,
                }
            },
            grid: {
                left: '12%',
                top: '10%',
                bottom: '10%',
                right: '8%'
            },
            xAxis: {
                data: ['企业', '考研', '考公', '事业', '创业', '出国','其他' ],
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 129, 109, 0.1)',
                        width: 1 //这里是为了突出显示加上的
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    }
                }
            },
            yAxis: [{
                splitNumber: 2,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 129, 109, 0.1)',
                        width: 1 //这里是为了突出显示加上的
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#999',
                        fontSize: 14
                    }
                },
                splitArea: {
                    areaStyle: {
                        color: 'rgba(255,255,255,.5)'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 129, 109, 0.1)',
                        width: 0.5,
                        type: 'dashed'
                    }
                }
            }
            ],
            series: [{
                name: 'hill',
                type: 'pictorialBar',
                barCategoryGap: '0%',
                symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
                label: {
                    show: true,
                    position: 'top',
                    distance: 5,
                    color: '#0000FF',
                    fontWeight: 'bolder',
                    fontSize: 20,
                },
                itemStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(0, 0,255, .8)' //  0%  处的颜色
                            },
                                {
                                    offset: 1,
                                    color: 'rgba(0, 0,255, .1)' //  100%  处的颜色
                                }
                            ],
                            global: false //  缺省为  false
                        }
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                data: [6, 1, 1, 0, 0, 3,  0],
                z: 10
            }]
        };
        return options
    }
    getStyle(){
        return {height:'50vh', width:'100%'};
    }
    render(){
        return (
            <ReactEcharts option={this.getOptions()}
                style={this.getStyle()}
                className="react_for_echarts" />)
    }
}