import React, { Component } from 'react'
import { Form, Icon, Input, Button, Modal } from 'antd';
import axios from 'axios';
import { loginUrl, menuUrl } from '../help/url'
import '../style/login.css'
import createHistory from 'history/createHashHistory';
const history = createHistory()
const FormItem = Form.Item;

class LoginView extends Component {
    constructor () {
        super()
        this.state={

        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.post(loginUrl , values)
                .then(function (response) {
                    const errtext = response.data.errtext
                    if (errtext) {
                        Modal.error({
                            title: '错误提示',
                            content: errtext
                        });
                    } else {
                        axios.post(menuUrl, {"req":"0"})
                        .then(function (response) {
                            const errtext = response.data.errtext
                            const result = response.data.result
                            const username = response.data.username
                            window.localStorage.removeItem('menusResult')
                            if (errtext) {
                                Modal.error({
                                    title: '错误提示',
                                    content: errtext
                                });
                            } else {
                                // if ( !JSON.parse(window.localStorage.getItem('menusResult'))) {
                                    window.localStorage.setItem('menusResult', JSON.stringify(result))
                                    window.localStorage.setItem('username', username)
                                // }
                                history.push('/')
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        });
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{width: '100%', height: '100vh', background: '#f0f2f5'}}>
                <div className="container">
                    <div className="logo"><img src="http://xbcdn-ssl.xibao100.com/media/img/dsp/site/dsp_n/xb/logo-big.jpg?v=2016080901" alt=""/></div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请填写用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请填写密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            {/* {getFieldDecorator('remember', {
                                valuePropName: 'ch  ecked',
                                initialValue: true,
                            })(
                                <Checkbox>Remember me</Checkbox>
                            )} */}
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录平台
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

const Login = Form.create()(LoginView);

export default Login