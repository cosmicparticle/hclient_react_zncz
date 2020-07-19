import React from 'react'
import {Form,Modal} from 'antd'
import moment from 'moment';
import BaseInfoForm from '../BaseForm/BaseInfoForm'
import Units from "../../units";

class ModelForm extends React.Component{

    handleOk=()=>{
        const {formList,form}=this.props
        let code,groupId,totalName
        formList.forEach((item)=>{
            if(item.name!=="关系"){
                code=item.code
                groupId=item.groupId
                totalName=item.name.split(".")[0]
            }
        })      
        let fieldsValue=form.getFieldsValue()[totalName]
        for(let k in fieldsValue){
            if(fieldsValue[k]){
                fieldsValue[k+"*"]=fieldsValue[k].constructor!==Object?fieldsValue[k]:Units.packFile2Show(fieldsValue[k],55)
                formList.forEach((item)=>{
                    if(k===item.name.split(".")[1]){
                        if(fieldsValue[k].constructor!==Object){
                            fieldsValue[item.id]=fieldsValue[k]
                        }else{
                            fieldsValue[item.id]=Units.packFile2Show(fieldsValue[k],55)
                        }
                    }
                })
                if(fieldsValue[k] && moment(fieldsValue[k],moment.ISO_8601).isValid()){ //日期格式转换
                    fieldsValue[k]=moment(fieldsValue[k]).format("YYYY-MM-DD")
                }else if(!fieldsValue[k]){ //去除undefined
                    fieldsValue[k]=""
                }
            }  else{
                formList.forEach((item)=>{
                    if(k===item.name.split(".")[1]){
                        if(item.type==='file' ){
                            fieldsValue[item.id]=Units.packFile2Show(item.value,55)
                            fieldsValue[k]=item.value;
                        }
                    }
                })
            }
        }
        fieldsValue["code"]=code
        fieldsValue["key"]=code
        fieldsValue["groupId"]=groupId.toString()
        fieldsValue["totalName"]=totalName    
        const relation=form.getFieldsValue()["relation"]
        if(relation){
            fieldsValue["10000"]=relation
        }
        // console.log(formList)
        // console.log(fieldsValue)
        this.props.handleOk(fieldsValue);
    } 
    onRef=(ref)=>{
		this.child=ref
    }
    render(){
        const { formList,type,form,title,visibleForm,handleCancel,getOptions,options,maskClosable,deleteRFieldValue}=this.props;
        return(
            <Modal
                title={title}
                visible={visibleForm}
                onOk={this.handleOk}
                onCancel={handleCancel}
                okText="确认"
                cancelText="取消"
                destroyOnClose
                width={930}
                maskClosable={maskClosable}
                >
                <Form layout="inline" autoComplete="off"> 
                    <BaseInfoForm
                        formList={formList} 
                        type={type} 
                        form={form}
                        width={220}
                        getOptions={getOptions}
                        options={options}
                        flag={false}
                        deleteRFieldValue={deleteRFieldValue}
                        />          
                </Form>       
            </Modal> 
        )
    }
}
export default Form.create()(ModelForm);