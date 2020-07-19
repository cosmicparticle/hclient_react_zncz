import React from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default class ColTypeEchart extends  React.Component{
    getOptions=()=>{


            var data = [9, 0, 0,3,0,0,13,0]
        var titlename = ['经济161', '经济162', '会展161', '金融161', '金融162', '旅管161', '旅管182','其他',];
        var valdata = [55, 55, 31, 37, 37,37,40,12]
        var myColor = ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6', '#F8B448', '#8B78F6','#F57474'];
        const option = {
            backgroundColor: '#38445E',
            grid:{
                left:'80px',
                bottom:'20px'
            },
            title: {
                text: '班级就业分布',
                padding:20,
                x: 'center',
                textStyle: {
                    color:'#fff',
                    fontSize: 22,
                }
            },
            xAxis: {
                show: false
            },
            yAxis: [{
                show: true,
                data: titlename,
                inverse: true,
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },

                axisLabel: {
                    color: '#fff',
                    fontSize: 14,
                    formatter: function(value, index) {
                        return [
                             '{title|' + value + '} '
                        ].join('\n')
                    },

                    rich: {
                        lg: {
                            backgroundColor: '#339911',
                            color: '#fff',
                            borderRadius: 15,
                            // padding: 5,
                            align: 'center',
                            width: 15,
                            height: 15
                        },
                    }
                },


            }, {
                show: true,
                inverse: true,
                data: valdata,
                axisLabel: {
                    textStyle: {
                        fontSize: 14,
                        color: '#fff',
                    },
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
            }],
            series: [{
                name: '条',
                type: 'bar',
                yAxisIndex: 0,
                data: data,
                barWidth: 8,
                itemStyle: {
                    normal: {
                        barBorderRadius: 30,
                        color: function(params) {
                            var num = myColor.length;
                            return myColor[params.dataIndex % num]
                        },
                    }
                },
                label: {
                    normal: {
                        show: true,
                        fontSize: 14,
                        position: 'inside',
                        formatter: '{c}%'
                    }
                },
            }, {
                name: '框',
                type: 'bar',
                yAxisIndex: 1,
                barGap: '-100%',
                data: [100, 100, 100, 100, 100,100,100,100],
                barWidth: 12,
                itemStyle: {
                    normal: {
                        color: 'none',
                        borderColor: '#00c1de',
                        borderWidth: 2,
                        barBorderRadius: 15,
                    }
                }
            }, ]
        };
        return option
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