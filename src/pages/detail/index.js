import React from 'react'
import {Button,Modal,message,Icon,Drawer,Timeline,Switch,Popover,Card,Form} from 'antd'
import Super from "./../../super"
import Units from '../../units'
import './index.css'
import 'moment/locale/zh-cn'
import ModelForm from '../../components/ModelForm'
import RightBar from './../../components/RightBar'
import BaseInfoForm from './../../components/BaseForm/BaseInfoForm'
import TemplateList from '../../components/templateList';
import EditAddTemplate from '../../components/editAddTemplate';
import Storage from './../../units/storage'
import Formi from './../../components/FormCard/formi'
//import moment from 'moment';
import SetPasswords from '../../components/SetPasswords';
const confirm = Modal.confirm;

export default class Detail extends React.Component{
    state={
        visibleDrawer:false,
        loading:false,
        visibleExport:false,
        fuseMode:false,
        searchText:"",
        options:[],
        visibleForm:false,
        visibleTemplateList:false,
        isNew:false,
        showSetPass:false,
        ratmplId:"无效的",
        rootCode:null,
        isModal:false,
    }
    componentDidMount(){        
        if(!this.props.match){
            this.props.onRef3(this)
        } 
        const {menuId,code,type,ratmplId,rootCode,isModal}=this.props.match?this.props.match.params:this.props
        const nodeId=this.props.match?this.props.match.params.nodeId:null
        const fieldGroupId=this.props.match?null:this.props.fieldGroupId
        const rfieldId=this.props.match?null:this.props.rfieldId
        this.setState({
            menuId,
            type,
            code,
            nodeId,
            fieldGroupId,ratmplId,rootCode,isModal,rfieldId
        })
        this.loadltmpl(menuId,{code,type,versionCode:"",nodeId,fieldGroupId,ratmplId,rootCode,rfieldId})
    }
   // componentWillReceiveProps(nextProps){
   //     console.log(99)
   //     const path=nextProps.location?nextProps.location.pathname.split("/"):null
   //      const {type,code,menuId}=nextProps
   //      this.setState({
   //          menuId,
   //          type,
   //          code,
   //      })
   //  this.loadltmpl(menuId,{type,code})}
    loadltmpl=(menuId,params)=>{
       let {code,type,versionCode,nodeId,fieldGroupId,ratmplId,rootCode,rfieldId}=params
        let url
        if( menuId==='user'){
            url=`api2/meta/tmpl/user/dtmpl/normal/`
        }if(ratmplId){
            url=`api2/meta/tmpl/${menuId}/dtmpl/relation/${ratmplId}`
        }else if(nodeId){
            url=`api2/meta/tmpl/${menuId}/dtmpl/node/${nodeId}`
        }else if(fieldGroupId){
            url=`api2/meta/tmpl/${menuId}/dtmpl/rabc/${fieldGroupId}`
        }else if(rfieldId){
            url=`api2/meta/tmpl/${menuId}/dtmpl/rfield/${rfieldId}`
        }else{
            url=`api2/meta/tmpl/${menuId}/dtmpl/normal/`
        }
        Super.super({
            url,
        method:"GET",
        }).then((res)=>{
            const rightNav=[]
            const premises=res.config.premises
            console.log(premises);
            const actions=res.config.actions
            const menuTitle=menuId==="user"?"用户":res.menu.title
            const requestSelectArr=[] //下拉菜单选项fieldId数组
            const dtmplGroup=res.config.dtmpl.groups
            console.log(dtmplGroup)
            dtmplGroup.forEach((item)=>{
                rightNav.push(item.title)
                if(type==="edit" || type==="new"){
                    item.fields.forEach((it)=>{
                        if(it.type==="select" || it.type==="multiselect" || it.type==="preselect"){
                            requestSelectArr.push(it.fieldId)
                        }
                    })
                }
            })
            if(requestSelectArr.length>0){
                this.requestSelect(requestSelectArr)
            }
            this.forDescsFlag(dtmplGroup)  //提交时添加flag
            if(code){
                this.loadRequest(dtmplGroup,versionCode)
            }else{
                this.setState({
                    columns:this.renderColumns(dtmplGroup),
                    dataSource:new Object(),
                })
            }
            if(premises && premises.length>0){
                rightNav.unshift("默认字段") 
            }
            Storage.rightNav=rightNav //存储
            this.setState({
                dtmplGroup,
                menuTitle,
                actions,
                rightNav,
                premises,ratmplId,rootCode,
            })
        })  
    }
    forDescsFlag=(dtmplGroup)=>{
        const descsFlag=[] 
        dtmplGroup.forEach((item)=>{
            if(item.composite){
                descsFlag.push(item.composite.name)
            }
        })
        this.setState({
            descsFlag
        })
    }
    loadRequest=(dtmplGroup,versionCode)=>{
        const {menuId,type,code,nodeId,fieldGroupId,ratmplId,rfieldId}=this.props.match?this.props.match.params:this.props

        let url_=ratmplId?`api2${menuId}/detail/${ratmplId}/${code}`:
            `api2/entity/${menuId}/detail/${code}`;
            Super.super({
          url:url_,
                query:{
                versionCode,
                nodeId,
                fieldGroupId,rfieldId
            } ,
                method:'GET'
        }).then((res)=>{
            if(res.status==="suc"){
                const arrayMap=res.entity.arrayMap
                const fieldMap=res.entity.fieldMap
                dtmplGroup.forEach((item)=>{
                    if(!item.composite){
                        item.fields.forEach((item)=>{
                            for(let k in fieldMap){
                                if(item.id.toString()===k){
                                    item.value=fieldMap[k]
                                }
                            }
                        })
                    }           
                })
                this.detailTitle(res.entity.title,type)
                for(let k in arrayMap){
                    let totalName
                    dtmplGroup.forEach((item)=>{
                        if(item.composite && item.id.toString()===k){
                            totalName=item.composite.name
                        }
                    })
                    arrayMap[k].forEach((item)=>{
 //                       console.log(item)
                        const fieldMap=Units.forFile(item.fieldMap)
                        fieldMap["code"]=item.code //为了后面操作修改
                        fieldMap["key"]=item.code
                        fieldMap["groupId"]=k
                        fieldMap["totalName"]=totalName
                        if(item.relationLabel){
                            fieldMap["10000"]=item.relationLabel
                        }
                    })
                }
                this.setState({
                    dtmplGroup,
                    columns:this.renderColumns(dtmplGroup),
                    dataSource:arrayMap,
                })
           }else{
               message.error("实体不存在！")
           }             
        })
    }  
    renderHistoryList=(versionCode)=>{
        const {menuId,code,nodeId}=this.state
        Super.super({
            url:`api2/entity/${menuId}/history/${code}/1`,
            query:{
                versionCode,
                nodeId
            } ,
            method:'GET'
        }).then((res)=>{
            let detailHistory
            if(res.history.length>0){
                detailHistory= res.history.map((item,index)=>{
                    const color=item.current?"red":"blue";
                    return <Timeline.Item color={color} key={index}>
                                {Units.formateDate(item.time)}<br/>
                                {`操作人`+item.userName}
                                {item.current?"":<Button 
                                                    style={{marginLeft:10}} 
                                                    code={item.code} 
                                                    type="primary" 
                                                    size="small" 
                                                    onClick={this.toHistory}
                                                    >查看</Button>
                                }                   
                            </Timeline.Item>
                    })
            }
            this.setState({
                detailHistory,
                visibleDrawer: true,
            })
        })
    }
    toHistory=(e)=>{
        const {menuId,code,type}=this.state
        const versionCode=e.target.getAttribute("code");
        this.renderHistoryList(versionCode)
        this.loadltmpl(menuId,{code,type,versionCode})
    }
    detailTitle=(dataTitle,type)=>{
        const {menuTitle}=this.state
		let detailsTitle="";
		if(type==="detail"){
			detailsTitle=menuTitle+"-"+dataTitle+"-详情"
		}else if(type==="edit"){
			detailsTitle=menuTitle+"-"+dataTitle+"-修改"
		}			        		
		this.setState({ 
            detailsTitle,
            menuTitle,
		});
	}
    renderColumns=(dtmplGroup)=>{ //editTable的表头
        const {type}=this.state 
        const columns=[]
        dtmplGroup.forEach((item)=>{
            if(item.composite){
                item.fields.forEach((item)=>{
                    const id=item.id
                    item["dataIndex"]=id               
                    if(type==="detail"){
                        if(item.type==="decimal"){ //排序
                            item["sorter"]=(a, b) => a[id] - b[id]; 
                        }else{
                            item["sorter"]=(a, b) =>{ //排序
                                if(a[id]&&b[id]){
                                    return a[id].length - b[id].length;
                                }
                            }
                        }
                    }
                    if(item.type==="refselect" || item.type==="relselect" ){
                        item['render']= (text, record) => ((record[item.id]===null ||record[item.id]===undefined) ?record[item.id]:record[item.id].split('@R@')[1])
                    }
                })
 //               console.log(item);
                if(item.composite.addType===5){//判断是否有关系属性
                    let rela={
                        dataIndex:"10000",
                        name:"relation",
                        title:"关系",
                        type:"relation",
                        fieldAvailable:true,
                        id:10000,//关系默认id是10000
                        options:item.composite.relationSubdomain
                    }
                    item.fields.unshift(rela) 
                }      
                const order={
                    title: '序号',
                    width:65,
                    dataIndex:'order',
                } 
                item.fields.unshift(order)
                let act;
                if(type!=="detail"){
                     act={
                        title: '操作',
                        key: 'action',
                        render: (record) => (
                        <div className="editbtn">
                            {this.props.match && item.unallowedCreate===null && record.code.length>5?  // 临时将新增和修改同步处理，后面再优化
                                <Button
                                type='primary' 
                                title="编辑当前行" 
                                icon="edit" 
                                size="small"  
                                onClick={()=>this.getForm(record)}
                                ></Button>:""}
                            {this.props.match && ( item.unallowedDelete===null  ) && record.code.length>5?
                                <Button type='danger'
                                icon="delete" 
                                title="删除当前行" 
                                size="small" 
                                onClick={()=>this.visibleModal(record,'removeList','确定要删除这条记录吗')}
                                ></Button>:""}
                            {this.props.match && item.rabcTemplateGroupId && item.rabcUnupdatable===null && record.code.length>5?
                                <Button 
                                    title="编辑当前实体" 
                                    type='primary' 
                                    icon="form" 
                                    size="small"  
                                    onClick={()=>this.getDetailFormTmpl({modalType:"edit"},record)}
                                    ></Button>:""}
                            {this.props.match && item.rabcTemplateGroupId && item.rabcUndetailable===null && record.code.length>5?
                                <Button
                                    title="查看当前实体"
                                    type='primary'
                                    icon="align-left"
                                    size="small"
                                    onClick={()=>this.getDetailFormTmpl({modalType:"detail"},record)}
                                ></Button>:""}
                        </div>
                        ),
                    }} else{
                         act={
                            title: '操作',
                            key: 'action',
                            render: (record) => (
                                <div className="editbtn">
                                    {this.props.match && item.rabcTemplateGroupId && item.rabcUndetailable===null && record.code.length>5?
                                        <Button
                                            title="查看当前实体"
                                            type='primary'
                                            icon="align-left"
                                            size="small"
                                            onClick={()=>{this.getDetailFormTmpl({modalType:"detail"},record)}}
                                        ></Button>:""}
                                </div>)}}
                    item.fields.push(act)
                }
                columns.push(item)
        })   
        //console.log(columns)
        return columns
    }
    visibleModal=(record,name,string)=>{
        const _this=this
        confirm({
            title: string,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this[name](record)
            },
          });
    }
    requestSelect=(selectId)=>{ //有下拉菜单时，请求下拉选项操作
        let fieldIds = ""
        selectId.forEach((item)=>{
            fieldIds+=item+","
        })
        if(selectId.length>0){
            Super.super({
                url:`api2/meta/dict/field_options`,       
                data:{
                    fieldIds
                },
            }).then((res)=>{
                this.setState({
                    optionsMap:res.optionsMap
                })
            })
        }
    }

    requestSelect4Template=(selectId)=>{ //有下拉菜单时，请求下拉选项操作
        let fieldIds = ""
        selectId.forEach((item)=>{
            fieldIds+=item+","
        })
        if(selectId.length>0){
            Super.super({
                url:`api2/meta/dict/field_options`,
                data:{
                    fieldIds
                },
            }).then((res)=>{
                this.setState({
                    optionsMap4Template:res.optionsMap
                })
            })
        }
    }

    removeList=(record)=>{
        const deleKey=record.key

        const {dataSource}=this.state
        let k=record.groupId.toString();
                dataSource[k].forEach((item,index)=>{
                    if(item.fieldMap.key===deleKey){
                        dataSource[k].splice(index,1); 
                    }
                })
                dataSource[k].forEach((item)=>{
                    item.fieldMap.current=Math.ceil(record.order/5)
                })
        this.setState({
            dataSource
        })
    }
    handleOk = (actionId) => {
        const { baseValue,fuseMode,dataSource,descsFlag,fieldGroupId,nodeId,ratmplId,rootCode,rfieldId }=this.state
        const {menuId,code,type}=this.props.match?this.props.match.params:this.props

        let dfieldIds=this.state.dfieldIds;
        //在頁面中创建dfieldIds的情况暂没有想到，于是乎注释掉20200328
        //  const arr=[]
        // if(columns&&columns.length>0){
        //     columns.forEach((item)=>{
        //         if(item.id.toString()===fieldGroupId){
        //             item.fields.forEach((it)=>{
        //                 if(it.additionAccess){
        //                     arr.push(it.id)
        //                 }
        //             })
        //         }
        //     })
        //     dfieldIds=arr.join(',')
        // }else{
        //     dfieldIds=this.state.dfieldIds
        // }
        const formData = new FormData(); 
        if(actionId){
            formData.append("%actionId%", actionId)
        }
        for(let k in baseValue){
            formData.append(k, baseValue[k]);
        }       
        descsFlag.forEach((item)=>{
            formData.append(`${item}.$$flag$$`, true)
        })
        if(dataSource.constructor===Object ){
            for(let k in dataSource){
                dataSource[k].forEach((item)=>{
                    const fieldMap=item.fieldMap
                    const totalName=fieldMap.totalName
                    const order=fieldMap.order
                    const key=fieldMap.key
                    if(key && key.length>5){ //有key证明数据本来就有,没有修改
                        formData.append(`${totalName}[${order}].唯一编码`,fieldMap.code);
                    }
                    for(let i in fieldMap){
                        if(i.includes("*") && fieldMap[i]){
                            const name=i.split("*")[0];
                            if(fieldMap[i].constructor===Object){ //上传图片
                                formData.append(`${totalName}[${order}].${name}`,fieldMap[i].props.owlner);
                            }else{
                                formData.append(`${totalName}[${order}].${name}`,fieldMap[i]); 
                            }                          
                        }                           
                    }                       
                    for(let i in fieldMap){
                        if(i==="10000"){
                            formData.append(`${totalName}[${order}].$$label$$`,fieldMap[i]);
                        }
                    }                                  
                })
            }
        }
        let  isNew=true
        console.log(formData.keys());
        if(type!=="new"){
            if(!formData.has('唯一编码')){
                formData.append('唯一编码',code);
            }
            formData.append('%fuseMode%',fuseMode);
            isNew=false
        }
        let url
        if(ratmplId){
            url=`api2/entity/${menuId}/detail/relation/${ratmplId}/${rootCode}`
        }else if(nodeId){
            url=`api2/entity/${menuId}/detail/node/${nodeId}`
        }else if(fieldGroupId){
            url=`api2/entity/${menuId}/detail/rabc/${fieldGroupId}`
        }else if(rfieldId){
            url=`api2/entity/${menuId}/detail/rfield/${rfieldId}`
        }
        else{
            url=`api2/entity/${menuId}/detail/normal`
        }
        Super.super({
            url:url, 
            data:formData,
            method:'POST'
        },'formdata').then((res)=>{
            if(res){
                if( res.status==="suc"){
                    message.success("保存成功!")
                    Storage[`${menuId}`]=null
                    let code=res.entityCode?res.entityCode:res.code
                    if(!this.props.match){
                        this.props.TemplatehandleOk({codes:code,formTmplGroupId:fieldGroupId,formRfieldId:rfieldId,isNew,ddfieldIds:dfieldIds})
                        this.props.handleCancel()
                        //this.props.fresh()
                    }else if(type!=='new'){

                        this.fresh(code)
                    }
                }else {
                    message.error("保存失败："+res.message);
                }
            }else{
                message.error("保存失败!")
            }
        })
      }
    exportDetail=()=>{
        const {menuId,code}=this.state
        confirm({
            title: '确认导出当前详情页？',            
            okText: "确认",
            cancelText: "取消",
            onOk() {
                Super.super({
                    url:`api2/entity/${menuId}/detail/exporter/result/${code}`,
                    method:'GET',
                }).then((res)=>{
                    if(res.status==="suc"){
                        const tokenName=Units.getLocalStorge("tokenName")
                        Units.downloadFile(`api2/entity/export/download/${res.uuid}?@token=${tokenName}`)
                    }else{
                        message.error(res.status)
                    }
                })
            },
        });          
    }
    handleCancel = () => {
        this.setState({
            visibleForm: false,
            visibleTemplateList:false,
            visibleDrawer: false,
            visibleEditAddTemplate:false,
            showSetPass:false,
        });
    }
    showModal = (dfieldIds,actionId) => {
        this.baseinfo.handleBaseInfoSubmit() //获取BaseInfo数据
        this.visibleModal(actionId,'handleOk','确定要保存修改吗')//弹出确认框
        this.setState({
            dfieldIds
        })
    }
    baseInfo=(baseValue)=>{  
        const {newPass,dtmplGroup}=this.state

        if(newPass){
            let name
            dtmplGroup.forEach((item)=>{
                if(!item.composite){
                    item.fields.forEach((it)=>{
                        if(it.type==="password"){
                            name=it.name
                        }
                    })
                }
            }) 
            for(let k in baseValue){
                if(k===name){
                    baseValue[k]=newPass
                }
            }
        }
        this.setState({
            baseValue,
        });
    } 
    //调用子组件方法
	onRef=(ref)=>{
		this.baseinfo=ref
    }
    fuseMode=(checked)=>{
        this.setState({
            fuseMode:checked
        })
    }
    getOptions=(id)=>{  
        const {optionsMap}=this.state
        if(optionsMap){
            for(let k in optionsMap){
                if(k===id.toString()){      
                    this.setState({
                        options:optionsMap[k]
                    })
                }
            }
        }        
    }
    // getFormTmpl=(record,isCreate)=>{ //创建实体（修改实体）
    //     const editAddGroupId=record.groupId.toString()
    //     this.setState({
    //         editAddGroupId,
    //         visibleEditAddTemplate:true,
    //         title:isCreate?"创建实体":"修改实体",
    //         modalType:isCreate?"new":"edit",
    //         code:record.code,
    //     })
        
//    }

    getDetailFormTmpl=(params,record)=>{ //查实体）
       const {groupId,code}=record
       const {rfieldId,modalType}=params
        //{groupid,fieldId,code,modalType:{detail,edit,new}}

        const title_=modalType==="edit"?"修改实体":modalType==="detail"?"查看实体":"创建实体";

        this.setState({
            editAddGroupId:groupId,
            rfieldId,
            visibleEditAddTemplate:true,
            title:title_,
            modalType,
           code,
        })

    }

    // getFormTmplForDetail=(params)=>{ //实体）
    //
    //     //{groupid,fieldId,code,modalType:{detail,edit,new}}
    //     const {groupId,code}=params
    //     this.setState({
    //         editAddGroupId:groupId.toString(),
    //         fieldId,
    //         visibleEditAddTemplate:true,
    //         title:"查看实体",
    //         modalType:"detail",
    //         code:code,
    //     })
    //
    // }

    getForm=(record,isNew)=>{
        let {columns}=this.state
        let editFormList=[]
        if(!isNew){
            columns.forEach((item)=>{
                if(item.id.toString()===record.groupId){
                    columns=item.fields
                }
            })
        }else{
            columns=record
        }
        const code=Units.RndNum(9)
        columns.forEach((item)=>{
            if(item.type){
                const editItem={
                    title:item.title,
                    name:item.name,
                    fieldAvailable:item.fieldAvailable,
                    type:item.type,
                    groupId:item.groupId,
                    id:item.id,
                    fieldId:item.fieldId,
                    code:isNew?code:record.code,
                    key:item.key,
                    fieldAccess:item.fieldAccess
                }
                if(!isNew){
                    for(let k in record){
                        if(k===item.id.toString()){
                            editItem.value=Units.getFileUrl(record[k]);
                        }
                    }
                }else{
                    editItem.value="";
                }
                if(item.type==="relation"){
                    const options=[]
                    item.options.forEach((it)=>{
                        const op={
                            title:it,
                            value:it
                        }
                        options.push(op)
                    })
                    editItem["options"]=options
                    editItem.defaultValue=options.length===1?options[0].value:null;
                }
                editFormList.push(editItem)
            }
        })
        this.setState({
            editFormList,
            isNew,
            title:isNew?"新增":"修改",
            visibleForm:true,
        })
    }
    modelhandleOk=(fieldsValue)=>{
        const Code=fieldsValue.code;
        const groupId=fieldsValue.groupId.toString()
        let { dataSource,isNew,columns }=this.state;
        const data={}
        // for(let k in fieldsValue){
        //     if(fieldsValue[k]!==null&&typeof fieldsValue[k]==='object'){
        //         fieldsValue[k]=moment(fieldsValue[k]).format("YYYY-MM-DD")
        //     }
        // }
        columns.forEach((item)=>{
            data[item.id]=[]
        })
        for(let k in data){
            for(let i in dataSource){
                if(i===k){
                    data[k]=dataSource[i]
                }
            }
        }
        dataSource=data
        if(isNew){ //新增记录
            const list={
                isEditTmpl:false,
                fieldMap:fieldsValue
            }
            dataSource[groupId].push(list)
            dataSource[groupId].forEach((item)=>{
                item.fieldMap.current=Math.ceil(dataSource[groupId].length/5)
            })
        }else{     //修改记录  
            for(let k in dataSource){
                if(k===groupId){
                    dataSource[k].forEach((item)=>{
                        const fildcode=item.fieldMap.code.toString()
                        if(fildcode===Code){
                            item.fieldMap=fieldsValue
                        }
                    })
                }
            }
        }
        this.setState({
            dataSource,
            visibleForm:false,
        })
    }
    getTemplate=(params)=>{
        let {templateGroupId,rfieldId,dfieldIds,excepts}=params
        if(!rfieldId && !templateGroupId){
            rfieldId=this.state.rfieldId;
            templateGroupId=this.state.templateGroupId;
        }
      
        let {menuId}=this.state;

        const url_0=rfieldId?`api2/meta/tmpl/${menuId}/stmpl/rfield/${rfieldId}`:`api2/meta/tmpl/${menuId}/stmpl/detailGroup/${templateGroupId}`
        Super.super({
            url:url_0,
            method:'GET',
        }).then((res)=>{
            //console.log(res)
            if(res.config){
                let fieldIds=[];
                res.config.criterias.forEach((item)=> {
                    if (item.inputType === "select" || item.inputType === "multiselect") {
                        fieldIds.push(item.fieldId)
                    }
                    if (fieldIds.length > 0) {
                        this.requestSelect4Template(fieldIds)
                    }
                });
            }
            this.setState({
                templateDtmpl:res,
                templateGroupId, //选择模板groupId
                dfieldIds,
                excepts,
                rfieldId,
                fileType:res.config.type//ltmlp/ttmpl
            })
        })


        const url_1=rfieldId?`api2/entity/${menuId}/selector/key/rfield/${rfieldId}`:`api2/entity/${menuId}/selector/key/detailGroup/${templateGroupId}`

        Super.super({
            url:url_1,
            method:'GET',
            query:{
                excepts:params.excepts,
                ...params.searchParams,
            }              
        }).then((res)=>{
            if(res){
                this.templatePageTo(res.queryKey)
            }
        })
    }
    templatePageTo=(queryKey,data)=>{
        Super.super({
            url:`api2/entity/list/${queryKey}/data`,
            method:'GET',
            query:data,
        }).then((res)=>{
            this.setState({
                templateData:res,
                visibleTemplateList:true,
                title:'选择实体'
            })
        })
    }
    templateSearch=(params)=>{
        let {templateGroupId,excepts,dfieldIds}=this.state;
        this.getTemplate({templateGroupId,excepts,dfieldIds,searchParams:params})
    }

    deleteRFieldValue=(rfieldId)=>{
        let {columns}=this.state
        let continueMark=true;
        columns.forEach((column)=>{
        if(column.fields){
            column.fields.forEach(field=>{
                if(!continueMark){
                    return ;
                }
                if(field.id===rfieldId){
                    field.value=null;
                    continueMark=false;
                }
            })
        }
        });
        this.setState({});
    };

    TemplatehandleOk=(params)=>{
        let {codes,formTmplGroupId,isNew,ddfieldIds,formRfieldId}=params
        let {menuId,dfieldIds,templateGroupId,dataSource,columns,dtmplGroup,rfieldId}=this.state
        if(formTmplGroupId){
            templateGroupId=formTmplGroupId
        }
        if(formRfieldId){
            rfieldId=formRfieldId;
        }
        if(ddfieldIds){
            dfieldIds=ddfieldIds
        }

        rfieldId? Super.super({
            url:`api2/entity/${menuId}/selecteor/selected/data/rfield/${rfieldId}`,
            method:'GET',
            query: {
            codes,
        }
    }).then((res)=>{


        let continueMark=true;
        //columns值
            columns.forEach((column)=>{
                if(!continueMark){
                    return ;
                }
                if(column.fields){
                    column.fields.forEach(field=>{
                        if(!continueMark){
                            return ;
                        }
                        if(field.id===rfieldId){
                            field.value=res.value;
                            continueMark=false;
                    }
                })
                }
            })

                this.setState({
                    visibleTemplateList:false,
                    columns,
                    dataSource,
                    dtmplGroup,
                    rfieldId:null
                })
            })
           :
        Super.super({
            url:`api2/entity/${menuId}/selecteor/selected/data/detailGroup/${templateGroupId}`,
            method:'GET',
            query:{
                codes,
                dfieldIds}
        }).then((res)=>{
            // console.log(res)
            // console.log(columns)
            let relationSubdomain=[]
            let totalName
            columns.forEach((item)=>{
                if(item.id.toString()===templateGroupId.toString()){
                    relationSubdomain=item.relationSubdomain
                    totalName=item.composite.name
                }
            })
 //           console.log(res)
            res.entities.forEach((item)=> {
//                console.log(item)
                const byDfieldIds = item.byDfieldIds
                byDfieldIds.key = item['唯一编码']
                byDfieldIds.code = item['唯一编码']
                byDfieldIds.groupId = templateGroupId.toString()
                byDfieldIds.totalName = totalName
                Units.forFile(byDfieldIds)//处理文件
                // for(let k in byDfieldIds){
                //     if(byDfieldIds[k]&&byDfieldIds[k].includes("download-files")) {
                //         byDfieldIds[k] =Units.packFile2Show(byDfieldIds[k],55)
                //     }
                // }
                if (relationSubdomain.length === 1) { //默认关系只有一个选项时，自动添加
                    byDfieldIds['10000'] = relationSubdomain[0]
                }
                let list = {
                    code: item['唯一编码'],
                    fieldMap: item.byDfieldIds,
                }

                // for(let k in dataSource){
                //     if(k===templateGroupId.toString()){
                let k = templateGroupId + "";
                if (!dataSource[k]) {
                    dataSource[k] = [];
                }
                if (!isNew) {
                    dataSource[k].forEach((it, index) => {
                        if (it.code === item['唯一编码']) {
                            dataSource[k].splice(index, 1, list);
                        }
                    })
                } else {
                    dataSource[k].push(list)
                    dataSource[k].forEach((item) => {
                        item.fieldMap.current = Math.ceil(dataSource[k].length / 5)
                    })
                }
            })
            this.setState({
                visibleTemplateList:false,
                dataSource,
                dtmplGroup
            })
        })
    }
    fresh=(codei)=>{
        let {menuId,code,type,nodeId,ratmplId,rootCode}=this.state
        code=codei?codei:code
        this.baseinfo.reset()
        this.loadltmpl(menuId,{code,type,versionCode:"",nodeId,ratmplId,rootCode})
    }
    showSetPass=(oldPass)=>{
        this.setState({
            showSetPass:true,
            oldPass,
        })
    }
    setNewPass=(newPass)=>{
        this.setState({
            newPass,
            showSetPass:false,
        })
    }
    render(){
        const { menuTitle,detailsTitle,fuseMode,loading,visibleForm,dtmplGroup,editFormList,visibleEditAddTemplate,showSetPass,
            actions,premises,templateDtmpl,rightNav,columns,dataSource,editAddGroupId,visibleDrawer,detailHistory,oldPass,
            type,menuId,code,visibleTemplateList,fileType,title,options,templateData,formTmplGroupId,rootCode,modalType,isModal,rfieldId,formRfieldId}=this.state
        let content
        if(actions && actions.length>0){
            content = (
                <div className="btns">
                    {actions.map(item =>
                   <Button
                        key={item.id}
                        type="primary"
                       // onClick={()=>this.visibleModal(item.id,'handleOk','确实要执行这项操作吗？')}
                       onClick={()=>{this.showModal(null,item.id)}}
                    >{item.title}</Button>
                        )}
                </div>
            );
        }
        let premisestitle
        if(premises && premises.length>0 && dtmplGroup){
            premisestitle=type==="detail"?"默认字段":"默认字段（不可修改）"
            dtmplGroup.forEach((item)=>{
                if(!item.composite){
                    item.fields.forEach((it)=>{
                        premises.forEach((i)=>{
                            i.title=i.fieldTitle
                            i.type="text"                    
                            i.value=i.fieldValue        
                            i.available=false
                            if(i.fieldId===it.fieldId){
                                it.fieldAvailable=false
                                it["value"]= i["value"]
                            }
                        })
                    })
                }
            })
        }
        return(
            <div className="detailPage">
                <h3>
                    {type==="new"&& menuTitle ? menuTitle+"--创建":detailsTitle }   
                    {type==="detail" && !rootCode && !isModal ?
                        <div className="fr pad">
                            <Button 
                                className="hoverbig" 
                                title="导出" 
                                onClick={this.exportDetail}>
                                    <Icon type="upload" />
                            </Button>
                            <Button 
                                className="hoverbig" 
                                title="查看历史" 
                                onClick={()=>this.renderHistoryList()}>
                                    <Icon type="schedule" />
                            </Button>                                                      
                            <Button 
                                className="hoverbig" 
                                title="刷新" 
                                onClick={this.fresh}>
                                    <Icon type="sync" />
                            </Button>
                        </div> :
                        <div className="fr pad">
                            <div className="buttonGroup">
                                {actions&&actions.length>0?
                                    <Popover placement="leftTop" content={content} trigger="click">
                                        <Button>
                                            <Icon type="swap" />
                                        </Button>
                                    </Popover>:""}
                                {this.props.match?
                                    <Button 
                                        type='primary' 
                                        icon="cloud-upload" 
                                        className="submitBtn" 
                                        key="btn" 
                                        onClick={this.showModal} 
                                        style={{backgroundColor:fuseMode===true?"#001529":""}}
                                        >保存
                                    </Button>:""}
                                </div>
                                {type!=="detail" && code && !rootCode?
                                  <Switch
                                        checkedChildren="开" 
                                        unCheckedChildren="关" 
                                        style={{marginRight:10}} 
                                        title="融合模式" 
                                        onChange={this.fuseMode}/>
                                    :""}
                                {this.props.match?
                                    <Button 
                                        className="hoverbig" 
                                        title="刷新" 
                                        onClick={this.fresh}
                                        ><Icon type="sync" /></Button>:""}
                            </div>}                                  
                </h3>
                {premises && premises.length>0?
                    <Form layout="inline" autoComplete="off">  
                        <Card 
                            title={premisestitle} 
                            key={premisestitle} 
                            id={premisestitle}
                            className="hoverable" 
                            headStyle={{background:"#f2f4f5"}}
                            loading={loading}
                            >
                            <BaseInfoForm 
                                key={111}
                                formList={premises} 
                                type="detail"
                                width={220}
                                />
                        </Card>
                    </Form>:""
                }
                {dtmplGroup?
                    <Formi
                        dtmplGroup={dtmplGroup}
                        columns={columns}
                        dataSource={dataSource}
                        type={type}
                        loading={loading}
                        options={options}
                        onRef={this.onRef}
                        getForm={this.getForm}
                        getTemplate={this.getTemplate}
                        getDetailFormTmpl={this.getDetailFormTmpl}
                        match={this.props.match}
                        baseInfo={this.baseInfo}
                        getOptions={this.getOptions}
                        setPassword={(fieldValue)=>this.visibleModal(fieldValue,'showSetPass','确定修改密码吗？')}
                        deleteRFieldValue={this.deleteRFieldValue}
                    />:""}
                <ModelForm
                    handleCancel={this.handleCancel}
                    handleOk={this.modelhandleOk}
                    visibleForm={visibleForm}
                    formList={editFormList}
                    type="edit"            
                    getOptions={this.getOptions}
                    options={options}
                    title={title}
                    maskClosable={false}
                    deleteRFieldValue={this.deleteRFieldValue}
                />
                <Drawer
                    title="查看历史"
                    closable={false}
                    onClose={this.handleCancel}
                    visible={visibleDrawer}
                    width={400}
                    >
                    {detailHistory?<Timeline mode="alternate">
                                        {detailHistory}
                                    </Timeline>:"暂无历史记录"}
                </Drawer>
                <TemplateList 
                    visibleTemplateList={visibleTemplateList}
                    handleCancel={this.handleCancel}
                    optionsMap={this.state.optionsMap4Template}
                    templateDtmpl={templateDtmpl}
                    templateData={templateData}
                    menuId={menuId}
                    formTmplGroupId={formTmplGroupId}
                    formRfieldId={formRfieldId}
                    type="edit"
                    templateSearch={this.templateSearch}
                    TemplatehandleOk={this.TemplatehandleOk}
                    templatePageTo={this.templatePageTo}
                    title={title}
                    fileType={fileType}
                    maskClosable={false}
                />
                <EditAddTemplate 
                    visibleEditAddTemplate={visibleEditAddTemplate}
                    handleCancel={this.handleCancel}
                    menuId={menuId}
                    editAddGroupId={editAddGroupId}
                    rfieldId={rfieldId}
                    type={modalType?modalType:type}
                    title={title}
                    code={code}
                    columns={columns}
                    fresh={this.fresh}
                    maskClosable={false}
                    TemplatehandleOk={this.TemplatehandleOk}
                />
                <SetPasswords 
                    showSetPass={showSetPass}
                    handleCancel={this.handleCancel}
                    oldPass={oldPass}
                    setNewPass={this.setNewPass}
                />
                {!rightNav||rightNav.length<3?"":
                    this.props.match?<RightBar 
                        list={rightNav}
                    />:""}              
            </div>
        )
    }
}
