import React, { Component } from 'react';
import { Menu, Icon, Layout } from 'antd';
import {
	Link
} from 'react-router-dom';
import axios from 'axios';
import '../style/slide.css'
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const data = [{
    ID: '3',
    path: '/qiyeForm'
},{
    ID: '5',
    path: '/jigou'
},{
    ID: '9',
    path: '/bumen'
},{
    ID: '13',
    path: '/gangwei'
},{
    ID: '17',
    path: '/zhiwei'
},{
    ID: '21',
    path: '/yuangong'
}]
class SlideView extends Component {
    renderSubMenu (result) {
        const pathName = this.props.pathname
        let dom = []
        let newChild = []
        if (result.length >0) {
           for (var j=0; j<result.length; j++) {
                    const itemChild = result[j].child
                    for (var m=0; m<itemChild.length; m++) {
                        const child = itemChild[m].child
                        for (var s=0; s<child.length; s++) {
                            for(var n=0; n<data.length; n++) {
                                if(child[s].ID === data[n].ID) {
                                    child[s].path = data[n].path
                                }
                            }   
                        }
                        dom.push (
                            <SubMenu
                                    key={`sub${m}`}
                                    title={
                                    <span>
                                        <img src={itemChild[m].imgpath} alt="" style={{width: '18px', height: '18px'}}/>
                                        &nbsp;&nbsp;
                                        <span>{itemChild[m].sysname}</span>
                                    </span>}
                                    >
                                    {
                                        child.length > 0
                                        ? child.map((val, k) => {
                                            const isSelect = pathName.indexOf(val.path) > -1
                                            return (
                                                <Menu.Item key={val.ID} className={isSelect ? 'ant-menu-item-selected menuitem' : 'menuitem'}>
                                                    <Link to={val.path ? val.path+'/'+val.syscode : ''}>
                                                    <img src={val.imgpath} alt="" style={{width: '18px', height: '18px'}}/>
                                                    &nbsp;&nbsp;{val.sysname}</Link>
                                                </Menu.Item>
                                            )
                                        })
                                        : null
                                    }
                            </SubMenu>
                        )
                    }
                   
                }
                return dom
            
        }
    }
    render () {
        const result = this.props.result
        return (
            <Sider
            style={{ flex: '0 0 200px',maxWidth: '200px',
            minWidth: '200px',
            width: '200px'}}
            trigger={null}
            collapsible
            collapsed={this.props.collapsed}
            >
            <div className="logoSlide">
                <img src='https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg' className="logoImg"/>
                <Link to={"/"}><h1 style={{color: '#fff',fontSize: '16px', margin: '0 0 0 8px'}}>基础信息管理系统</h1></Link>
            </div>    
            <Menu theme="dark" mode="inline" defaultOpenKeys={['sub0']}>
                {this.renderSubMenu(result)}
            </Menu>
                {/* <Menu theme="dark" mode="inline" defaultOpenKeys={['sub0']}>
                    {   result.length > 0
                        ? result.map((itemChild, index) => {
                            return (
                                <SubMenu key={itemChild.ID} title={
                                    <span>
                                        <img src={itemChild.imgpath} alt="" style={{width: '18px', height: '18px'}}/>
                                        &nbsp;&nbsp;
                                        <span>{itemChild.sysname}</span>
                                    </span>}>
                                    {this.renderSubMenu(itemChild.child)}
                                </SubMenu>
                            )
                        })
                        : null
                        
                    }
                   
                </Menu> */}
            </Sider>
        )
    }
}

export default SlideView