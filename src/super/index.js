import superagent from 'superagent'
import { message } from 'antd';
import Units from './../units'

export default class Superagent{
    static super(options,type,load){
        const tokenName=Units.getLocalStorge("tokenName")
        let loading;
        if(options.data && options.data.isShowLoading!==false){
            loading=document.getElementById('ajaxLoading')
            loading.style.display=load?load:"block"
        }
        let ty="form"
        if(type==="formdata"){
            ty=null
        }else if(type==="json"){
            ty="application/json"
        }
        let method=options.method?options.method:"POST";
        return new Promise((resolve,reject)=>{
            superagent(method,Units.api()+options.url)
                .type(ty)
                .set("hydrocarbon-token",tokenName)
                .query(options.query||'')
                .send(options.data)
                .end((req,res)=>{
                    if(options.data && options.data.isShowLoading!==false){
                        loading=document.getElementById('ajaxLoading')
                        loading.style.display="none"
                    } 
                    //console.log(res.body)
                    if(res.status===200){
                        Units.setLocalStorge("tokenName",tokenName)
                        resolve(res.body)
                    }else if(res.status===403){
                        message.info("请求权限不足,可能是token已经超时")
                        window.location.hash="/login";
                    }else if(res.status===404||res.status===504){
                        message.info("服务器连接失败!")
                    }else if(res.status===500){
                        message.info("后台处理错误。")
                    }else{
                        reject(res.body)
                    }
                })              
        })
    }
    static get(options){
        return new Promise((resolve,reject)=>{
            superagent
                .get(Units.api()+options.url)
                .query(options.query||'')
                .end((req,res)=>{ 
                    if(res.status===200){
                        resolve(res.body)
                    }else if(res.status===403){
                        message.info("请求权限不足,可能是token已经超时")
                        window.location.hash = "#/login";
                    }else if(res.status===404||res.status === 504){
                        message.info("服务器连接失败!")
                    }else if(res.status===500){
                        message.info("后台处理错误。")
                    }else{
                        reject(res.body)
                    }
                })              
        })
    }
}