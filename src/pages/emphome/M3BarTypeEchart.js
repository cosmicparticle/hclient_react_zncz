import React from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default class M3ColTypeEchart extends  React.Component{
    getOptions=()=>{
        var spNum = 5;
        var colorList = ['#eb3600', '#FDD56A', '#73DDFF'];
        var legendData = [ '困难','跟进', '快了'];
        var y_data = ['经济161', '经济162', '会展161', '金融161', '金融162', '旅管161', '旅管182','其他',];
        var _datamax = {'经济161':50,'经济162':55,'会展161':30,'金融161':29,'金融162':45,'旅管161':43,'旅管182':44,'其他':43,},
            _data1 = [10,15,10,13,15,11,19,20],
            _data2 = [19,5,10,3,15,21,10,13],
            _data3 = [21,35,10,13,15,11,25,10];
        var fomatter_fn = function(v) {
            //return (v.value / _max * 100).toFixed(0)
            return v.value;
        }
        var _label = {
            normal: {
                show: true,
                position: 'inside',
                formatter: fomatter_fn,
                textStyle: {
                    color: '#fff',
                    fontSize: 16
                }
            }
        };
      const  option = {
            backgroundColor: '#091034',
            legend: {
                data: legendData,
                textStyle: {
                    color: '#ccc'
                }
            },
            grid: {
                containLabel: true,
                left: 0,
                right: 15,
                bottom: 30,
            },
            tooltip: {
                show: true,
                backgroundColor: '#fff',
                borderColor: '#ddd',
                borderWidth: 1,
                textStyle: {
                    color: '#3c3c3c',
                    fontSize: 16
                },
                formatter: function(p) {
                    console.log(p);
                    var _arr = p.seriesName.split('/'),
                        idx = p.seriesIndex;//1，2，3
                    return  p.seriesName + '<br>' + '人数：' + p.value + '<br>' + '占比：' + (p.value / _datamax[p.name] * 100).toFixed(0) + '%';
                },
                extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)'
            },
            xAxis: {
                splitNumber: spNum,
               // interval: _max / spNum,
                max: _datamax[spNum],
                axisLabel: {
                    show: false,
                    formatter: function(v) {
                        // var _v = (v / _max * 100).toFixed(0);
                        // return _v == 0 ? _v : _v + '%';
                        return v;
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }

            },
            yAxis: [ {
                show: false,
                inverse: true,
                data: y_data,
                axisLine: {
                    show: false
                },
            },{
                data: y_data,
                inverse: true,
                axisLabel: {
                        fontSize: 16,
                        color: '#fff'
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },],
            series: [{
                type: 'bar',
                name: '困难',
                stack: '2',
                label: _label,
                legendHoverLink: false,
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: colorList[0]
                    },
                    emphasis: {
                        color: colorList[0],
                    }
                },
                data: _data1
            }, {
                type: 'bar',
                name: '跟进',
                stack: '2',
                legendHoverLink: false,
                barWidth: 20,
                label: _label,
                itemStyle: {
                    normal: {
                        color:colorList[1]
                    },
                    emphasis: {
                        color:colorList[1]
                    }
                },
                data: _data2
            }, {
                type: 'bar',
                stack: '2',
                name: '快了',
                legendHoverLink: false,
                barWidth: 20,
                label: _label,
                itemStyle: {
                    normal: {
                        color: colorList[2]
                    },
                    emphasis: {
                        color: colorList[2]
                    }
                },
                data: _data3
            }]
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