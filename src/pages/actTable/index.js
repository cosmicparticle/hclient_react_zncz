import React from 'react'
import { Pagination ,Card,Table,Button,Icon,Popover,Modal,message} from 'antd';
import BaseForm from "../../components/BaseForm"
import ExportFrame from '../../components/exportFrame'
import Units from '../../units'
import Super from "../../super"
import Storage from './../../units/storage';
import './index.css'
import moment from 'moment';
import DisableCols from './../../components/DisableCols'
import ModalActTable from './../modalActTable'
const confirm = Modal.confirm;

export default class actTable extends React.Component{
    state={
        loading: false,
        Loading:false,
        radioValue:1,
        currentPage:1,
        pageSize:10,
        selectedRowKeys: [],
        actions:[],
        ractions:[],
        jumps:[],
        fieldIds:[],
        ratmplId:"无效的",
        rootCode:null,
        parentUrl:null,
        parentDate:null,
        runsearch:true
    }
    componentDidMount(){
        const {menuId,ratmplId,rootCode}=this.props.match.params;
        const url=decodeURI(this.props.history.location.search)//获取url参数，并解码
        this.setState({menuId})
        if(!url){
            if(ratmplId){
                this.requestLtmpl(menuId,null,ratmplId,rootCode)
            }else{
                this.requestRootLtmpl(menuId)
            }
        }else{
            this.searchList(Units.urlToObj(url),menuId)//更新筛选列表
        }
    }
    componentWillReceiveProps(nextProps){
        const {menuId,ratmplId,rootCode}=nextProps.match.params
        const url=decodeURI(nextProps.location.search)//前进后退获取url参数
        this.setState({
            menuId,
            isSeeTotal:false,
            currentPage:1,
            selectedRowKeys: []
        })
        this.forceUpdate();
        if(!url){
            if(ratmplId){
                this.requestRelationLtmpl(menuId,null,ratmplId,rootCode)
            }else{
                this.requestRootLtmpl(menuId)
            }

        }else{
            Storage[`${menuId}`]=null //刷新列表数据
            this.searchList(Units.urlToObj(url),menuId)//更新筛选列表
        }
    }
    handleFilter=(params)=>{
        this.props.searchParams(params)
    }

    requestRootLtmpl=(menuId,data)=>{
        this.requestLtmplRunner(menuId,data)
    }

    requestRelationLtmpl=(menuId,data,ratmplId,rootCode)=>{
        this.requestLtmplRunner(menuId,data,ratmplId,rootCode)
    }

    requestLtmpl=(menuId,data,ratmplId,rootCode)=>{
        let recordCode_=rootCode?rootCode:this.state.rootCode;
        let ratmplId_=recordCode_?ratmplId?ratmplId:this.state.ratmplId:null;

        this.requestLtmplRunner(menuId,data,ratmplId_,recordCode_);
    }

    requestLtmplRunner=(menuId,data,ratmplId,rootCode)=>{

        let url_=`api2/entity/${menuId}/list/tmpl`
        if(ratmplId){
            url_=`api2/entity/${menuId}/list/tmpl/${ratmplId}/${rootCode}`
        }

        Super.super({
            url:url_,
            method:'GET',
           query: data
        }).then((res)=>{
            if(ratmplId){
                this.queryList(res.queryKey,data)
            }else{
                //临时去掉
                // if(Storage[`${menuId}`] && !data && (!this.state.ratmplId  || this.state.ratmplId==="无效的") ){
                //     const res= Storage[`${menuId}`]
                //     this.sessionTodo(res)
                // }else{
                    this.queryList(res.queryKey,data)
               // }
            }

            const fieldIds=[]
            res.ltmpl.criterias.forEach((item)=>{
                if(item.inputType==="select" || item.inputType==="multiselect"){
                    fieldIds.push(item.fieldId)
                }
                const criteriaValueMap=res.criteriaValueMap
                for(let k in criteriaValueMap){
                    if(k===item.id.toString()){
                        item.value=criteriaValueMap[k]
                    }
                }
            })
            if(fieldIds.length>0){
                this.requestSelect(fieldIds)
            }
            const url=decodeURI(this.props.history.location.search)
            if(url){//将url参数填入搜索栏
                const obj=Units.urlToObj(url)
                res.ltmpl.criterias.forEach((item)=>{
                    for(let k in obj){
                        if(k.split("_")[1]===item.id.toString()){
                            item.value=obj[k] //更新表单筛选
                        }
                    }
                })
            }else{
                this.child.reset()
            }
            const plainOptions=[]
            res.ltmpl.columns.forEach((item)=>{
                if(item.title!=="序号"){
                    const list={
                        value:item.id,
                        label:item.title,
                    }
                    plainOptions.push(list)
                }
            })

            this.setState({
                moduleTitle:res.menu.title,
                columns:this.renderColumns(res.ltmpl.columns,res.tmplGroup?res.tmplGroup.ractions:null),
                queryKey:res.queryKey,
                formList:res.ltmpl.criterias,
                tmplGroup:res.tmplGroup,
                statView:res.statView, //用作统计页面
                disabledColIds:res.disabledColIds,
                plainOptions,
                ratmplId:res.ratmplId,
                rootCode:res.rootCode,
                ratmplTitle:res.ratmplTitle
            })
        })
    }
    queryList=(queryKey,data)=>{
        const {menuId,currentPage}=this.state
        Super.super({
            url:`api2/entity/list/${queryKey}/data`,
            method:'GET',
            query:data?data:{
                pageNo:currentPage
            }         
        }).then((res)=>{
            Storage[`${menuId}`]=res
            this.sessionTodo(res)
        })
             
    }
    sessionTodo=(data)=>{
        const {isSeeTotal}=this.state
        const dataSource=[]
        data.entities.forEach((item,index)=>{
            item.cellMap.key=index
            item.cellMap.code=item.code //增加code,为了删除操作
            dataSource.push(item.cellMap)
        })
        const noSeeTotal=data.pageInfo.pageSize*data.pageInfo.virtualEndPageNo
        this.setState({
            list:dataSource,
            pageInfo:data.pageInfo,
            currentPage:data.pageInfo.pageNo,
            pageCount:isSeeTotal?isSeeTotal:noSeeTotal,
            Loading:false,
            pageSize:data.pageInfo.pageSize,
        })
    }
    renderColumns=(columns,ractions)=>{
        columns.forEach((item)=>{
            if(item.title==="序号"){
                item['render']= (text, record,index) => (
                                    <label>{index+1}</label>
                                )
            }
            if(item.viewOption==="refselect" || item.viewOption==="relselect" ){
                item['render']= (text, record) => (record[item.id]?record[item.id].split('@R@')[1]:null)
            }
            if(item.title==="操作"){
                item['render']= (text, record) => (
                                <span>
                                    <Button 
                                        type="primary" 
                                        icon="align-left" 
                                        size="small" 
                                        onClick={()=>this.handleOperate("detail",record)}>
                                        详情
                                    </Button>
                                    <Button 
                                        type="dashed" 
                                        icon="edit" 
                                        size="small" 
                                        onClick={()=>this.handleOperate("edit",record)}>
                                        修改
                                    </Button>
                                    {
                                        ractions && ractions.length>0?
                                            ractions.map(it =>
                                                <Button type="dashed" key={it.ratmplId} size="small"  onClick={()=>this.handleRAction(it.ratmplId,record.code)}>{it.title}</Button>
                                            ):""
                                    }
                                </span>
                                )
            }
            item.dataIndex=item.id
            item.key=item.id
        })
        return columns
    }
    requestSelect=(fieldIds)=>{
        Super.super({
            url:`api2/meta/dict/field_options`,  
            data:{fieldIds}        
		}).then((res)=>{
            this.setState({
                optionsMap:res.optionsMap
            })
		})
    }

    handleRAction=(ratmplId,recordCode)=>{
        const { menuId}=this.state
        this.props.history.push(`/relation/${menuId}/${ratmplId}/${recordCode}`)
       // this.setState({loading:false,Loading:false,ratmplId:ratmplId,rootCode:recordCode})
        this.setState({loading:false,Loading:false})

    }

    handleOperate=(type,record)=>{
        const { menuId,selectCodes,ratmplId,rootCode }=this.state
        const code=record.code
        this.setState({Loading:true})
        let url_=rootCode?`api2/entity/${menuId}/detail/${ratmplId}`:`api2/entity/${menuId}/detail`
        if(type==="delete"){
            Modal.confirm({
				title:"删除提示",
				content:"您确定删除这些数据吗？",
				okText:"确认",
				cancelText:"取消",
				onOk:()=>{
					Super.super({
                        url:url_,
                        data:{
                            codes:selectCodes
                        },
                        method:'DELETE',
					}).then((res)=>{
                        this.setState({
                            Loading:false,
                            selectedRowKeys:[],
                        })
						if(res.status==="suc"){ 
                            this.fresh("删除成功！")     //刷新列表    
						}else{
							message.info('删除失败！')  
						}
					})
                },
                onCancel:()=>{
                    this.setState({loading:false,Loading:false})
                }
			})
		}else{
            if(this.state.rootCode){
                this.props.history.push(`/relation/${menuId}/${this.state.ratmplId}/${this.state.rootCode}/${type}/${code}`)
            }else{
                this.props.history.push(`/${menuId}/${type}/${code}`)
            }

            this.setState({loading:false,Loading:false})
		}
    } 
    searchList=(params,menuId)=>{

        for(let k in params){
            if(typeof params[k] ==="object"){
                const old=params[k];
                //日期格式转换
                if(params[k] instanceof Array){
                    const arr=[]
                    params[k].forEach(item=>{
                        arr.push(moment(item).format("YYYY-MM-DD"))
                    }) 
                    params[k]=arr.join("~")
                }else{
                    params[k]=moment(params[k]).format("YYYY-MM-DD  HH:mm:ss")
                }

                if(params[k] && params[k].indexOf("Invalid date") != -1 ){
                    params[k]=old.join(",")
                }

            }else if(params[k] ==="Invalid date"){
                params[k]=""
            }
        }
        this.setState({filterOptions:params})
        const oldfliter=this.props.history.location.search.slice(1)
        const newfliter=Units.queryParams(params)
        let flag=true
        if(oldfliter&&oldfliter===newfliter){ //查询条件更新时
            flag=false
        }
        if(flag){
            const str=Units.queryParams(params)
            this.props.history.push(`/${menuId}/search?${str}`)
        }
        this.requestLtmpl(menuId,{...params})			
    }
    //页码
	pageTo=(pageNo, pageSize)=>{      
        const {queryKey}=this.state
        const url=decodeURI(this.props.history.location.search)
        let data="";
        data=url?Units.urlToObj(url):""
        this.queryList(queryKey,{...data,pageNo,pageSize})
        this.setState({
            currentPage:pageNo
        })			
    }
    handleNew=(menuId)=>{
        const { ratmplId,rootCode }=this.state
        if(rootCode){
            this.props.history.push(`/${menuId}/new/relation/${ratmplId}/${rootCode}`)
        }else{
            this.props.history.push(`/${menuId}/new`)
        }

    }
    handleImport=(menuId)=>{
        this.props.history.push(`/${menuId}/import`)
    }
    handleTree=(menuId)=>{
        this.props.history.push(`/${menuId}/ActTree`)
    }
    handleActions=(actionId)=>{
        const {menuId,selectCodes}=this.state;    
        this.setState({Loading:true})
        Super.super({
            url:`api2/entity/${menuId}/action/${actionId}`,
            data:{
                codes:selectCodes
            },
            method:"POST",
        }).then((res)=>{
            this.setState({
                Loading:false,
                selectedRowKeys:[],
            })
            if(res && res.status==="suc"){
                this.fresh('操作成功!')
            }else{
                message.error(res.status+"。"+res.message)
            }
        })
    }
    handleJumps=(jumpId)=>{
        const {menuId,selectCodes}=this.state;
        this.setState({Loading:true})
        Super.super({
            url:`api2/entity/${menuId}/jump/${jumpId}`,
            query:{
                codes:selectCodes
            },
            method:'GET'
        }).then((res)=>{
            this.setState({
                Loading:false,
                selectedRowKeys:[],
            })
            if(res && res.status==="suc"){
                window.open(res.url);
            }else{
                message.error(res.status)
            }
        })
    }
    fresh=(msg)=>{
        const {menuId}=this.state
        this.reset()
        message.success(msg)         
        Storage[`${menuId}`]=null 
    }
    seeTotal=()=>{
        const {queryKey,isSeeTotal}=this.state
        if(!isSeeTotal){
            Super.super({
                url:`api2/entity/list/${queryKey}/count`,
                method:"GET"
            }).then((res)=>{
                this.setState({
                    isSeeTotal:res.count
                })
            })
        }       
    }
    onRef=(ref)=>{
		this.child=ref
    }
    reset=()=>{
        const {menuId}=this.state
        const url=decodeURI(this.props.history.location.search)
        if(url){
            this.searchList(Units.urlToObj(url),menuId)
        }else{
            this.child.reset()//搜索栏重置
            if(this.state.rootCode && this.state.ratmplId){
                this.props.history.push(`/relation/${menuId}/${this.state.ratmplId}/${this.state.rootCode}`)
            }else{
                this.props.history.push(`/${menuId}`)
            }

        }
    }
    recalc=(menuId)=>{
        const _this=this
        confirm({
            title: '确认重新统计？',            
            okText: "确认",
            cancelText: "取消",
            onOk() {
                Super.super({
                    url:`api2/entity/${menuId}/statistician/recalc`,
                    method:'POST'
                }).then((res)=>{
                   if(res.status==="suc"){
                        _this.reset()
                   }else{
                       message.error(res.errorMsg)
                   }
                })
            },
        });    
    }
    handelDisableCols=(disabledColIds)=>{
        const {menuId}=this.state
        this.requestLtmpl(menuId,{disabledColIds})
    }
    handleExport=()=>{
        const {expotrVisible}=this.state
        this.setState({
            expotrVisible:!expotrVisible
        })
    }
    render(){
        let {selectedRowKeys,filterOptions,moduleTitle,list,loading,pageInfo,statView,
            disabledColIds,plainOptions,downloadTitle,pageSize,formList,tmplGroup,columns,
            Loading,currentPage,menuId,pageCount,isSeeTotal,optionsMap,queryKey,rootCode,ratmplTitle } = this.state;
        if(statView!==null&&columns){
            columns.forEach((item,index)=>{             
                if(disabledColIds){
                    disabledColIds.forEach((it)=>{
                        if(item.id===it){
                            columns.splice(index,1)
                        }
                    })
                }
            })
        }
        const disableCols=<DisableCols
                            menuId={menuId}
                            plainOptions={plainOptions}
                            handelDisableCols={this.handelDisableCols}
                            /> 
        
        const content = <ExportFrame //导出组件
                            menuId={menuId}
                            pageInfo={pageInfo}
                            filterOptions={filterOptions}
                            queryKey={queryKey}
                            moduleTitle={moduleTitle}
                            setDownloadTitle={(name)=>{
                                console.log(name)
                                this.setState({
                                    downloadTitle:name
                                })
                            }}
                            /> 
        
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                let selectCodes=""
                selectedRows.forEach((item)=>{
                    selectCodes+=item.code+","
                })
                this.setState({selectCodes,selectedRowKeys})
            },
          };
        let hideCreate=tmplGroup&&tmplGroup.hideCreateButton!==1?false:true
        let hideDelete=tmplGroup&&tmplGroup.hideDeleteButton!==1?false:true
        let hideExport=tmplGroup&&tmplGroup.hideExportButton!==1&& !rootCode?false:statView===null?true:false
        let hideImport=tmplGroup&&tmplGroup.hideImportButton!==1 && !rootCode ?false:true
        let hideQuery=tmplGroup&&tmplGroup.hideQueryButton!==1?false:statView===null?true:false
        let hideTreeToggle=tmplGroup&&tmplGroup.treeTemplateId&&!tmplGroup.hideTreeToggleButton?false:true
        return(
            <div className="actTable">
                <h3>

                    {moduleTitle?moduleTitle:null}{ratmplTitle?"-"+ratmplTitle:null}{ "-列表"}

                    <p className="fr">
                        {hideCreate?"":<Button 
                            className="hoverbig" 
                            title="创建" 
                            onClick={()=>this.handleNew(menuId)}>
                            <Icon type="plus"/>
                        </Button>}
                        {hideImport?"":<Button 
                            className="hoverbig" 
                            title="导入" 
                            onClick={()=>this.handleImport(menuId)}>
                            <Icon type="upload" />
                        </Button>}
                        {statView===null?"":<Popover content={disableCols} title="显示列" placement="bottomRight" trigger="hover">
                                <Button className="hoverbig" title="显示列" ><Icon type="table" /></Button>
                            </Popover>}
                        {statView===null?"":<Button 
                            className="hoverbig" 
                            title="重新统计" 
                            onClick={()=>this.recalc(menuId)}>
                            <Icon type="calculator" />
                        </Button>}
                        <Popover                                            
                            content={content} 
                            title={downloadTitle && moduleTitle!==downloadTitle?"导出("+downloadTitle+"有导出进程...)":"导出"}
                            placement="bottomRight" 
                            getPopupContainer={trigger => trigger.parentNode}
                            trigger="click">
                            <Button 
                                style={{display:hideExport?"none":"inline"}} //为了点击到没有导出模块，使组件不致销毁，丢失导出数据
                                className="hoverbig" 
                                title="导出">
                                <Icon type="download" />
                            </Button>
                        </Popover>  
                        {hideTreeToggle?"":<Button 
                            className="hoverbig" 
                            title="树形视图" 
                            onClick={()=>this.handleTree(menuId)}>
                            <Icon type="cluster" />
                        </Button>}                    
                        <Button 
                            className="hoverbig" 
                            title="刷新" 
                            onClick={()=>this.fresh("刷新成功！")}>
                            <Icon type="sync" />
                        </Button>
                    </p>
                </h3>
                <Card 
                    className="hoverable" 
                    style={{display:formList?"block":"none"}}
                    headStyle={{background:"#f2f4f5"}} 
                    loading={loading}>
                    <BaseForm 
                        formList={formList} 
                        filterSubmit={this.searchList} 
                        handleOperate={this.handleOperate}
                        actions={tmplGroup?tmplGroup.actions:""}
                        handleActions={this.handleActions}
                        jumps={tmplGroup?tmplGroup.jumps:""}
                        handleJumps={this.handleJumps}
                        selectedRowKeys={selectedRowKeys.length}
                        menuId={menuId}
                        hideDelete={hideDelete}
                        hideQuery={hideQuery}
                        onRef={this.onRef}
                        optionsMap={optionsMap}
                        />
                </Card>
                <Table
                    rowSelection={hideDelete && (!tmplGroup || tmplGroup.actions.length===0) && (!tmplGroup || tmplGroup.jumps.length===0)?null:rowSelection}
                    columns={columns?columns:[]}
                    dataSource={list}
                    bordered
                    pagination={false}
                    style={{display:columns?"block":"none"}}
                    loading={Loading}
                >
                </Table>
                <div className='Pagination'>
                    <span className={isSeeTotal?'sewTotal':'seeTotal'} onClick={this.seeTotal}>
                        {isSeeTotal?`共${isSeeTotal}条`:list&&list.length===0?null:'点击查看总数'}
                    </span>
                    <Pagination 
                        style={{display:'inline-block'}}
                        showQuickJumper 
                        showSizeChanger 
                        pageSizeOptions={['5','10','20','50','100','500']}
                        defaultCurrent={1} 
                        current={currentPage}
                        pageSize={pageSize}
                        onChange={(page, pageSize)=>this.pageTo(page, pageSize)} 
                        onShowSizeChange={(current, size)=>this.pageTo(current, size)}
                        hideOnSinglePage={list&&list.length===0?true:false}
                        total={pageCount+1}
                        />
                </div>
            </div>
           
        )
    }
}