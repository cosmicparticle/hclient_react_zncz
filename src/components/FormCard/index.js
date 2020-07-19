import React from 'react'
import {Card} from 'antd'
import BaseInfoForm from './../BaseForm/BaseInfoForm'
import EditTable from "../EditTable";

export default class FormCard extends React.Component{

    initDetailsList=()=>{
        const { formList,type,form,loading,options,deleteRFieldValue}=this.props
        if(formList && formList.fields.length>0){ 
            const title=formList.title
            const fields=formList.fields
            return <Card
                        title={title} 
                        key={title} 
                        id={title} 
                        className="hoverable" 
                        headStyle={{background:"#f2f4f5"}}
                        loading={loading}
                        >
                        <BaseInfoForm 
                            key={title}
                            formList={fields} 
                            type={type}
                            form={form}
                            width={220}
                            getOptions={this.props.getOptions}
                            getTemplate={this.props.getTemplate} //关系点选模板
                            getDetailFormTmpl={this.props.getDetailFormTmpl}
                            options={options}
                            setPassword={this.props.setPassword}
                            deleteRFieldValue={deleteRFieldValue}
                            />
                    </Card>        
        }
    }
    render(){
        return( 
                this.initDetailsList()       
        )
    }
}