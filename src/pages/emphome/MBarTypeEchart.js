import React from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default class MColTypeEchart extends  React.Component{

    getOptions=(data)=>{
        var spNum = 5,_max=100;
        var colorList = ['#73DDFF', '#73ACFF', '#9E87FF', '#FDD56A', '#FDB36A', '#FD866A', '#eb3600'];
        var legendData = ['企业', '考研', '考公', '事业', '创业', '出国','其他'];
        var y_data = ['经济161', '经济162', '会展161', '金融161', '金融162', '旅管161', '旅管182','其他',];
        // var _data1=data[0],_data2=data[1],_data3=data[2],_data4=data[3],_data5=data[4],_data6=data[5],_data7=data[6];
        // var _datamax={};
        // for (let i=0;i<data.length;i++){
        //     let  value=0;
        //     for(let j=0;i<8;j++){
        //         value=value+data[j][i];
        //     }
        //     if(i===0){
        //         _datamax.经济161=value;
        //     }else if(i===1){
        //         _datamax.经济162=value;
        //     }else if(i===2){
        //         _datamax.会展161=value;
        //     }else if(i===3){
        //         _datamax.金融161=value;
        //     }else if(i===4){
        //         _datamax.金融162=value;
        //     }else if(i===5){
        //         _datamax.旅管161=value;
        //     }else if(i===6){
        //         _datamax.旅管182=value;
        //     }else if(i===7){
        //         _datamax.其他=value;
        //     }
        // }
       var _datamax = {'经济161':50,'经济162':55,'会展161':30,'金融161':29,'金融162':45,'旅管161':43,'旅管182':44,'其他':43,},
        _data1 = [35,45,30,25,37,35,28,12],
            _data2 = [10,11,3,4,8,2,9,0],
            _data3 = [6,7,2,1,0,1,0,1],
            _data4 = [0,1,0,0,2,0,0,1],
            _data5 = [0,0,1,0,0,1,0,0],
            _data6 = [0,3,1,4,0,0,0,0],
            _data7 = [0,0,0,0,0,0,0,0];



        var fomatter_fn = function(v) {
            return (v.value / _max * 100).toFixed(0)
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
                bottom: 30
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
                    return p.seriesName + '<br>' + '人数：' + p.value + '<br>' + '占比：' + (p.value / _datamax[p.name] * 100).toFixed(0) + '%';
                },
                extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)'
            },
            xAxis: {
                splitNumber: spNum,
                interval:  _datamax[spNum] / spNum,
                max:  _datamax[spNum],
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
            yAxis: [{
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
            }, {
                show: false,
                inverse: true,
                data: y_data,
                axisLine: {
                    show: false
                }
            }],
            series: [{
                type: 'bar',
                name: '企业',
                stack: '2',
                label: _label,
                legendHoverLink: false,
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: colorList[0]
                    },
                    emphasis: {
                        color: colorList[0]
                    }
                },
                data: _data1
            }, {
                type: 'bar',
                name: '考研',
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
                name: '考公',
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
            }, {
                type: 'bar',
                stack: '2',
                name: '事业',
                legendHoverLink: false,
                barWidth: 20,
                label: _label,
                itemStyle: {
                    normal: {
                        color: colorList[3]
                    },
                    emphasis: {
                        color: colorList[3]
                    }
                },
                data: _data4
            } ,{
                type: 'bar',
                stack: '2',
                name: '创业',
                legendHoverLink: false,
                barWidth: 20,
                label: _label,
                itemStyle: {
                    normal: {
                        color: colorList[4]
                    },
                    emphasis: {
                        color: colorList[4]
                    }
                },
                data: _data5
            }, {
                type: 'bar',
                stack: '2',
                name: '出国',
                legendHoverLink: false,
                barWidth: 20,
                label: _label,
                itemStyle: {
                    normal: {
                        color: colorList[5]
                    },
                    emphasis: {
                        color: colorList[5]
                    }
                },
                data: _data6
            }, {
                type: 'bar',
                name: '其他',
                stack: '2',
                legendHoverLink: false,
                barWidth: 20,
                label: _label,
                itemStyle: {
                    normal: {
                        color: colorList[6]
                    },
                    emphasis: {
                        color: colorList[6]
                    }
                },
                data: _data7
            }]
        };
        return option
    }
    getStyle(){
        return {height:'50vh', width:'100%'};
    }
    render(){
     //   const {data}=this.props.data;
        return (
            <ReactEcharts option={this.getOptions()}
                          style={this.getStyle()}
                          className="react_for_echarts" />)
    }
}