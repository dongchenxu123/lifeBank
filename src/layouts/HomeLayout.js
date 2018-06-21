import React from 'react'
import {
	Route
} from 'react-router-dom'
import { Layout, Button, Icon, Modal } from 'antd';
import SlideView from './slide'
import axios from 'axios';
import { menuUrl} from '../help/url'
import createHistory from 'history/createHashHistory';
const history = createHistory()
const { Content } = Layout;


//router配置的是二维数组，这里处理的是内层部分
class HomeLayout extends React.Component {
	constructor () {
		super()
		this.state ={
			collapsed: false,
			result: []
		}
	}
	componentWillMount () {
		const _this = this
		const result = JSON.parse(window.localStorage.getItem('menusResult'))
		if (result == null) {
			axios.post(menuUrl, {"req":"0"})
			.then(function (response) {
			const errtext = response.data.errtext
			const resultArr = response.data.result
			if (errtext) {
				Modal.error({
					title: '错误提示',
					content: errtext,
					onOk() {
						history.push('/login')
					}
				});
				return
			} else {
				_this.setState({
					result: resultArr
				})
				}
			})
			.catch(function (error) {
				console.log(error);
			});
		} else {
			this.setState({
				result: result
			})
		}
		
	}
	toggleCollapsed = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	}
	render() {
		const { routes, location } = this.props;
		const pathname = location.pathname
		// const result = JSON.parse(window.localStorage.getItem('menusResult'))
		const result = this.state.result
		const username = window.localStorage.getItem('username')
		const RouteWithSubRoutes = (route) => (
			<Route
				exact={route.exact}
				path={route.path}
				render={props => {
					return (<route.component {...props} routes={route.routes} />)
				}
				}
			/>
		)
		return (
			<Layout style={{height: '100vh'}}>
				{pathname === '/login' ? null : <SlideView collapsed={this.state.collapsed} pathname={pathname} result={result}/>}
				<Layout>
					{
						pathname === '/login'
						? null
						:  <div style={{height: '64px', backgroundColor: '#fff', marginBottom: '16px'}}>
								<Button onClick={this.toggleCollapsed} style={{ margin: '16px' }}>
									<Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
								</Button>
								<div style={{float: 'right', lineHeight: '64px', marginRight: '16px'}}>
									您好 <span style={{color: '#1890ff'}}>{username}</span>  , 欢迎登录！
								</div>
							</div>
					}
				    <Content style={{marginLeft: '16px'}}>
						{routes.map((route, i) => (
							<RouteWithSubRoutes key={i} {...route} />
						))}
					</Content>
				</Layout>
			</Layout>
			
		)
	}
}




export default HomeLayout