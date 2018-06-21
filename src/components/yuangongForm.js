import React, { Component } from 'react';
import { Form, Input, Select, Button,  Row, Col, DatePicker, Modal, Breadcrumb } from 'antd';
import { menuUrl} from '../help/url';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import '../style/yuangongForm.css'
import moment from 'moment';
import axios from 'axios';
import 'moment/locale/zh-cn';
import createHistory from 'history/createHashHistory';
import {
	Link
} from 'react-router-dom'
const history = createHistory()
moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;
const yuangongUrl = '/yuangong/000106'
class YuangongForm extends Component {
    constructor () {
        super()
        this.state = {
            Birthday: '',
            currstate: '',  //在职状态
            dep_name: '', //所属部门
            duties_name: '', //当前岗位
            empcode: '', //工号
            empname: '', //员工姓名
            sex: '', //性别
            og_name: '', //在职机构
            position_name: '',//当前职位
            qqnumber: '',
            telnumber: '',
            wechatcode: '',
            id: '',
            duties_id: '',
            dep_id: '',
            og_id: '',
            position_id: '',
            ogList: [], //机构list
            dutiesList: [], //岗位list
            depList: [], //部门list
            positionList: [], //职位list
            parttime_oglist: ""
        }
    }
    componentDidMount () {
        const syscode = this.props.match.params.syscode
        const id = this.props.match.params.id
        const _this = this
        //获取在职机构
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
                    _this.setState({
                        Birthday: DataList.Birthday, 
                        currstate: DataList.currstate, 
                        dep_name:　DataList.dep_name,
                        duties_name: DataList.duties_name,
                        empcode: DataList.empcode,
                        empname: DataList.empname,
                        sex: DataList.sex,
                        og_name:　DataList.og_name,
                        position_name: DataList.position_name,
                        qqnumber: DataList.qqnumber,
                        telnumber: DataList.telnumber,
                        wechatcode: DataList.wechatcode,
                        id: DataList.id,
                        duties_id: DataList.duties_id,
                        dep_id: DataList.dep_id,
                        og_id: DataList.og_id,
                        position_id: DataList.position_id,
                        parttime_oglist: DataList.parttime_oglist
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
            const BirthdayDate = moment(values.Birthday).format('YYYY-MM-DD')
            const data = {
                Birthday: BirthdayDate
            }
            const dataList = Object.assign(values, data)
            if (id > 0) {
                axios.post(menuUrl, {req: '3',syscode: syscode, id: id, data: dataList})
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
                                history.push(yuangongUrl)
                            },
                        });
                        }
                    })
                    .catch(function (error) {
                    console.log(error);
                });
            } else {
                axios.post(menuUrl, {req: '2',syscode: syscode, data: dataList})
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
                                history.push(yuangongUrl)
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
    getAxiosList = (value) => {
        const syscode = this.props.match.params.syscode
        const _this = this
        //获取部门列表
        axios.post(menuUrl, {req:"6",syscode: syscode, datatype: "2",og_name: value})
            .then(function (response) {
                const errtext = response.data.errtext
                const result = response.data.result
                if (errtext) {
                    return null
                } else {
                    _this.setState({
                        depList: result
                    })
                }
            })
            .catch(function (error) {
            console.log(error);
        });
         //获取岗位列表
         axios.post(menuUrl, {req:"6",syscode: syscode, datatype: "3",og_name: value})
         .then(function (response) {
             const errtext = response.data.errtext
             const result = response.data.result
             if (errtext) {
                 return null
             } else {
                 _this.setState({
                    dutiesList: result
                 })
             }
         })
         .catch(function (error) {
         console.log(error);
        });
         //获取职位列表
         axios.post(menuUrl, {req:"6",syscode: syscode, datatype: "4",og_name: value})
         .then(function (response) {
             const errtext = response.data.errtext
             const result = response.data.result
             if (errtext) {
                 return null
             } else {
                 _this.setState({
                    positionList: result
                 })
             }
         })
         .catch(function (error) {
         console.log(error);
        });
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { Birthday,  currstate, dep_name, duties_name, empcode, empname, sex, og_name, position_name, qqnumber, telnumber, wechatcode,
            duties_id, dep_id, og_id, position_id, ogList, depList, dutiesList, positionList, parttime_oglist } = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 6, offset: 0},
                sm: { span: 6, offset: 0},
            },
            wrapperCol: {
                xs: { span: 12, offset: 0},
                sm: { span: 12, offset: 0},
            }
        };
        const Edit= this.props.match.params.isEdit === 0 ? false : true
        let parttimeArr
        if (parttime_oglist !== "") {
            parttimeArr = parttime_oglist.split(',')
        }
        const dateFormat = 'YYYY-MM-DD'
        const id = this.props.match.params.id
        return (
            <div>
                <div style={{padding: '15px 15px 6px 15px', background: '#fff', marginBottom: '15px'}}>
                    <Breadcrumb>
                        <Breadcrumb.Item ><Link to={yuangongUrl}>首页</Link></Breadcrumb.Item>
                        <Breadcrumb.Item style={{color: '#1890ff'}}>
                        {id > 0 ? "详细信息" : "新建员工信息"}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <h3 style={{lineHeight: '34px'}}>编辑员工信息</h3>
                </div>
                <Form onSubmit={this.handleSubmit} style={{backgroundColor: '#fff'}}  className="ant-advanced-search-form">
                    <Row gutter={24}> 
                        <Col span={12}>
                            <FormItem
                            {...formItemLayout}
                                label="工号"
                                >
                                {getFieldDecorator('empcode', {
                                    rules: [{
                                    required: true, message: '请您填写工号',
                                    }],
                                    initialValue: empcode
                                })(
                                    <Input disabled={!Edit}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="姓名"
                                >
                                {getFieldDecorator('empname', {
                                    rules: [{
                                    required: true, message: '请您填写姓名',
                                    }],
                                    initialValue: empname
                                })(
                                    <Input disabled={!Edit}/>
                                )}
                            </FormItem>
                        </Col>
                    {/* </Row>
                    <Row gutter={24}> */}
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="性别"
                                >
                                {getFieldDecorator('sex', {
                                    rules: [{
                                    required: true, message: '请您选择性别',
                                    }],
                                    initialValue: sex
                                })(
                                    <Select placeholder="选择性别" disabled={!Edit}>
                                        <Option value="男">男</Option>
                                        <Option value="女">女</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="出生日期"
                                >
                                {getFieldDecorator('BirthdayDate', {
                                    initialValue: id === "0" ? null : moment(Birthday, dateFormat)
                                })(
                                    <DatePicker placeholder="请选择时间" locale={locale} disabled={!Edit}/>
                                )}
                            </FormItem>
                        </Col>
                    {/* </Row>
                    <Row gutter={24}> */}
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="联系电话"
                                >
                                {getFieldDecorator('telnumber', {
                                    rules: [{
                                    required: true, message: '请您填写联系电话',
                                    }],
                                    initialValue: telnumber
                                })(
                                    <Input disabled={!Edit}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="QQ"
                                >
                                {getFieldDecorator('qqnumber', {
                                    initialValue: qqnumber
                                })(
                                    <Input disabled={!Edit}/>
                                )}
                            </FormItem>
                        </Col>
                    {/* </Row>
                    <Row gutter={24}> */}
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="微信"
                                >
                                {getFieldDecorator('wechatcode', {
                                initialValue: wechatcode
                                })(
                                    <Input disabled={!Edit}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="在岗状态"
                                >
                                {getFieldDecorator('currstate', {
                                    rules: [{
                                        required: true, message: '请您选择在岗状态',
                                    }],
                                    initialValue: currstate
                                })(
                                    <Select placeholder="请您选择在职状态" disabled={!Edit}>
                                        <Option value="临时">临时</Option>
                                        <Option value="在职">在职</Option>
                                        <Option value="离岗">离岗</Option>
                                        <Option value="离职">离职</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    {/* </Row>
                    <Row gutter={24}> */}
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="在职机构"
                                >
                                {getFieldDecorator('og_id', {
                                    rules: [{
                                    required: true, message: '请您选择在职机构',
                                    }],
                                    initialValue: id === "0" ? "" : og_name
                                })(
                                <Select placeholder="请您选择在职机构" disabled={!Edit} onChange={this.getAxiosList}>
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
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="所属部门"
                                >
                                {getFieldDecorator('dep_id', {
                                    rules: [{
                                        required: true, message: '请您选择所属部门',
                                    }],
                                    initialValue: id === "0" ? "" : dep_name
                                })(
                                    <Select placeholder="选择所属部门" disabled={!Edit}>
                                        {
                                            depList.length > 0
                                            ? depList.map ((Item, index) => {
                                                return (
                                                    <Option value={Item.depname} key={Item.dep_id}>{Item.depname}</Option>
                                                )
                                            })
                                            : null
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    {/* </Row>
                    <Row gutter={24}> */}
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="当前岗位"
                                >
                                {getFieldDecorator('duties_id', {
                                    rules: [{
                                    required: true, message: '请您选择当前岗位',
                                    }],
                                    initialValue: id === "0" ? "" : duties_name
                                })(
                                <Select placeholder="选择当前岗位" disabled={!Edit}>
                                    {
                                        dutiesList.length > 0
                                        ? dutiesList.map ((Item, index) => {
                                            return (
                                                <Option value={Item.dutiesname} key={Item.duties_id}>{Item.dutiesname}</Option>
                                            )
                                        })
                                        : null
                                    }
                                </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="当前职位"
                                >
                                {getFieldDecorator('position_id', {
                                    rules: [{
                                    required: true, message: '请您选择当前职位',
                                    }],
                                    initialValue: id === "0" ? "" : position_name
                                })(
                                    <Select placeholder="选择当前职位" disabled={!Edit}>
                                        {
                                            positionList.length > 0
                                            ? positionList.map ((Item, index) => {
                                                return (
                                                    <Option value={Item.positionname} key={Item.position_id}>{Item.positionname}</Option>
                                                )
                                            })
                                            : null
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem
                                labelCol={{
                                    xs: { span: 3, offset: 0},
                                    sm: { span: 3, offset: 0},
                                }}
                            
                                label="兼职机构"
                                >
                                {getFieldDecorator('parttime_oglist', {
                                    initialValue: parttimeArr
                                })(
                                <Select placeholder="请您选择在职机构" disabled={!Edit} mode="multiple" style={{ width: '100%' }}>
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
                        </Col>
                    </Row>
                    <FormItem   wrapperCol={{
                            xs: { span: 20, offset: 0 },
                            sm: { span: 8, offset: 8 },
                        }}>
                        <Button type="primary" htmlType="submit" disabled={!Edit}>保存</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
const YgForm = Form.create()(YuangongForm)
export default YgForm