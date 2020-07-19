import React from 'react'
import { Modal} from 'antd';
import Detail from './../../pages/detail'

export default class EditAddTemplate extends React.Component{
    
    handleOk=()=>{
        const {editAddGroupId,columns}=this.props
        //console.log(columns)
        const arr=[]
        columns.forEach((item)=>{
            if(item.id.toString()===editAddGroupId){
                item.fields.forEach((it)=>{
                    if(it.additionAccess){
                        arr.push(it.id)
                    }
                })
            }
        })
        //console.log(arr)
        let dfieldIds=arr.join(',')
        this.detail.showModal(dfieldIds)
        // if(code){
        //     this.detail.TemplatehandleOk(code,editAddGroupId,false,dfieldIds)
        // }
    }
    onRef3=(ref)=>{
		this.detail=ref
    }
    render(){
        const {visibleEditAddTemplate,handleCancel,type,title,menuId,editAddGroupId,code,fresh,maskClosable,rfieldId,
            TemplatehandleOk}=this.props
        return (
            <div>               
                <Modal
                    title={title}
                    visible={visibleEditAddTemplate}
                    okText={type==="detail"?"确定":"保存"}
                    cancelText="取消"
                    centered
                    onOk={type==="detail"?handleCancel:this.handleOk}
                    onCancel={handleCancel}
                    destroyOnClose
                    width={960}
                    maskClosable={maskClosable}
                    bodyStyle={{height:430,overflow:'auto'}}
                    >
                    <Detail
                        menuId={menuId}
                        fieldGroupId={editAddGroupId}
                        rfieldId={rfieldId}
                        type={type}
                        code={code}
                        isModal={true}
                        onRef3={this.onRef3}
                        handleCancel={handleCancel}
                        fresh={fresh}
                        TemplatehandleOk={TemplatehandleOk}
                    />                                  
                </Modal>
                            
            </div>
        )
    }
}