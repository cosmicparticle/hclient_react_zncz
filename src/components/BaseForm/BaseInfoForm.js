import React from 'react'
import {Input,Form,Select,DatePicker,InputNumber,Button,Row,Col} from 'antd'
import Units from "../../units";
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import NewUpload from './../NewUpload'
import NewCascader from './../NewCascader'
import EditTable from "../EditTable";
import {util} from "echarts/src/export";
moment.locale('zh-cn');
const FormItem=Form.Item
const { TextArea } = Input;

export default class BaseInfoForm extends React.Component{
    state={
        fileList:[],
        visiCascader:"none"
    }
    changeCascader=(e,available)=>{
        if(available){
            e.target.style.display="none"
            this.setState({
                visiCascader:"inline-block"
            })
        }
    }

     fileNormalize = (value, prevValue) => {
        if(!value){
            if(prevValue===" "){
                return  prevValue;
            }else{
                return undefined;
            }
        }
        const {removed}=value;
        if(removed===true){
            return ' ';
        }else{
            return value;
        }
    };


    getplaceholder=(available,title)=>{ return available?`请选择${title}`:"无需选填"}

    // changeFile=(e)=>{
    //     this.setState({
    //         close:"none"
    //     })
    // }
    changePass=(e,fieldValue)=>{
        e.target.value=fieldValue
        this.props.setPassword(fieldValue)
    }
    changeInt=(e)=>{ //只允许输入整数
        if(e.target.value && !isNaN(e.target.value)){
            e.target.value=parseInt(e.target.value)
        }else{
            e.target.value=""
        }
    }
    ;
    initFormList=()=>{
        const { getFieldDecorator } = this.props.form?this.props.form:"";
        const { formList,width,type,getTemplate,getDetailFormTmpl,deleteRFieldValue}=this.props
        const formItemList=[]; 
        console.log(formList)
        if(formList && formList.length>0){
            formList.forEach((item,index)=>{
                const title=item.title;
                const field=item.code?item.code+index:item.fieldId
                const fieldValue=item.value;
                const available=item.fieldAccess && item.fieldAccess!=="读" && item.fieldAvailable ;
                const fieldName=item.name
                if(item.type==="date"){
                    const DATE= <FormItem label={title} key={field} className='labelcss'>
                                    {type==="detail"?<span className="infoStyle">{fieldValue}</span>:
                                        getFieldDecorator(fieldName,{
                                            initialValue:fieldValue?moment(fieldValue,'YYYY-MM-DD'):null,
                                            rules:item.validators?[{
                                                    required: true, message: `请选择${title}`,
                                                  }]:"",
                                        })(
                                            <DatePicker
                                                style={{width:width}} 
                                                locale={locale} 
                                                placeholder={this.getplaceholder(available,title)}
                                                getCalendarContainer={trigger => trigger.parentNode}
                                                disabled={!available}
                                                />
                                    )}
                                </FormItem>
                    formItemList.push(DATE)                
                }else if(item.type==="datetime"){
                    const DATETIME= <FormItem label={title} key={field} className='labelcss'>
                        {type==="detail"?<span className="infoStyle">{fieldValue}</span>:
                            getFieldDecorator(fieldName,{
                                initialValue:fieldValue?moment(fieldValue,'YYYY-MM-DD HH:mm:ss'):null,
                                rules:item.validators?[{
                                    required: true, message: `请选择${title}`,
                                }]:"",
                            })(
                                <DatePicker
                                    showTime={true}
                                    format='YYYY-MM-DD HH:mm:ss'
                                    style={{width:width}}
                                    locale={locale}
                                    placeholder={this.getplaceholder(available,title)}
                                    getCalendarContainer={trigger => trigger.parentNode}
                                    disabled={!available}
                                />
                            )}
                    </FormItem>
                    formItemList.push(DATETIME)
                }else if(item.type==="text" || item.type===null){
                    const TEXT= <FormItem label={title} key={field} className='labelcss'>
                                    {type==="detail"?<span className="infoStyle">{fieldValue}</span>:
                                        getFieldDecorator(fieldName,{
                                            initialValue:fieldValue,
                                            rules:item.validators?[{
                                                    required: true, message: `请输入${title}`,
                                                }]:"",
                                        })(
                                            <Input 
                                                type="text" 
                                                style={{width:width}}
                                                placeholder={available?`请输入${title}`:"无需输入"}
                                                disabled={!available}
                                                />
                                    )}
                                </FormItem>   
                    formItemList.push(TEXT)                
                }else if(item.type==="password"){
                    const TEXT= <FormItem label={title} key={field} className='labelcss'>
                                    {type==="detail"?<span className="infoStyle">******</span>:
                                        getFieldDecorator(fieldName,{
                                            initialValue:fieldValue,
                                            rules:item.validators?[{
                                                    required: true, message: `请输入${title}`,
                                                }]:"",
                                        })(
                                            <Input 
                                                type="password" 
                                                style={{width:width}}
                                                placeholder={available?`请输入${title}`:"无需输入"}
                                                onChange={(e)=>this.changePass(e,fieldValue)}
                                                />
                                    )}
                                </FormItem> 
                    formItemList.push(TEXT)                
                }else if(item.type==="select"){
 //                   console.log(item.fieldId)

                    const SELECT= <FormItem label={title} key={field} className='labelcss'>
                                        {type==="detail"?<span className="infoStyle">{fieldValue}</span>:
                                            getFieldDecorator(fieldName,{
                                                initialValue:fieldValue?fieldValue:undefined,
                                                rules:item.validators?[{
                                                        required: true, message: `请选择${title}`,
                                                      }]:"",
                                        })(
                                            <Select 
                                                style={{width:width}} 
                                                onFocus={()=>{this.props.getOptions(item.fieldId);}}
                                                placeholder={this.getplaceholder(available,title)}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                disabled={!available}                                              
                                                notFoundContent="暂无选项"
                                                allowClear={true}
                                                showSearch
                                                >
                                                    {Units.getSelectList(this.props.options)}
                                            </Select>
                                        )}
                                    </FormItem> 
                    formItemList.push(SELECT)    
                }else if(item.type==="multiselect"){
                    const LABEL= <FormItem label={title} key={field} className='labelcss'>
                                        {type==="detail"?<span className="infoStyle">{fieldValue}</span>:
                                            getFieldDecorator(fieldName,{
                                                initialValue:fieldValue?fieldValue.split(','):[],
                                                rules:item.validators?[{
                                                        required: true, message: `请选择${title}`,
                                                      }]:"",
                                            })(
                                            <Select
                                                mode="multiple"
                                                style={{width:width}}
                                                onFocus={()=>{this.props.getOptions(item.fieldId);}}
                                                placeholder={this.getplaceholder(available,title)}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                disabled={!available}
                                                notFoundContent="暂无选项"
                                                allowClear={true}
                                                >
                                                    {Units.getSelectList(this.props.options)}
                                            </Select>
                                        )}
                                </FormItem>
                    formItemList.push(LABEL)   
                }else if(item.type==="caselect"){ 
                    const CASELECT= <FormItem label={title} key={field} className='labelcss'>
                                        {type==="detail"?<span className="infoStyle">{fieldValue}</span>:
                                        fieldValue?<div>
                                            <Input style={{width:width}} value={fieldValue} onClick={(e)=>this.changeCascader(e,available)} readOnly/>
                                            {this.state.visiCascader==="inline-block"?getFieldDecorator(fieldName,{
                                                rules:item.validators?[{
                                                        required: true, message: `请输入${title}`,
                                                        }]:"",
                                            })(
                                                <NewCascader
                                                    optionGroupKey={item.optionGroupKey}
                                                    fieldName={fieldName}
                                                    disabled={!available}
                                                />
                                            ):""}
                                            </div>:
                                            getFieldDecorator(fieldName,{
                                                rules:item.validators?[{
                                                        required: true, message: `请输入${title}`,
                                                      }]:"",
                                            })(
                                                <NewCascader
                                                    optionGroupKey={item.optionGroupKey}
                                                    fieldName={fieldName}
                                                    disabled={!available}
                                                />
                                        )}
                                </FormItem>
                    formItemList.push(CASELECT)   
                }else if(item.type==="relation") { //modelForm里面的关系下拉框
                    const SELECT = <FormItem label={title} key={field} className='labelcss'>
                        {getFieldDecorator("relation", {
                            initialValue: fieldValue?fieldValue:item.defaultValue,
                            rules: item.validators ? [{
                                required: true, message: `请选择${title}`,
                            }] : "",
                        })(
                            <Select
                                style={{width: width}}
                                placeholder={`请选择${title}`}
                                getPopupContainer={trigger => trigger.parentNode}
                                notFoundContent="暂无选项"
                                allowClear={true}
                            >
                                {Units.getSelectList(item.options)}
                            </Select>)}
                    </FormItem>
                    formItemList.push(SELECT)
                }else if(item.type==="file"){
 //                   console.log(fieldValue)
                    if(item.value && item.value.constructor ===File){
                        const FILE= <FormItem label={title} key={field} className='labelcss'>
                            {  getFieldDecorator(fieldName,{ normalize: this.fileNormalize,})(
                            <NewUpload fileList={[item.value]}
                                width={width}
                            />
                        )}
                        </FormItem>
                        formItemList.push(FILE)
                    }else{
                        const fieldValue_=fieldValue===" "?"无文件":fieldValue;
                        let url=fieldValue_?fieldValue_:"";
                        let obj=url.lastIndexOf("/");
                        const fileName=url.substr(obj+1);
                        let fileList_=[{
                            uid:'-3',
                            name: fileName,
                            status: 'done',
                            url: Units.api()+url,
                        },];

                        const FILE= <FormItem label={title} key={field} className='labelcss'>
                            {type==="detail"?
                                Units.packFile2Show(url,width)
                                : !available?Units.packFile2Show(url,width)
                                    :
                                (fieldValue_ && fieldValue_!=="无文件"?
                                    getFieldDecorator(fieldName,{ normalize: this.fileNormalize,})(
                                        <NewUpload fileList={fileList_}
                                                   width={width}
                                        />
                                    )
                                    :
                                    getFieldDecorator(fieldName,{ normalize: this.fileNormalize,})(
                                        <NewUpload
                                            width={width}
                                        />
                                    ))}
                        </FormItem>
                        formItemList.push(FILE)
                    }

                    }else if(item.type==="decimal" || item.type==="float" || item.type==="double"){
                        const decimal= <FormItem label={title} key={field} className='labelcss'>
                            {type==="detail"?<span className="infoStyle">{fieldValue}</span>:
                                getFieldDecorator(fieldName,{
                                    initialValue:fieldValue,
                                })(
                                    <InputNumber
                                        placeholder={available?`请输入${title}`:"无需输入"}
                                        style={{width:width}}
                                        step={0.1}
                                        disabled={!available}
                                        min={0}/>
                                )}
                        </FormItem>

                    formItemList.push(decimal)   
                }else if(item.type==="int"){
                    const int= <FormItem label={title} key={field} className='labelcss'>
                                        {type==="detail"?<span className="infoStyle">{fieldValue}</span>:
                                        getFieldDecorator(fieldName,{
                                            initialValue:fieldValue,
                                        })(
                                            <InputNumber 
                                                placeholder={available?`请输入${title}`:"无需输入"}
                                                style={{width:width}} 
                                                disabled={!available}
                                                onKeyUp={this.changeInt}
                                                min={0}/>
                                        )}
                                    </FormItem>
                    formItemList.push(int)   
                }else if(item.type==="textarea"){
                    const textarea= <FormItem label={title} key={field} className='labelcss'>
                                        {type==="detail"?<span className="infoStyle">{fieldValue}</span>:
                                        getFieldDecorator(fieldName,{
                                            initialValue:fieldValue,
                                            rules:item.validators?[{
                                                required: true, message: `请选择${title}`,
                                            }]:"",
                                        })(
                                            <TextArea 
                                                placeholder={available?`请输入${title}`:"无需输入"}
                                                style={{width:width}} 
                                                disabled={!available}
                                                />
                                        )}
                                    </FormItem>
                    formItemList.push(textarea)   
                } else if(item.type==="relselect" || item.type==="refselect" ){
                    let value=fieldValue==null?null:fieldValue.split('@R@')[1];
                    let code=fieldValue==null?undefined:fieldValue.split('@R@')[0];
                    let refGroupId=item.refGroupId;
                    let refselect=null;
                    if(!refGroupId){
                        refselect= <FormItem label={title} key={field} className='labelcss'>
                            {type==="detail"?<span className="infoStyle">{value}</span>:
                                getFieldDecorator(fieldName,{
                                    initialValue:value,
                                    rules:item.validators?[{
                                        required: true, message: `请输入${title}`,
                                    }]:"",
                                })(
                                    <Input
                                        type="text"
                                        style={{width:width}}
                                        placeholder={available?`请输入${title}`:"无需输入"}
                                        disabled={!available}
                                    />
                                )}
                        </FormItem>

                    }else{
                        refselect= <FormItem label={title} key={field} className='labelcss'>
                            {type==="detail"?<span className="infoStyle"> <Button  type="link" title="查看详情" onClick={()=>getDetailFormTmpl({modalType:"detail",rfieldId:item.id},{code})}>
                                                {value}
                                            </Button>
                            </span> :
                                getFieldDecorator(fieldName,{
                                    initialValue:fieldValue,
                                    rules:item.validators?[{
                                        required: true, message: `请选择${title}`,
                                    }]:"",
                                })(<div>
                                        {value? available? <div>
                                            <Button  type="link" title="查看详情" onClick={()=>getDetailFormTmpl({modalType:"edit",rfieldId:item.id},{code})}>
                                                {value}
                                            </Button>
                                            <Button  type="dashed" icon="select" onClick={()=>getTemplate({rfieldId:item.id,excepts:code?[code]:[]})}>
                                            </Button>
                                            {item.type==="refselect"?
                                            <Button  type="dashed" icon="delete" onClick={()=>deleteRFieldValue(item.id)}>
                                            </Button>:""}
                                        </div> :  <Button  type="link" title="查看详情" onClick={()=>getDetailFormTmpl({modalType:"detail",rfieldId:item.id},{code})}>
                                            {value}
                                        </Button> : available?
                                            <Button  type="dashed" icon="select" onClick={()=>getTemplate({rfieldId:item.id,excepts:code?[code]:[]})}>
                                                {value?value:"请选择"+title}
                                            </Button> :
                                            <TextArea
                                                placeholder={"无需输入"}
                                                style={{width:width}}
                                                disabled={true}
                                            />
                                        }

                                    </div>
                                )}
                        </FormItem>
                    }

                    formItemList.push(refselect)
                }
                return false
            })
        }
        const rowList=[];
        for(let i=0;i<formItemList.length; i=i+2 ){
            const row=
                <Row key={i}>
                    <Col span={12}>
                        {formItemList[i]}
                    </Col>
                    <Col span={12}>
                        {formItemList[i+1]}
                    </Col>
                </Row>
            rowList.push(row);
        }

        return rowList;
    }
    render(){
        return(
            this.initFormList()
            )
        }
    }