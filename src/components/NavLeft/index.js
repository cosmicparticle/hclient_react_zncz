import React from 'react'
import { Menu, Button} from 'antd';
//import Super from "./../../super"
import { NavLink,withRouter } from 'react-router-dom'
import './index.css'
import Units from '../../units'
const SubMenu = Menu.SubMenu;



class NavLeft extends React.Component{

	state={
		menuTreeNode:[],
		selectedKeys:[],
		openKeys:[],
		collapsed: false,
	}
	getCurrentMenuId(){
        const pathname = this.props.history.location.pathname;
        let menuId = pathname.split("/")[1];
//        console.log('ssssssssss');
        const execResult = /\/customPage\/(\d+)\//.exec(pathname);
        if(execResult) menuId = execResult[1];
        return menuId;
	}
	componentWillReceiveProps(){
		const menuId = this.getCurrentMenuId();
		const {open}=this.state
		const key=[]
		for(let k in open){
			open[k].forEach((it)=>{
				if(it.toString()===menuId){
					key.push(k)
				}
			})
		}
		this.setState({
			selectedKeys:[menuId],
			openKeys:key
		})
	}
	componentDidMount(){
        this.props.onRef(this)
    }
	setMenuTreeNode=(list)=>{
		const menuId = this.getCurrentMenuId();
		const open={}
		list.l1Menus.forEach((item)=>{
			if(item.l2Menus){
				const ids=[]
				item.l2Menus.forEach((it)=>{
					ids.push(it.id)
				})
				open[item.id]=ids
			}
		})
		const key=[]
		for(let k in open){
			open[k].forEach((it)=>{
				if(it.toString()===menuId){
					key.push(k)
				}
			})
		}
		this.setState({
			menuTreeNode:this.renderMenu(list.l1Menus),
			selectedKeys:[menuId],
			openKeys:key,
			open
		})
	}
	renderMenu=(data)=>{
		return data.map((item)=>{
			if(item.l2Menus){
				return <SubMenu title={item.title} key={item.id}>
							{ this.renderMenu(item.l2Menus) }
						</SubMenu>				
			}
			return  <Menu.Item key={item.id} >
						<NavLink to={item.customPagePath? `/customPage/${item.id}/${item.customPagePath}`: `/${item.id}`}>{item.title}</NavLink>
				    </Menu.Item>
		})
	}
	handleOpen=(openKeys)=>{
		if(openKeys.length>1){
			openKeys.splice(0,1);
		}	
		this.setState({
			openKeys
		})
	}


	toggleCollapsed = () => {
		this.setState({
		  collapsed: !this.state.collapsed,
		});
	  };

	render(){
		const { menuTreeNode,selectedKeys,openKeys }=this.state
		
		return (
			<div>
				<div className="logo">
					<a href="#/home"><h1>{Units.programName_NavLeft()}</h1></a>
					{/* <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}> */}
						{/* {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)} */}
						按钮
					{/* </Button> */}
				</div>
				<Menu 
					mode="inline"
					theme="dark"
					onOpenChange={this.handleOpen} //手风琴
					selectedKeys={selectedKeys}
					openKeys={openKeys}
					inlineCollapsed={this.state.collapsed}
					>
					{menuTreeNode}
				</Menu>
				
			</div>
		)
	}
}
export default withRouter(NavLeft)
