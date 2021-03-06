import React, { Component } from 'react';
import { Form, Input, Button, Select, InputNumber, Modal, Breadcrumb } from 'antd';
import axios from 'axios'
import { menuUrl} from '../help/url'
import createHistory from 'history/createHashHistory';
import {
	Link
} from 'react-router-dom'
const history = createHistory()
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const zhiweiUrl = '/zhiwei/000105'
class ZhiweiForm extends Component {
    constructor () {
        super()
        this.state = {
            positiontype: '',
            positionname: '',
            level: '',
            ogList: [],
            og_id: '',
            og_name:''
        }
    }
    componentDidMount () {
        const syscode = this.props.match.params.syscode
        const id = this.props.match.params.id
        const _this = this
        axios.post(menuUrl, {req:"6",syscode: syscode, datatype: "1"})
            .then(function (response) {
                const errtext = response.data.errtext
                const result = response.data.result
                if (errtext) {
                    return null
                } else {
                    _this.setState({
                        ogList: result
                    })
                }
            })
            .catch(function (error) {
            console.log(error);
        });
        if (id > 0) {
            axios.post(menuUrl, {req:"8",syscode: syscode, id: id})
                .then(function (response) {
                const errtext = response.data.errtext
                const result = response.data.result
                let obj = {}
                let DataList = {}
                if (errtext) {
                return null
                }
                if (result.length > 0) {
                    for(var i=0; i<result.length; i++) {
                        obj= result[i]
                    }
                    for (var j=0; j<obj.DataList.length; j++) {
                        DataList = obj.DataList[j]
                    }
                    let cityAdress = [DataList.province, DataList.city, DataList.district]
                    _this.setState({
                        positiontype: DataList.positiontype, 
                        positionname: DataList.positionname, 
                        level:　DataList.level, 
                        og_name: DataList.og_name,
                        og_id: DataList.og_id
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const syscode = this.props.match.params.syscode
        const id = this.props.match.params.id
        this.props.form.validateFields((err, values) => {
          if (!err) {
            if (id > 0) {
                axios.post(menuUrl, {req: '3',syscode: syscode, id: id, data: values})
                .then(function (response) {
                const errtext = response.data.errtext
                if (errtext) {
                    Modal.error({
                        title: '错误提示',
                        content: errtext
                    });
                    return null
                    } else {
                    Modal.success({
                        title: '微信提示',
                        content: '修改成功！',
                        onOk() {
                            history.push(zhiweiUrl)
                        },
                    });
                    }
                })
                .catch(function (error) {
                console.log(error);
                });
            } else {
                axios.post(menuUrl, {req: '2',syscode: syscode, data: values})
                .then(function (response) {
                    const errtext = response.data.errtext
                    if (errtext) {
                        Modal.error({
                            title: '错误提示',
                            content: errtext
                        });
                        return null
                    } else {
                        Modal.success({
                            title: '微信提示',
                            content: '创建成功！',
                            onOk() {
                                history.push(zhiweiUrl)
                            },
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
          }
        });
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { positiontype, positionname, level, og_id,  og_name, ogList } = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            }
        };
        const Edit= this.props.match.params.isEdit == 0 ? false : true
        const id = this.props.match.params.id
        return (
            <div>
                <div style={{padding: '15px 15px 6px 15px', background: '#fff', marginBottom: '15px'}}>
                    <Breadcrumb>
                        <Breadcrumb.Item ><Link to={zhiweiUrl}>首页</Link></Breadcrumb.Item>
                        <Breadcrumb.Item style={{color: '#1890ff'}}>
                        {id > 0 ? "详细信息" : "新建职位信息"}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <h3 style={{lineHeight: '34px'}}>编辑职位信息</h3>
                </div>
                <Form onSubmit={this.handleSubmit} style={{backgroundColor: '#fff', padding: '20px 0'}}>
                    <FormItem
                        {...formItemLayout}
                        label="所属机构"
                        >
                        {getFieldDecorator('og_id', {
                            rules: [
                            { required: true, message: '请您选择所属机构' },
                            ],
                            initialValue: id === "0" ? "" : og_name
                        })(
                            <Select placeholder="选择所属机构" disabled={!Edit}>
                            {
                                    ogList.length > 0
                                    ? ogList.map ((Item, index) => {
                                        return (
                                            <Option value={Item.ogname} key={Item.og_id}>{Item.ogname}</Option>
                                        )
                                    })
                                    : null
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="职位名称"
                        >
                        {getFieldDecorator('positionname', {
                            rules: [
                            { required: true, message: '请您填写职位名称' },
                            ],
                            initialValue: positionname
                        })(
                            <Input disabled={!Edit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="职位类型"
                        >
                        {getFieldDecorator('positiontype', {
                            rules: [
                            { required: true, message: '请您填写职位类型' },
                            ],
                            initialValue: positiontype
                        })(
                            <Select disabled={!Edit}>
                                <Option value="企业">企业</Option>
                                <Option value="机构">机构</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="职位级别"
                        >
                        {getFieldDecorator('level', {
                            rules: [
                            { required: true, message: '请您填写职位级别' },
                            ],
                            initialValue: level
                        })(
                            <InputNumber disabled={!Edit}/>
                        )}
                    </FormItem>
                    <FormItem  wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 16, offset: 8 },
                        }}>
                        <Button type="primary" htmlType="submit" disabled={!Edit}>保存</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const zhiwei = Form.create()(ZhiweiForm);
export default zhiwei