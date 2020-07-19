import React from 'react'
import {Select, Radio, message, Button, Icon} from 'antd'
import ProgramConfig from '../programConfig.json'
import Axios from "axios";
import Logo from "./logo.png"

const Option = Select.Option;

const api = ProgramConfig.hydrocarbonServer;
const programName = ProgramConfig.programName;
const programName_sub=ProgramConfig.programName_sub;
const programName_NavLeft=ProgramConfig.programName_NavLeft;
let storageKeyPrefix = undefined;

//加载本地配置
Axios.create().get('programConfig.json').then((result) => {
    window.localStorage['programName'] = result.data.programName
    window.localStorage['hydrocarbonServer'] = result.data.hydrocarbonServer
    window.localStorage['programName_NavLeft'] = result.data.programName_NavLeft
    window.localStorage['programName_sub'] = result.data.programName_sub
    window.localStorage['programName_Logo'] = result.data.programName_Logo
}).catch((error) => { console.log(error) });

export default {
    api(){
        return window.localStorage['hydrocarbonServer']?window.localStorage['hydrocarbonServer']:api
    },
    programName(){
        return window.localStorage['programName']?window.localStorage['programName']:programName
    },
    programName_sub(){
        return window.localStorage['programName_sub']?window.localStorage['programName_sub']:programName_sub
    },
    programName_NavLeft(){
        return window.localStorage['programName_NavLeft']?window.localStorage['programName_NavLeft']:programName_NavLeft
    },
    programName_Logo(){
        return window.localStorage['programName_Logo']?window.localStorage['programName_Logo']:Logo
    },

    formateDate(time){
        if(!time) return '';
        const date=new Date(time);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
    },
    pagination(data,callback){
        const page={
            onchange:(current)=>{
                callback(current)
            },
            current:data.pageInfo.pageNo,
            pageSize:data.pageInfo.pageSize,
            total:data.pageInfo.count,
            showTotal:()=>{
                return `共${data.pageInfo.count}条`
            },
            showQuickIumper:true
        }
        return page
    },
    getSelectList(data){
        if(!data){
            return [];
        } 
        const options=[]
        data.map((item)=>{
            options.push(<Option value={item.value} key={item.title}>{item.title}</Option>)
            return false
        })
        return options
    },
    getRadioList(data){
        if(!data){
            return [];
        } 
        const options=[]
        data.map((item)=>{
            options.push(<Radio value={item.id} key={item.id}>{item.name}</Radio>)
            return false
        })
        return options
    },
    downloadFile(url) { 
        try{ 
            let elemIF = document.createElement("iframe");   
            elemIF.src = this.api()+url;
            elemIF.style.display = "none";   
            document.body.appendChild(elemIF);   
        }catch(e){ 
            message.error(e)
        } 
    },
    setCookie(cname,cvalue,exdays){
        const d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        const expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    getCookie(cname){
        const name = cname + "=";
        const ca = document.cookie.split(';');
        for(let i=0; i<ca.length; i++){
            const c = ca[i].trim();
            if (c.indexOf(name)===0) return c.substring(name.length,c.length);
        }
        return "";
    },
    delCookie(cname){ 
        const exp = new Date(); 
        exp.setTime(exp.getTime() - 1); 
        const cval=this.getCookie(cname); 
        if(cval!=null) 
            document.cookie= cname + "="+cval+";expires="+exp.toGMTString(); 
    },
    //随机数
    RndNum(n){   
        let rnd="";
        for(let i=0;i<n;i++)
            rnd+=Math.floor(Math.random()*10);
        return rnd;
    },
    /**
     * 获得用于在本地持久缓存的数据的Key前缀
     * 当前返回的值是第一次访问当前方法时的所在页面链接的pathname
     * 表示在不同的pathname下，永久缓存的数据将互不干扰
     * @returns {undefined}
     */
    getStorageKeyPrefix(){
        if(storageKeyPrefix === undefined){
            storageKeyPrefix = window.location.pathname || '';
        }
        return storageKeyPrefix;
    },
    setLocalStorge(key, value, min = 30) {
        if(key){
            key = this.getStorageKeyPrefix() + key;
        }
        // 设置过期原则
        if (!value) {
          localStorage.removeItem(key)
        } else {
            const Min=min || 30
            const exp = new Date();
            const expireAddTime = Min * 60 * 1000;
            localStorage.setItem(key, JSON.stringify({
                value, expireAddTime,
                expires: exp.getTime() + expireAddTime
            }));
        }
      },
    getLocalStorge(name) {
        if(name){
            name = this.getStorageKeyPrefix() + name;
        }
        try {
          let o = JSON.parse(localStorage[name])
          if (!o || o.expires < Date.now()) {
            return null
          } else {
              o.expires = Date.now() + o.expireAddTime;
              localStorage.setItem(name, JSON.stringify(o));
              return o.value;
          }
        } catch (e) {
            // 兼容其他localstorage
          return localStorage[name]
        } finally {
        }
      },
      queryParams(data, isPrefix = false){
        let prefix = isPrefix ? '?' : ''
        let _result = []
        for (let key in data) {
          let value = data[key]
          // 去掉为空的参数
          if ([undefined, null].includes(value)) {
            value=""
            continue
          }
          if (value && value.constructor === Array) {
            value.forEach(_value =>{
                _result.push(encodeURI(key) + '[]=' + encodeURI(_value))
                })
            } else {
                const str=encodeURI(key).replace("criteria","c")
                _result.push(str + '=' + encodeURI(value))
            }
        }
    
        return _result.length ? prefix + _result.join('&') : ''
      } ,
        urlToObj(str){
            let obj = {};
            const arr1 = str.split("?");
            const arr2 = arr1[1].split("&");
            for(let i=0 ; i < arr2.length; i++){
            const res = arr2[i].split("=");
            const str=res[0].replace("c","criteria")
                obj[str] = res[1];
            }
            return obj;
        },
        uniq(array,gWord){
            const res=[]
            array.map((item)=>{
                let flag = true;
                res.map((it)=>{
                    if(item[gWord]===it[gWord]){
                        flag = false;
                    }
                    return false
                })
                if(flag){
                    res.push(item);
                }
                return false
            })
            return res 
            },
        deepCopy(obj) {
            var result = Array.isArray(obj) ? [] : {};
            for (var key in obj) {
              if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object') {
                  result[key] = this.deepCopy(obj[key]);   //递归复制
                } else {
                  result[key] = obj[key];
                }
              }
            }
            return result;
        },
        forPic(fieldMap){ //原始数据的图片url转化为图片
            for(let i in fieldMap){
                if(fieldMap[i] && fieldMap[i].includes("download-files")){
                    const url=this.api()+ fieldMap[i]
                    fieldMap[i]=<img 
                                    style={{width:55}} 
                                    src={url} 
                                    alt="" />
                }
            }
            return fieldMap
        },

    forFile(fieldMap){
        for(let i in fieldMap){
            if(fieldMap[i] && fieldMap[i].includes("download-files")){
                fieldMap[i]=this.packFile2Show(fieldMap[i],55)
            }
        }
        return fieldMap
    },

     packFile2Show(file,width){
        if(!file){
            return file
        }else if((file).constructor === String ){
            const url=this.api()+ file;
            let obj=url.lastIndexOf("/");
            const fileName=url.substr(obj+1);
            return file && file!=="无文件"?<span className='labelcss'>
                                                <Button width={width} href={url}  size="default"><Icon type="download"/>{ fileName}</Button>
                                                </span>:<span className="downAvatar">无文件</span>
        }else if((file).constructor ===File){
            file.uid=new Date().getTime()+"-1";
            return <div id={new Date().getTime()}
                owlner={file}
            >{file.name}</div>
        }else if((file).constructor ===Object){
         return <div
                owlner={file.originFileObj}
         > {file.name}</div>
        }},
     getFileUrl(file){
        if(!file){return file;
        }else if((file).constructor === String ){return file;
         }else if((file).constructor ===Object ){
            if( file.props.children.props){
                const {href}= file.props.children.props;
                return href;
            }else if(file.props.owlner){
                return file.props.owlner;
            }else{
                return file;
            }
         }else{
            return  file;
        }


         }


    }