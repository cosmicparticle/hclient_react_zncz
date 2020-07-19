import React from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default class PieTypeEchart extends  React.Component{
    getOptions=()=>{
        var colorList = ['#73DDFF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A', '#9E87FF', '#58D5FF']
      const  option = {
            title: {
                text: '用户状态',
                x: 'center',
                y: 'center',
                textStyle: {
                    fontSize: 15
                }
            },
            tooltip: {
                trigger: 'item'
            },
            series: [{
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['24%', '45%'],
                clockwise: true,
                avoidLabelOverlap: true,
                hoverOffset: 15,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            return colorList[params.dataIndex]
                        }
                    }
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{a|{b}：{d}%}\n{hr|}',
                    rich: {
                        hr: {
                            backgroundColor: 't',
                            borderRadius: 3,
                            width: 3,
                            height: 3,
                            padding: [3, 3, 0, -12]
                        },
                        a: {
                            padding: [-30, 15, -20, 15]
                        }
                    }
                },
                labelLine: {
                    normal: {
                        length: 20,
                        length2: 30,
                        lineStyle: {
                            width: 1
                        }
                    }
                },
                data: [{
                    'name': '正常',
                    'value': 125276
                }, {
                    'name': '销户',
                    'value': 22957
                }, {
                    'name': '报停',
                    'value': 41536
                }, {
                    'name': '拆表',
                    'value': 35783
                }, {
                    'name': '关阀',
                    'value':5542
                }, {
                    'name': '待拆迁',
                    'value':5542
                },{
                    'name': '其他',
                    'value': 63504
                }],
            }]
        };
        return option
    }
    getStyle(){
        return {height:'40vh', width:'100%'};
    }
    render(){
        return (
            <ReactEcharts option={this.getOptions()}
                          style={this.getStyle()}
                          className="react_for_echarts" />)
    }
}