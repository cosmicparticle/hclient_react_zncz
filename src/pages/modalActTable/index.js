import React from 'react'
import {Modal} from "antd";
import ActTable from './../actTable'
const confirm = Modal.confirm;

export default class ModalActTable extends React.Component{

    render(){
        return(
           <Modal >
               <ActTable {...this.props}>
               </ActTable>
           </Modal>
           
        )
    }
}