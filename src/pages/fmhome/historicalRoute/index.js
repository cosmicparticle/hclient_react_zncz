import React from 'react'
import {Col, Row} from 'antd';
import fengmap from 'fengmap';
import '../style.css';
import Super from "./../../../super"
import Units from './../../../units'
import moment from 'moment';
import { Select, Button, message, Slider,DatePicker, TimePicker } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';

const Option = Select.Option;

/**
 * 历史轨迹
 */
export default class HisRoute extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            // fmapID:'10347',
            fmapID : '90884',// 工厂地图
            storeImageDatas:[],
            array:[],
            map : null,
            // 人员头像图层
            peopleImgLayer : null,
            // 车辆照片图层
            carImgLayer : null,
            // 物品照片图片
            goodsImgLayer : null,

            //控制是否可添加电子围栏
            addFenceMarker : false,
            // 添加电子围栏的按钮是否点击了
            addFenceBtn : false,
    
            // 控制是否添加任务头像
            addPeoPleImgMarker : true,
            // 添加人物头像的按钮是否点击了
            showPeoPleImgBtn : false, 
            // 显示车辆头像按钮是否点击了
            showCarImgBtn : false,
            //显示物品头像按钮是否点击了
            showGoodsBtn : false,
            //控制是否可改变图片标注
             changeMarker : false,
            //imagemarker对象, 设备图片对象
             imList : [],
            //多边形图层
            polygonLayer : null,
            //矩形标注
             rectangleMarker : null,
            //圆形标注
             circleMaker : null,
            //自定义形状标注
             polygonMarker : null,
    
            removeBtn: false,
            // 人移动按钮
            moveImaBtn : false,
    
            //判断当前是否点击的是poi,控制点击公共设施的时候只弹出公共设施的信息框
             clickedPOI : false,
            // 点击事件ID
             eventID : null,
            //定义选中模型
             selectedModel : null,
            // 多边形定义的点
            coords : [
                {
                    x: 13297422 ,
                    y: 4113833,
                    z: 1
                },
                {
                    x: 13297516.0,
                    y: 4113735.0,
                    z: 1
                },
                {
                    x: 13297341,
                    y: 4113577,
                    z: 1
                },
                {
                    x: 13297248,
                    y: 4113677,
                    z: 1
                }
            ],

            coodsTagList: [],

            isCoodsTrue : false,
            // 进入的是人员追踪还是人员轨迹
            mmtType : null,
            // 是否可以追踪
            isTrace : false,
            traceCount:0,

            // 清除所有标注按钮
            clearMakerBtn : false, 
            popMarkerList : [],


            // 单个人员历史轨迹的属性
            singleDate:null,
            singleStartTime:null,
            singleStartTimeStamp:0,
            singleEndTime: null,
            singleEndTimeStamp:180,
            singleLocatingEntity:null, 
            singleHisObj:{
                // "t15151551":{}
            },
            // 是否播放历史轨迹
            isSingleTrack: false,
            // 播放到历史轨迹数组中的第几个对象
            curPlayCount:0,
            playCount:0,
            // 对应进度条的位置
            singleSliderCount:0,

            // 历史轨迹播放模式
            trackPattern: 1,



            marks : {
                0: '',
                10: '',
                20: '',
                30: '',
                40: '',
                50: '',
                60: '',
                70: '',
                80: '',
                90: '',
                100: '',
              },
            //当前的路线
            naviLines : [],   
            // 存放画线的点集
            points : [],

        }
    }

    getStyle(){
        return {
            position: 'absolute',
            width: '100%',
            height: '100%',
        }
    }

    componentWillMount() {
        // console.log("componentWillMount...")
    }

    componentWillReceiveProps() {
        // console.log("componentWillReceiveProps...")
    }

    componentWillUpdate() {
        // console.log("componentWillUpdate...")
    }
    componentDidUpdate() {
        // console.log("componentDidUpdate...")

    }
    componentWillUnmount=()=> {
        console.log("人员历史轨迹:componentWillUnmount...")
        this.setState=(status,callback)=>{
  
            
            return;
         }
       
        this.timer !=null && clearInterval(this.timer)   
    }

    componentDidMount() {
        console.log("componentDidMount...")
         // 封装人员的数据
         this.getLocationList("人员");
        this.openMap();

        this.state.map.on('loadComplete', ()=> {
            console.log('地图加载完成！');
          
            });

            // 每100毫秒， 增加1秒， 10倍速度
        this.timer = null;
            this.timer =  setInterval(function () {
                // console.log(" 每100毫秒， 增加1秒");
                if (this.state.isSingleTrack && this.state.trackPattern == 1) { 
                    console.log(" 每100毫秒， 增加1秒");
                   this.setState({
                        curPlayCount: this.state.curPlayCount + 1000,
                    })
                }
            }.bind(this), 100);
        
        
    }
    openMap=()=>{
        let fmapID= this.state.fmapID;

      const  mapOptions = {
            //必要，地图容器
            container: document.getElementById('fengMap'),
            //地图数据位置
            mapServerURL: './data/' + fmapID,
            //主题数据位置
            mapThemeURL: './data/theme',
            //设置主题
            defaultThemeName: '2001',
          mapScaleLevelRange: [16, 23],       // 比例尺级别范围， 16级到23级
          defaultMapScaleLevel: 18,          // 默认比例尺级别设置为19级

          //方向枚举型。可设置正南、正北、正东、正西、东南、西南等方向值。具体可参考fengmap.FMDirection类。
          defaultControlsPose: 200,
            //是否支持单击模型高亮
            modelSelectedEffect: false,
            //必要，地图应用名称，通过蜂鸟云后台创建
            appName: '化工定位',
            //必要，地图应用密钥，通过蜂鸟云后台获取
            key: 'fb90e5786b64ef3229bcf7d683eb5d78'
        };
//        var fmapID = '10347'; //mapId
        //初始化地图对象
        this.state.map = new fengmap.FMMap(mapOptions);
        //打开Fengmap服务器的地图数据和主题
//        map.openMapById(fmapID);

        //打开Fengmap服务器的地图数据和主题
        this.state.map.openMapById(fmapID, function (error) {
            //打印错误信息
            console.log(error);
        });

        //地图加载完成事件
        this.state.map.on('loadComplete', ()=> { 
            console.log('地图加载完成！');
            //显示按钮
        //    document.getElementById('fmbtnsGroup').style.display = 'block';
            
           // 初始化 图层
           let group = this.state.map.getFMGroup(this.state.map.focusGroupID);
           //实例化 人员 ImageMarkerLayer
           let layerPeople = new fengmap.FMImageMarkerLayer();   
           group.addLayer(layerPeople);
           //实例化 车辆 ImageMarkerLayer
           let layerCar = new fengmap.FMImageMarkerLayer();   
           group.addLayer(layerCar);
            //实例化 物品 ImageMarkerLayer
           let layerGoods = new fengmap.FMImageMarkerLayer();   
           group.addLayer(layerGoods);

           //返回当前层中第一个polygonMarker,如果没有，则自动创建
           // 实例化多边形
          let  pm = group.getOrCreateLayer('polygonMarker');

           this.setState({
                   peopleImgLayer : layerPeople,
                   carImgLayer : layerCar,
                   goodsImgLayer : layerGoods,
                   polygonLayer : pm
            })
   
           
        });
        
        //地图点击事件
        this.state.map.on('mapClickNode', this.mapEevent);
    }

    /**
     * 地图点击事件
     */
    mapEevent=(event)=>{

        let array=this.state.array;
        //如果选中模型，修改模型的颜色、透明图、边线颜色
        if (event.nodeType === fengmap.FMNodeType.MODEL && false) {
            // 模型颜色先不修改
            var model = event.target;
            var index = array.indexOf(model.FID);
            if (index != -1) {
                //将选中元素从数组中移除
                array.splice(index, 1);
                //渲染model恢复回主题中的设置
                this.setModelToDefault(model);
                //移除自定义storeImage
                //removeStoreImage(model);
            } else {
                //将选中元素添加到数组中
                array.push(model.FID);
                // 渲染model为自定义颜色
                this.setModelRender(model);
                //添加自定义storeImage
                //addStoreImage(model);
            }
        }
///

        //鼠标左右键点击事件
        let buttonType = event.domEvent.button;
        let buttonTypeText = '';
        if (buttonType === 0) {
            buttonTypeText = '我是鼠标左键点击';
            console.log('我是鼠标左键点击');
        } else if (buttonType === 2) {
            buttonTypeText = '我是鼠标右键点击';
            console.log('我是鼠标右键点击');
        }

        //地图模型
        let target = event.target;
        if (!target) {
            return;
        }
        //筛选点击类型,打印拾取信息
        switch (target.nodeType) {

            //地面模型
            case fengmap.FMNodeType.FLOOR:
                if (this.state.clickedPOI && event.eventInfo.eventID === this.state.eventID) return;
                let info = '拾取对象类型： 地图 \n' +
                    '地图位置坐标：x: ' + event.eventInfo.coord.x + '，y:' + event.eventInfo.coord.y;
                if (this.state.selectedModel) {
                    this.state.selectedModel.selected = false;
                }
                //弹出信息框
                // alert(info);
                console.log(info);
                break;

            //model模型
            case fengmap.FMNodeType.MODEL:
                
                if (this.state.clickedPOI && event.eventInfo.eventID === this.state.eventID) {
                    this.setState({
                        clickedPOI : false
                    })

                    return;
                }
                //过滤类型为墙的model
                if (target.typeID === 300000) {
                    //其他操作
                    return;
                }
                 info = '拾取对象类型： 模型 \n' +
                    'FID：' + target.FID + '\n' +
                    'model中心点坐标：x: ' + target.mapCoord.x + '，y:' + target.mapCoord.y + '\n' +
                    '地图位置坐标：x: ' + event.eventInfo.coord.x + '，y:' + event.eventInfo.coord.y;

                //模型高亮
                if (this.state.selectedModel && this.state.selectedModel.FID != target.FID) {
                    this.state.selectedModel.selected = false;
                }
                target.selected = true;
                this.setState({
                    selectedModel : target,
                })


                setTimeout(function () {
                    //弹出信息框
                    // alert(info);
                    console.log(info);
                }, 300);
                break;

            //公共设施、图片标注模型
            case fengmap.FMNodeType.FACILITY:

                break;
            case fengmap.FMNodeType.IMAGE_MARKER:
                
                // this.setState({
                //     clickedPOI :true,
                //     eventID : event.eventInfo.eventID,
                // })

                //  info = '拾取对象类型： 公共设施 \n' +
                //     '地图位置坐标：x: ' + event.eventInfo.coord.x + '，y:' + event.eventInfo.coord.y;
                // if (this.state.selectedModel) {
                //     this.state.selectedModel.selected = false;
                // }
                //弹出信息框
                // alert(info);


                let type = target.type;
                let markers;
                
                if (type == '人员') {
                    markers = this.state.peopleImgLayer.markers;
                } else if (type == '车辆') {
                    markers = this.state.carImgLayer.markers;
                } else if(type == '物品') {
                    markers = this.state.goodsImgLayer.markers;
                }

                  // 为图片标注添加信息窗
                let  fmIm =  markers.find(imv=>imv.id == target.id);
                  
                this.addPopInfoWindow(fmIm);
                break;
        }

        ////

    }

    /**
     * 添加电子围栏
     * */
    addElectronicFence=()=> {
        if (!this.state.addFenceMarker) {
            //添加多边形标注
            this.addPolygonMarker();
        } 

        this.state.polygonLayer.show =!this.state.addFenceMarker;
         //修改可添加状态
         this.setState({
            addFenceMarker : !this.state.addFenceMarker,
        })
    }

    /**
     * 按钮控制 ， 显示定位设备
     */
    controlLocationPhoto=(typeValue)=> {
        // 显示定位图片
        if (!this.state.showPeoPleImgBtn || !this.state.showCarImgBtn || !this.state.showGoodsBtn) { 
            this.showLocationPhoto(typeValue);
        }

        if (typeValue == "人员") {
            // 控制人员点击按钮
            this.setState({
                showPeoPleImgBtn: !this.state.showPeoPleImgBtn,
            })
             // 显示人员图片
             this.state.peopleImgLayer.show = !this.state.showPeoPleImgBtn;
            // if ( this.state.showPeoPleImgBtn) {
            //     this.state.peopleImgLayer.removeAll();
            // }
             
        } else if (typeValue == "车辆") {
             // 控制车辆点击按钮
            this.setState({
                showCarImgBtn : !this.state.showCarImgBtn,
            })
             // 显示车辆图片
             this.state.carImgLayer.show = !this.state.showCarImgBtn;
            //  this.state.carImgLayer.removeAll();
        } else if (typeValue == "物品") {
            // 控制车辆点击按钮
            this.setState({
                showGoodsBtn : !this.state.showGoodsBtn,
            })
            // 显示物品图片
            this.state.goodsImgLayer.show = !this.state.showGoodsBtn;
            // this.state.goodsImgLayer.removeAll();
        }

    }


     /**
     * 显示定位设备
     * @param typeValue  显示类型。 人员、车辆、物品
     * 定时任务可以执行此
     * */
    showLocationPhoto=(typeValue)=> {
        if (!this.state.showPeoPleImgBtn || !this.state.showCarImgBtn || !this.state.showGoodsBtn) {
            
            Super.super({
                url:'api2/ks/clist/location/list/data',
                query:{
                    type: typeValue, 
                    pageSize:200
                } ,
                method:"GET"
            }).then((res)=>{
               let arr =  res.result.entities;
                arr.forEach(element => {
                    if ( element.标签信息) {
                        let onlyCode = element.标签信息[0].唯一编码;
                        let name = element.基本属性组.名称;
                        let type = element.基本属性组.类型;
                        let status = element.基本属性组.状态;
                        let coord = element.标签信息[0].当前坐标点;
                                                  
                    
                        if (coord != undefined) {
                            let conut = coord.indexOf(',');
                            let conutEnd = coord.indexOf(')');
                            var x = parseInt(coord.substring(1, conut)) + parseInt(13296848);                    
                            var y =  parseInt(coord.substring(conut + 1, conutEnd)) + parseInt(4113685);
                            
                            let  coordsTag = {
                                    id : onlyCode,
                                    name: name,
                                    type : type,
                                    status : status,
                                    x : x,
                                    y : y, 
                                }
                            this.addImageMarker(coordsTag);
                        }                 
                    }
                });
               
               
            })
        } else {
           
        }
    }
    

    /**
     * fengmap.FMImageMarker 自定义图片标注对象，为自定义图层。
     * https://www.fengmap.com/docs/js/v2.5.0/fengmap.FMImageMarker.html
     * @param seconds 播放速度秒
     **/
    addImageMarker=(coordsTag, seconds=3)=> {

        let markers = null;
        let type = coordsTag.type;
        let urlv = require('../images/renxiang.png');
        if (type == "人员") {
             markers =  this.state.peopleImgLayer.markers;
             urlv = require('../images/renxiang.png');
        } else if (type == "车辆") {
            markers =  this.state.carImgLayer.markers;
            urlv = require('../images/car.png');
        } else if (type == "物品") {
            markers =  this.state.goodsImgLayer.markers;
            urlv = require('../images/goods.png');
        }
       
       let fmIm = new fengmap.FMImageMarker({
            //标注x坐标点
            x: coordsTag.x,
            //标注y坐标点
            y: coordsTag.y,
            //设置图片路径
            url: urlv,
            //设置图片显示尺寸
            size: 25,   
            //标注高度，大于model的高度
            height: 1,
            // alwaysShow: true,
            // avoid: false,
        });
          // 设置图片标注的唯一id
          fmIm.id = coordsTag.id;

          fmIm.name = coordsTag.name;
          fmIm.type = coordsTag.type;
          fmIm.status = coordsTag.status;
          // 设置不自动避让（图层遮盖时）
          fmIm.avoid(false);
          
           
        if (markers) {
            let im =  markers.find(imv=>imv.id == coordsTag.id);
                if (im) {
                    im.moveTo({
                        x: coordsTag.x,
                        y: coordsTag.y,
                        time: seconds,
                        callback: function () {
                            // console.log("位置更新完毕");
                        },
                        //更新时的回调函数
                        update: function (currentXY) {
                            // console.log("实时坐标：" + currentXY.x + "," + currentXY.y);
                        }
                    });
                } else {
                    if (type == "人员") {
                        //添加(人的头像)图片标注
                        this.state.peopleImgLayer.addMarker(fmIm);
                    } else if (type == "车辆") {
                        //添加(车辆头像)图片标注
                        this.state.carImgLayer.addMarker(fmIm);
                    } else if (type == "物品") {
                        //添加(物品头像)图片标注
                        this.state.goodsImgLayer.addMarker(fmIm);
                    }
                }      
            }

        // 为图片标注添加信息窗
        // this.addPopInfoWindow(fmIm);
    }

    /**
     * 
     * @param {信息框控件配置} marker 
     */
     addPopInfoWindow=(marker)=> {   
        if (marker) {

            let id = marker.id;
            let name = marker.name;
            let type = marker.type;
            let status = marker.status;

            //添加绑定marker信息窗
            var ctlOpt = {
                //设置弹框的宽度
                width: 200,
                //设置弹框的高度px
                height: 100,
                //设置弹框的内容，文本或html页面元素
                content:  '类型：' +type + '<br/>标签id：' + id+ ' <br/>姓名：' + name  ,
                // content: name,
                //关闭回调函数
                closeCallBack: function () {
                    //信息窗点击关闭操作
                    console.log('信息窗关闭了！');
                }
            };
            //添加弹框到地图上，绑定marker
            var popMarker = new fengmap.FMPopInfoWindow(this.state.map, ctlOpt, marker);
            //popMarker.close(); 关闭信息窗

            // 保存信息框到当前数组中
            this.state.popMarkerList.push(popMarker);

        } else {
            //独立信息窗坐标点
            var target = {
                //地图坐标
                coord: {
                    x: 12961581.8454802,
                    y: 4861817.63647148,
                    z: 0
                },
                groupID: 1 //楼层id
            };
            //添加独立信息窗
            var ctlOpt = {
                //添加信息框的地图位置坐标
                mapCoord: {
                    //设置弹框的x轴
                    x: target.coord.x,
                    //设置弹框的y轴
                    y: target.coord.y,
                    //控制信息框距离地图的高度
                    height: 2,
                    //设置弹框位于的楼层,当前聚焦楼层
                    groupID: target.groupID
                },
                //设置弹框的宽度
                width: 200,
                //设置弹框的高度px
                height: 100,
                //设置弹框的内容
                content: '<a target="_bank" href="https://www.fengmap.com">这是一个独立信息框</a>',
                closeCallBack: function () {
                    //信息窗点击关闭操作
                    console.log('信息窗关闭了！');
                }
            };
            //添加弹框到地图上，独立信息窗
            var popMarker = new fengmap.FMPopInfoWindow(this.state.map, ctlOpt);
            this.state.popMarkerList.push(popMarker);
        }
    }


    /**
     * 为第一层的模型添加多边形标注图层
     * */
    addPolygonMarker=()=> {
 //       debugger
        console.log("addPolygonMarker");
        //获取当前聚焦楼层
        // let group = this.state.map.getFMGroup(this.state.map.focusGroupID);
        // let group = this.state.map.getFMGroup(1);
        //返回当前层中第一个polygonMarker,如果没有，则自动创建
    //    let  pm = group.getOrCreateLayer('polygonMarker');
        // this.setState({
        //     polygonLayer : pm
        // })
//        debugger
        //创建矩形标注
        let rma = this.createRectangleMaker();
 //       debugger
        // this.state.layer.addMarker(rma);
        this.state.polygonLayer.addMarker(rma);

        //创建圆形标注
       let cm =  this.createCircleMaker();
       this.state.polygonLayer.addMarker(cm);

        //创建自定义形状标注
        let cpm = this.createPolygonMaker(this.state.coords);
        this.state.polygonLayer.addMarker(cpm);
    }


    /**
     * 创建矩形标注
     * fengmap.FMPolygonMarker 自定义图片标注对象
     * https://www.fengmap.com/docs/js/v2.5.0/fengmap.FMPolygonMarker.html
     */
    createRectangleMaker=()=> {

        return   new fengmap.FMPolygonMarker({
            //设置颜色
            color: '#9F35FF',
            //设置透明度
            alpha: 0.3,
            //设置边框线的宽度
            lineWidth: 3,
            //设置高度
            height: 25,
            //多边形的坐标点集数组
            points: {
                //设置为矩形
                type: 'rectangle',
                //设置此形状的中心坐标
                center: {
                    x: 13297201.0,
                    y: 4113843.0
                },
                //矩形的起始点设置，代表矩形的左上角。优先级大于center。
                /*startPoint: {
                 x: 1.2961583E7,
                 y: 4861865.0
                 },*/
                //设置矩形的宽度
                width: 70,
                //设置矩形的高度
                height: 70
            }
        });

    }


    /**
     * 创建圆形标注
     * */
    createCircleMaker=()=> {
        return new fengmap.FMPolygonMarker({
            //设置颜色
            color: '#3CF9DF',
            //设置透明度
            alpha: .3,
            //设置边框线的宽度
            lineWidth: 3,
            //设置高度
            height: 15,
            //多边形的坐标点集数组
            points: {
                //设置为圆形
                type: 'circle',
                //设置此形状的中心坐标
                center: {
                    x: 13297123.0,
                    y: 4113906.0
                },
                //设置半径
                radius: 50,
                //设置段数，默认为40段
                segments: 40
            }
        });
    }


    /**
     * 创建自定义形状标注
     * coords 多边形的坐标点集数组
     * 
     * */
    createPolygonMaker=(coords)=> {
        //实例化polygonMarker
        return new fengmap.FMPolygonMarker({
            //设置透明度
            alpha: 0.5,
            //设置边框线的宽度
            lineWidth: 3,
            //设置高度
            height: 28,
            //多边形的坐标点集数组
            points: coords
        });
    }

    /**
     * 删除所有标注
     * */
     deleteMarkerFunc=()=> {
 //           debugger
         this.setState({            
            removeBtn : true
         })
         // 删除电子围栏
        if (this.state.polygonLayer) {
            //移除该层的所有标注
            this.state.polygonLayer.removeAll();
            //修改可添加状态
            this.setState({
                addFenceMarker:true,
                addFenceBtn : false,
            })
        }

        // 删除任务头像
         if (this.state.peopleImgLayer) {
             //移除该层的所有标注
             this.state.peopleImgLayer.removeAll();
            // this.state.imgLayer.show = false;
             //修改可添加状态
             this.setState({
                addPeoPleImgMarker:true,
                addPeoPleImgBtn : false,
             })
         }

    }

    /**
     * 从远程获取定位实体数据, 并存放在变量中
     * 暂时不用
     */
     getLocationList=(typeValue)=> {

       let  aThis = this;
         Super.super({
            url:'api2/ks/clist/location/list/data',
            query:{
                type: typeValue,
                pageSize:100
            } ,
            method:"GET"
        }).then((res)=>{
            
            let arr =  res.result.entities;
       
            const coodsTagListA = [];

        arr.forEach(element => {
            if ( element.标签信息) {
                let onlyCode = element.标签信息[0].唯一编码;
                let name = element.基本属性组.名称;
                let type = element.基本属性组.类型;
                let status = element.基本属性组.状态;
                let coord = element.标签信息[0].当前坐标点;
                                          
                if (coord != undefined) {
                    let conut = coord.indexOf(',');
                    let conutEnd = coord.indexOf(')');
                    var x = parseInt(coord.substring(1, conut)) + parseInt(13296848);                    
                    var y =  parseInt(coord.substring(conut + 1, conutEnd)) + parseInt(4113685); 
                   
                    let  coordsTag = {
                            id : onlyCode,
                            name: name,
                            type : type,
                            status : status,
                            x : x,
                            y : y,
                        }
                    
                    coodsTagListA.push(coordsTag); 
                       
                }                 
            }
        });

        aThis.setState({
            coodsTagList :coodsTagListA
        })

        })

    }

    /**
     * 解析数据后返回coordsTag
     */
    getCoordsTag=()=> {

    }

/**
 * 设置model颜色、透明度、边线颜色
 * */
setModelRender=(model)=> {
    var modelColor = '#FF00FF'; //模型颜色
    var lineColor = '#3384fd'; //模型边线颜色
    var alpha = 1; //颜色透明度
    if (model) {
        //修改模型颜色及透明度
        model.setColor(modelColor, alpha);
        //修改模型边线的颜色及透明度
        model.setStrokeColor(lineColor, alpha);
    }
}

/**
 * 修改model恢复到主题中的设置
 * */
setModelToDefault=(model)=> {
    if (model) {
        //将模型的颜色及透明度恢复回主题中的设置
        model.setColorToDefault();
        //将模型边线的颜色及透明度恢复回主题中的设置
        model.setStrokeColorToDefault();
    }
}

/**
 * 添加自定义storeImage
 * */
addStoreImage=(model)=> {
    //定义storeImage对象
    var storeImage = {
        size: [10, 10],
        height: 2,
        image: '../images/logo.png',
        angle: 0
    };
    //自定义StoreImage的方法
    model.addStoreImage(storeImage);
    //定义键值对数据对象，方便之后删除对应storeImage
    let storeImageData = {
        fid: model.FID,
        si: storeImage
    };
    this.state.storeImageDatas.push(storeImageData);
}

/**
 * 移除自定义storeImage
 * */
removeStoreImage=(model)=>{
    var storeImageData = null,
        pIndex = 0;
    this.state.storeImageDatas.map(function (item, index) {
        if (item.fid === model.FID) {
            storeImageData = item;
            pIndex = index;
        }
    });

    if (storeImageData != null) {
        var storeImage = storeImageData.si;
        //移除自定义的storeImage的方法
        model.removeStoreImage(storeImage);
        //从原数组中删除该数据
        this.state.storeImageDatas.splice(pIndex, 1);
    }
}

/**
 * 清除所有的 标注， 及弹框
 */
clearMaker=()=>{
    console.log("clearMaker...")
    this.setState({
        showPeoPleImgBtn: false,
        showCarImgBtn : false, 
        showGoodsBtn: false, 
        // clearMakerBtn : true,
    })

    if (this.state.popMarkerList != null) {
        this.state.popMarkerList.forEach(popMarker => {
            popMarker.close()
        });
    }
    
     // 清空弹框的数组    
    this.setState({
        popMarkerList:[],
    })

    if (this.state.peopleImgLayer) {
        this.state.peopleImgLayer.removeAll();
    }
    if (this.state.carImgLayer) {
        this.state.carImgLayer.removeAll();
    }
    if (this.state.goodsImgLayer) {
        this.state.goodsImgLayer.removeAll();
    }
        
   
}


/**
 * 人员追踪按钮点击事件
 */
trace=()=>{
    
    let typeValue = "人员";
    // 获取所有人的定位数据
    Super.super({
        url:'api2/ks/clist/location/list/data',
        query:{
            type: typeValue, 
            pageSize:200
        } ,
        method:"GET"
    }).then((res)=>{
      
       let arr =  res.result.entities;
       
        arr.forEach(element => {
            if ( element.标签信息) {
                let onlyCode = element.标签信息[0].唯一编码;
                let name = element.基本属性组.名称;
                let type = element.基本属性组.类型;
                let status = element.基本属性组.状态;
                let coord = element.标签信息[0].当前坐标点;
                                          
                if (coord != undefined) {
                    let conut = coord.indexOf(',');
                    let conutEnd = coord.indexOf(')');
                    var x = parseInt(coord.substring(1, conut)) + parseInt(13296848);                    
                    var y =  parseInt(coord.substring(conut + 1, conutEnd)) + parseInt(4113685); 
                    const coordsTagListHistory = []
                   
                    let  coordsTag = {
                            id : onlyCode,
                            name: name,
                            type : type,
                            status : status,
                            x : x,
                            y : y,
                            coordsTagListHistory:coordsTagListHistory,
                        }

                       this.tracetwo(coordsTag);               
                }                 
            }
        });
       
       
    })

}

// 根据定位实体， 获取每个定位实体对应的一段时间内的定位数据
tracetwo=(coordsTag)=>{
    // 添加一个图片标注，
    this.addImageMarker(coordsTag);

    let athis = this;
    let coodsTagListA = athis.state.coodsTagList;
    const {startTime, endTime} = athis.state;
    
    
    Super.super({
        url:'api2/ks/clist/location/tag/list/data',
        query:{
            tagCode: coordsTag.id, 
            startTime:startTime,
            endTime:endTime,
            pageSize:200
        } ,
        method:"GET"
    }).then((res1)=>{
        
        
        let arrHistory =  res1.result.entities;
        arrHistory.forEach((element) => {
            let coordHistory = element.基本属性组.坐标点;
            let  tagCodeHistory= element.基本属性组.标签编号;
            let timeHistory = element.基本属性组.采集时间;

            let conutHis = coordHistory.indexOf(',');
            let conutEndHis = coordHistory.indexOf(')');
            var xHis = parseInt(coordHistory.substring(1, conutHis)) + parseInt(13296848);                    
            var yHis =  parseInt(coordHistory.substring(conutHis + 1, conutEndHis)) + parseInt(4113685); 
      
            let  coordsTagHistory = {
                id : tagCodeHistory,
                time: timeHistory,
                x : xHis,
                y : yHis, 
                name:coordsTag.name,
                type:coordsTag.type,
                status: coordsTag.status,
            }
            coordsTag.coordsTagListHistory.push(coordsTagHistory);
            console.log("sdfjo");
        })
        coodsTagListA.push(coordsTag)
        

        athis.setState({
            coodsTagList:coodsTagListA
        })
        
        console.log("11111111" + athis.state.coodsTagList);

    })
}


/**
 * 获取日期时间
 */
onOk=(ov)=>{   
    let startTime = ov[0].format("YYYY-MM-DD HH:mm:ss");
    let endTime = ov[1].format("YYYY-MM-DD HH:mm:ss");
    console.log("startTime: " + startTime);
    console.log("endTime: " + endTime);
    this.setState({
        startTime,
        endTime
    })
}


/**
 * 单个人员历史轨迹， 加载轨迹事件
 * @param {*} e 
 */
singleOk= async (e)=>{
    // 获取定位实体对应的标签标号
    let singleDate =  this.state.singleDate;
    let singleLocatingEntity =  this.state.singleLocatingEntity;
    let singleStartTime =   this.state.singleStartTime;
    let singleEndTime =  this.state.singleEndTime;

    if (singleDate === null) {
        message.info("请选择日期!")  
        e.preventDefault();  
        return   
        }
    if (singleStartTime === null || singleEndTime === null) {
        message.info("请选择开始时间和结束时间!")  
        e.preventDefault();  
        return                       
    }
    if (singleLocatingEntity ===null) {
        message.info("请选择定位实体!")                    
        e.preventDefault();  
        return                  
    }

      // 清除已经存在的线
      this.clearNaviLines()
      this.clearMaker()
  
      this.setState({
          curPlayCount:this.state.singleStartTimeStamp,
        //   points:[],
        //   singleHisObj:{},
      });

    //  加载历史轨迹
    this.singleHis(singleLocatingEntity,  singleDate + " " +singleStartTime, singleDate + " " +singleEndTime, 1500)
}

// 根据定位实体， 获取每个定位实体对应的一段时间内的定位数据
singleHis= async (tagCode, startTime, endTime, pageSize)=>{

    let singleHisObjA = this.state.singleHisObj;
    let coodsTag =  this.state.coodsTagList.find(coodsTag=>coodsTag.id == tagCode);
    singleHisObjA = {}
    singleHisObjA[tagCode]=[]

    let count = 1;
    while(true) {

        let res = await this.getLocationHis(tagCode, startTime, endTime, count, 1500)
       
        let arrHistory =  res.result.entities;
        
        arrHistory.forEach((element) => {
            let coordHistory = element.基本属性组.坐标点;
            let  tagCodeHistory= element.基本属性组.标签编号;
            let timeHistory = element.基本属性组.采集时间;
          
          let timeHisTs =  new Date(timeHistory).getTime();
          
            let conutHis = coordHistory.indexOf(',');
            let conutEndHis = coordHistory.indexOf(')');
            var xHis = parseInt(coordHistory.substring(1, conutHis)) + parseInt(13296848);                    
            var yHis =  parseInt(coordHistory.substring(conutHis + 1, conutEndHis)) + parseInt(4113685); 
      
            let  coordsTagHistory = {
                id : tagCodeHistory,
                time: timeHistory,
                x : xHis,
                y : yHis, 
                name: coodsTag.name,
                type: coodsTag.type,
                status: coodsTag.status,
            }

            if (singleHisObjA[timeHisTs] ==undefined) {
                singleHisObjA[timeHisTs] = {}
            }

            singleHisObjA[timeHisTs] = coordsTagHistory;
            singleHisObjA[tagCode].push(timeHisTs);
        }) 


        count++
        let isEndList = res.result.isEndList;
        if(isEndList) {
            console.log("请求数据结束");
            break;
        }
    }  

        this.setState({
            singleHisObj:singleHisObjA
        })
        
        console.log("hhha: singleHisObjA: ");
        console.log(singleHisObjA);
        message.info("轨迹加载完成！");

        // 开始播放
        this.singlePlay()
}



/**
 *  根据定位实体， 获取每个定位实体对应的一段时间内的定位数据
 * 获取定位历史
 *  */
getLocationHis = async (tagCode, startTime, endTime,pageNo, pageSize)=>{  

    let result = null;
   await Super.super({
        url:'api2/ks/clist/location/tag/list/data',
        query:{
            tagCode: tagCode, 
            startTime:startTime,
            endTime:endTime,
            pageNo:pageNo,
            pageSize:pageSize
        } ,
        method:"GET"
    }).then((res)=>{
        result  =  res;     
    })

    return result;
}



/**
 * 睡眠一会
 * @param {*} ms 
 */
  sleep= async (ms)=> {
    return await new Promise(function(resolve, reject) {
        setTimeout(resolve,ms);
    })
}


setSt= async ()=>{
    this.setState({
        isSingleTrack: !this.state.isSingleTrack,
    })
}

/**
 * 播放单个人员历史轨迹
 */
singlePlay= async ()=>{

    let trackPattern = this.state.trackPattern;
    // 控制播放和暂停
   await this.setSt()
    console.log("模式： " + trackPattern);

    console.log("开始播放---");
            // 人员历史轨迹
            let singleLocatingEntityA = this.state.singleLocatingEntity;
            let singleStartTimeStamp = new Date(this.state.singleDate + " " + this.state.singleStartTime).getTime();
            let singleEndTimeStamp = new Date(this.state.singleDate + " " + this.state.singleEndTime).getTime();
            let singleHisObj = this.state.singleHisObj;
                    
            // 获取存放时间的数组及长度
            let singLeList = singleHisObj[singleLocatingEntityA];

            if (singLeList === undefined || singLeList.length === 0) {
                message.info("无历史轨迹数据,请重新加载")
                this.setState({
                    isSingleTrack: false,
                    curPlayCount:singleStartTimeStamp,
                })
                return
            }

            let len = singLeList.length;
            let center = 0;
           // 寻找 this.state.curPlayCount 对应数组中的下标
            for(let i=0;i<len;i++){  
                if ((i+1) == len) {
                    center = 0;
                    break;
                }
                let min = singLeList[i];
                let max = singLeList[i+1];
                if (this.state.curPlayCount - singLeList[0] <=0) {
                    center = 0;
                    break;
                }
                if (this.state.curPlayCount - singLeList[len -1] >=0) {
                     center = len -1;
                    break;
                }
                if ((this.state.curPlayCount - min >=0) && (this.state.curPlayCount - max <=0)) {
                    center = i;
                    break;
                }
            }
            
            // console.log(" center: " + center);
            let coordsTag = null;
            // 显示第一个数据
            coordsTag =  singleHisObj[singLeList[center]];
            if (coordsTag != null) {
                this.addImageMarker(coordsTag, 1);
            }
           
            // 存放画线的点
            // let points = [];

            // 判断第一次进入    
            let count = 0;
            for(let i=center;i<len;i++){ 
                console.log(" count： " +count + "-" + this.state.isSingleTrack);
                if (count >1 && this.state.isSingleTrack === false) {
                    console.log("暂停设备移动");
                    break
                }
                count++;

                let prevTime = singLeList[i];
                // console.log("i: " + i + " prevTime:"+ prevTime)
                let curTime = null;
                if (i+1 < len) {
                    // 证明 i 不是最后一个
                    curTime = singLeList[i+1];
                }
                             
            if (curTime != null) {

                if(this.state.trackPattern == 1 ) {
                        let  stamp = curTime - prevTime;
                        // 按照10倍速度播放
                        let tStamp = stamp / 10;
                        coordsTag = singleHisObj[curTime] 
                        this.addImageMarker(coordsTag, (tStamp / 1000));
                        // console.log((stamp) + "毫秒后执行我！");
                        // console.log("X: " + coordsTag.x + "  Y: " + coordsTag.y);
                        // console.log("标签时间： " + (coordsTag.time) + " 时间轴时间: " + new Date(this.state.curPlayCount));
                        // console.log(" this.state.playCount: " + this.state.playCount);
                    
                        let point=  {
                            x: coordsTag.x, 
                            y: coordsTag.y, 
                            z: 1
                        }
                        // points.push(point)
                        this.state.points.push(point)
                        this.clearNaviLines()
                        this.addMarkerFunc(this.state.points)

                        this.setState({
                            playCount : i,
                        })
                        // 睡眠多少毫秒
                        await this.sleep(tStamp)    
                }else {
                    let coordsTagBefore = singleHisObj[prevTime]   
                    coordsTag = singleHisObj[curTime] 

                    this.setState({
                        curPlayCount:curTime,
                        playCount : i,
                    })

                    if (coordsTagBefore.x != coordsTag.x && coordsTagBefore.y != coordsTag.y) {
                        this.addImageMarker(coordsTag, 1);

                        let point=  {
                            x: coordsTag.x, 
                            y: coordsTag.y, 
                            z: 1
                        }
                        this.state.points.push(point)
                        this.clearNaviLines()
                        this.addMarkerFunc(this.state.points)
                        // 睡眠多少毫秒
                        await this.sleep(1000) 
                    } 
                }
                } 

                   
            
            }
            debugger

            if ((len-2) <= this.state.playCount) {
                message.info("轨迹播放完毕");
                this.setState({
                    isSingleTrack: false,
                    curPlayCount:singleStartTimeStamp,
                    playCount:0,
                })
                return
            }   
            debugger
}



formatter(value) {
    // value 的值是从1到一百
    // 获取开始时间
    let   singleStartTime = this.state.singleStartTime;
    // 获取结束时间
    let   singleEndTime =  this.state.singleEndTime;
    if (singleStartTime != null) {
        let myDate = new Date(value);
        let h =myDate.getHours();
        let m =myDate.getMinutes();
        let s = myDate.getSeconds();
        let abc = h+ ":" + m + ":" + s
        return `${abc}`;
    }
    return `${value}`;
}


/**
         * 添加线标注按钮事件
         * singlePlay= async (e)=>{
         * */
        addMarkerFunc= (points)=> {

                let naviResults = [
                    {
                        groupId: 1,
                        points: points,
                     },
                ]

                //配置第一条路径线的线型、线宽、透明度等参数
                var lineStyle1 = {
                    //设置线的宽度
                    lineWidth: 5,
                    //是否开启平滑线功能
                    smooth: true,
                    //设置FMARROW线型线的颜色，十六进制颜色值
                    //godColor: '#FF0000',
                    //设置FMARROW线型线边线的颜色,十六进制颜色值
                    //godEdgeColor: '#FF0000',
                    //设置线的类型为导航线
                    lineType: fengmap.FMLineType.FMARROW,
                    //设置线动画,false为动画
                    noAnimate: true
                };

                //绘制第一条路径线
                this.drawLines(naviResults, lineStyle1);

                //配置第二条路径线的线型、颜色、线宽、透明度等
                // var lineStyle2 = {
                //     //设置线的宽度
                //     lineWidth: 5,
                //     //设置线的类型
                //     lineType: fengmap.FMLineType.FULL,
                //     //设置线的颜色, 只支持修改非FMARROW线型的线的颜色
                //     color: '#FF0000'
                // };
                //绘制第二条路径线
                // drawLines(naviResults2, lineStyle2);

        }

        /**
         * 绘制线图层
         * fengmap.FMLineMarker为线图层，可包含很多条折线类FMSegment。
         * https://www.fengmap.com/docs/js/v2.5.0/fengmap.FMLineMarker.html
         * */
        drawLines=(results, lineStyle)=> {
            //创建路径线图层
            var line = new fengmap.FMLineMarker();
            //循环results中坐标点集合，通过坐标点绘制路径线
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var gid = result.groupId;
                var points = result.points;
                //创建FMSegment点集，一个点集代表一条折线
                var seg = new fengmap.FMSegment();
                seg.groupId = gid;
                seg.points = points;
                //将FMSegment绘制到线图层上
                line.addSegment(seg);
                //绘制线
                this.state.map.drawLineMark(line, lineStyle);
                this.state.naviLines.push(line);
            }
        }
        /**
         * 清除路径线
         * */
        clearNaviLines=()=> {
            //方法一：清除所有路径线
            this.state.map.clearLineMark();

            //方法二：清除所有路径线
            /*if (naviLines.length != 0) {
                for (var i = 0; i < naviLines.length; i++) {
                    if (naviLines[i])
                        map.clearLineMark(naviLines[i]);
                }
                naviLines = [];
            }*/

            //方法三：清除所有路径线
            /*if (naviLines.length != 0) {
                for (var i = 0; i < naviLines.length; i++) {
                    if (naviLines[i]) {
                        //移除路径线
                        map.removeLineMarker(naviLines[i]);
                    }
                }
                naviLines = [];
            }*/
        }


/**
 * 初始化按钮
 */
initFormList=()=>{  

    const { Option } = Select;
    const formItemList=[];
    // 人员历史轨迹
           const row =  <Row key={1}>
                <Col span={2}>
                    <Select defaultValue="按时间"  style={{width:'100%',}} disabled={this.state.isSingleTrack}   onSelect={
                        (obj)=>{ 
                            console.log(obj);
                            this.setState({
                                trackPattern:obj,
                                singleHisObj:{},
                            })
                        }
                    }>
                        <Option value="1">按时间</Option>
                        <Option  value="2" >按轨迹</Option>      
                    </Select>
                </Col>
                <Col span={3}>
                    <DatePicker  style={{width:'100%',}} onChange={(ov)=>{
                                 let singleDate = ov.format("YYYY-MM-DD");
                                    console.log(singleDate);
                                 this.setState({
                                    singleDate:singleDate,
                                    singleHisObj:{},
                                })
                               
                             }} disabled={this.state.isSingleTrack} />
                </Col>           
                <Col span={2}>
                        <TimePicker style={{width:'100%',}}  placeholder="开始时间"
                            defaultOpenValue={moment('09:00:00', 'HH:mm:ss')}
                            onChange={(time, timeString)=>{
                                console.log(timeString);   

                                    let singleStartTimeStamp = new Date(this.state.singleDate + " "  + timeString).getTime();
                                    console.log("singleStartTimeStamp:" + singleStartTimeStamp);          
                                    this.setState({
                                        singleStartTime:timeString,
                                        singleStartTimeStamp:singleStartTimeStamp,
                                        curPlayCount:singleStartTimeStamp,
                                        singleHisObj:{},
                                    })
                                }
                            }
                            disabled={this.state.isSingleTrack}  />
                      </Col>  
                      <Col span={2}>
                        <TimePicker  style={{width:'100%',}}   placeholder="结束时间"
                            defaultOpenValue={moment('10:00:00', 'HH:mm:ss')}
                            onChange={(time, timeString)=>{
                                console.log(timeString);   
                                let singleEndTimeStamp = new Date(this.state.singleDate + " "  + timeString).getTime();
                                    this.setState({
                                        singleEndTime:timeString,
                                        singleEndTimeStamp:singleEndTimeStamp,
                                        curPlayCount:this.state.singleStartTimeStamp,
                                        singleHisObj:{},
                                    })
                                }
                            }
                            disabled={this.state.isSingleTrack}  />
                </Col>
                <Col span={3}>
                    <Select  style={{width:'100%',}} disabled={this.state.isSingleTrack}  labelInValue   onSelect={
                        (obj)=>{ 
                            this.setState({
                                singleLocatingEntity:obj.key,
                                singleHisObj:{},
                            })
                        }
                    }>
                        {this.getSelectList()}              
                    </Select>
                </Col>
                <Col span={2}>
                     <Button   disabled={this.state.isSingleTrack}   onClick={(e)=>{this.singleOk(e)}}>加载轨迹</Button>
                </Col>

                 <Col span={8}>
                         <Slider    min={this.state.singleStartTimeStamp} max={this.state.singleEndTimeStamp} 
                                onChange={
                                    (value)=>{ 
                                    console.log("Slider 改变 value: " + value)

                                    if (this.state.singleEndTimeStamp != value){
                                        // 清除已经存在的线
                                        this.clearNaviLines()
                                        this.clearMaker()
                                    }                    

                                    this.setState({
                                        curPlayCount: value,
                                        isSingleTrack:false,//
                                        points:[],
                                    });
                                }
                            } 
                            value={this.state.curPlayCount}
                        tipFormatter={this.formatter.bind(this)} tooltipVisible   />
                    </Col>
                <Col span={2}>
                    <Button  className={this.state.isSingleTrack===true?'isSingleTrack active':'isSingleTrack'}   onClick={()=>{this.singlePlay()}}>
                                {this.state.isSingleTrack===true?'暂停':' 播放'}
                    </Button>
                </Col>
                    
            </Row>
        // 获取所有人员
        formItemList.push(row)


  const aa =  
        <div>
            <Button  onClick={(e)=>{
                let points = [
                    {x: 13297225, y: 4113840, z: 1},
                    {x: 13297189, y: 4113900, z: 1},
                    {x: 13297130, y: 4113852, z: 1}
                ]
                this.addMarkerFunc(points)
            }}>画线</Button>

            <Button  onClick={(e)=>{
                this.clearNaviLines()
            }}>清除线</Button>
        </div>
        // formItemList.push(aa)
    return formItemList;
}


handleChange=(ov)=>{

    console.log(ov.key);

    Super.super({
        url:'api2/ks/clist/location/list/data',
        query:{
            type: ov.key, 
            pageSize:200
        } ,
        method:"GET"
    }).then((res)=>{

        
       let arr =  res.result.entities;
        arr.forEach(element => {
            if ( element.标签信息) {
                let onlyCode = element.标签信息[0].唯一编码;
                let name = element.基本属性组.名称;
                let type = element.基本属性组.类型;
                let status = element.基本属性组.状态;
                let coord = element.标签信息[0].当前坐标点;
                                          
            
                if (coord != undefined) {
                    let conut = coord.indexOf(',');
                    let conutEnd = coord.indexOf(')');
                    var x = parseInt(coord.substring(1, conut)) + parseInt(13296848);                    
                    var y =  parseInt(coord.substring(conut + 1, conutEnd)) + parseInt(4113685);
                    
                    let  coordsTag = {
                            id : onlyCode,
                            name: name,
                            type : type,
                            status : status,
                            x : x,
                            y : y, 
                        }
                    this.state.coodsTagList.push(coordsTag);
                    this.setState({
                        isCoodsTrue : !this.state.isCoodsTrue,
                    })
                }                 
            }
           
        }); 
     
    })

    // coodsTagList
   
}

/**
 * 放回下拉 options
 */
getSelectList=()=>{  
    let data = this.state.coodsTagList;
    // console.log(data);
    if(!data){
        return [];
    } 
    const options=[]
    data.map((item)=>{
        options.push(<Option value={item.id} key={item.name}>{item.name}</Option>)
    })
    return options
}


    render(){
     
        const { Option } = Select;
        return (
            <div >
                 <div style={this.getStyle()} id={'fengMap'}></div>
                    <div  id="fmbtnsGroup" className="fmbtnsGroup">
                        {this.initFormList()}              
                    </div>
            </div>
        );
    }
}
