import React from 'react'
import EditTableList from './editTableList'

export default class EditTable extends React.Component{
    
    initDetailsList=()=>{
        const { type,dataSource,columns,getTemplate,getDetailFormTmpl,isModal,maxDataCount }=this.props

        const unallowedCreate=columns.unallowedCreate
        const selectionTemplateId=columns.selectionTemplateId
        const dialogSelectType=columns.dialogSelectType

        const rabcUncreatable=columns.rabcUncreatable
        const rabcTemplateGroupId=columns.rabcTemplateGroupId
        const rabcTreeTemplateId=columns.rabcTreeTemplateId
        const title=columns.title
        let rabcTemplatecreatable=false
        if(rabcTemplateGroupId && rabcUncreatable===null){
            rabcTemplatecreatable=true
        }
        const data=[]
        dataSource.forEach((it,i)=>{
            it.fieldMap["order"]=i+1
            data.push(it.fieldMap)
        })              
        return <EditTableList               
                    key={Math.random()}
                    maxDataCount={maxDataCount}
                    type={type}
                    columns={columns.fields}
                    dataSource={data}
                    haveTemplate={dialogSelectType && (selectionTemplateId || rabcTemplateGroupId || rabcTreeTemplateId)?true:false}
                    cardTitle={title}
                    handleAdd={()=>this.props.handleAdd(columns.fields,true)}
                    getTemplate={getTemplate}
                    getDetailFormTmpl={getDetailFormTmpl}
                    rabcTemplatecreatable={rabcTemplatecreatable}
                    isModal={isModal}
                    unallowedCreate={unallowedCreate}
                /> 
    }
    render(){
        return(
            <div>
                {this.initDetailsList()}
            </div> 
        )
    }
}