import React from 'react'
import Units from "../../units";
export default class HCWelcome extends  React.Component{
    render(){
        return <div>
            <div style={{textAlign:'center',paddingTop:'80px'}}>
                <img alt="" src={Units.programName_Logo()} width='110' />
            </div>
            <div style={{textAlign:'center',fontWeight: 600,fontSize: '40px',paddingTop:'10px',}}>{Units.programName_sub()}</div>
            <div style={{ textAlign:'center',fontWeight: 600,fontSize: '60px',paddingTop:'20px', }}>{Units.programName()}</div>
        </div>
    }

}
