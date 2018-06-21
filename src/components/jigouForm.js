import React, { Component } from 'react';
import { Form, Input, Select, Button, Cascader,  Row, Col, Card, Avatar, Icon, Modal, Breadcrumb} from 'antd';
import axios from 'axios'
import { menuUrl, imgUrl} from '../help/url'
import {
	Link
} from 'react-router-dom'
import createHistory from 'history/createHashHistory';
const history = createHistory()
const { Meta } = Card;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const jigouUrl = '/jigou/000102'
/* id>0 编辑 */
class JigouForm extends Component {
    constructor () {
        super()
        this.state = {
            isEdit: true,
            address: '',
            cityAdress: '',
            linkman: '',
            ogabname: '',
            ogname: '',
            remark: '',
            telnumber: '',
            prowerList: [], //全部的授权列表
            cityList: [],
            visible: false,
            selectSyscodeList: [], //添加授权列表的id
            syscodelist: []  //已经添加过的授权列表
        }
    }
    componentDidMount () {
        const syscode = this.props.match.params.syscode
        const id = this.props.match.params.id
        const _this = this
        axios.post(menuUrl, { req:"9", syscode: syscode})
        .then(function (response) {
            const errtext = response.data.errtext
            const result = response.data.result
            if (errtext) {
                return null
            } else {
                _this.setState({
                    cityList: result
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        this.getSyscodeList([])
        if (id > 0) {
            axios.post(menuUrl, {req:"8", syscode: syscode, id: id})
                .then(function (response) {
                const errtext = response.data.errtext
                const result = response.data.result
                let obj = {}
                let DataList = {}
                if (errtext) {
                    Modal.error({
                        title: '错误提示',
                        content: errtext
                    });
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
                        isEdit: obj.isEdit,
                        address: DataList.address,
                        linkman: DataList.linkman,
                        telnumber: DataList.telnumber,
                        ogabname: DataList.ogabname,
                        ogname: DataList.ogname,
                        remark: DataList.remark,
                        syscodelist: DataList.syscodelist,
                        cityAdress:　cityAdress
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
        const syscodelist = this.state.syscodelist
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const province = values.cityList && values.cityList.length > 0 ? values.cityList[0] : ''
                const city = values.cityList && values.cityList.length > 0 ? values.cityList[1] : ''
                const district = values.cityList && values.cityList.length > 0 ? values.cityList[2] : ''
                const data = {
                    province: province,
                    city: city,
                    district: district,
                    syscodelist: syscodelist
                }
                const dataList = Object.assign(values, data)
                if (id > 0) {
                    //编辑接口
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
                                    history.push(jigouUrl)
                                },
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                } else {
                    //新增接口
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
                                    history.push(jigouUrl)
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
    getSyscodeList (syscodelist) {
        const _this = this
        const syscode = this.props.match.params.syscode
        axios.post(menuUrl, { req:"7", syscode: syscode, syscodelist: syscodelist})
        .then(function (response) {
            const errtext = response.data.errtext
            const result = response.data.result
            if (errtext) {
                Modal.error({
                    title: '错误提示',
                    content: errtext
                });
                return null
            } else { 
                _this.setState({
                    prowerList: result
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    showModal = () => {
        const syscodelist = this.state.syscodelist
        this.getSyscodeList(syscodelist)
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        const { prowerList, syscodelist, selectSyscodeList} = this.state
        // const newSelect = prowerList.concat(syscodelist)
        let newCreate = []
        for (var i=0; i<selectSyscodeList.length; i++) {
            for (var j=0; j<prowerList.length; j++) {
                if (selectSyscodeList[i] === prowerList[j].ID) {
                    newCreate.push(prowerList[j])
                }
            }
        }
        let selectCreate = newCreate.concat(syscodelist)
        this.setState({
          visible: false,
          syscodelist: selectCreate
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleChange = (value) => {
        console.log(value)
        this.setState({
            selectSyscodeList: value
        })
    }
    delItem (id) {
        console.log(id)
        const syscodelist = this.state.syscodelist
        let newList = []
        for (var i=0; i<syscodelist.length; i++) {
            if (syscodelist[i].ID !== id) {
                newList.push(syscodelist[i])
            }
        }
        this.setState({
            syscodelist: newList
        })
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { address, linkman, telnumber, ogabname, ogname, remark, cityAdress, prowerList, cityList, syscodelist } = this.state
        const infoImg = "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
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
                        <Breadcrumb.Item ><Link to={jigouUrl}>首页</Link></Breadcrumb.Item>
                        <Breadcrumb.Item style={{color: '#1890ff'}}>
                        {id > 0 ? "详细信息" : "新建机构信息"}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <h3 style={{lineHeight: '34px'}}>编辑机构信息</h3>
                </div>
                <Form onSubmit={this.handleSubmit} style={{backgroundColor: '#fff', padding: '20px 0'}}>
                    {/* <FormItem
                        {...formItemLayout}
                        label="机构编号"
                        >
                        {getFieldDecorator('jigou_num', {
                            rules: [
                            { required: true, message: '请您填写机构编号' },
                            ],
                        })(
                            <Input />
                        )}
                    </FormItem> */}
                    <FormItem
                        {...formItemLayout}
                        label="机构名称"
                        >
                        {getFieldDecorator('ogname', {
                            rules: [
                            { required: true, message: '请您填写机构名称' },
                            ],
                            initialValue: ogname
                        })(
                            <Input disabled={!Edit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="机构简称"
                        >
                        {getFieldDecorator('ogabname', {
                            rules: [
                            { required: true, message: '请您填写机构简称' },
                            ],
                            initialValue: ogabname
                        })(
                            <Input disabled={!Edit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="负责人"
                        >
                        {getFieldDecorator('linkman', {
                            initialValue: linkman
                        })(
                            <Input disabled={!Edit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="联系电话"
                        >
                        {getFieldDecorator('telnumber', {
                        initialValue: telnumber
                        })(
                            <Input disabled={!Edit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="机构地址"
                        >
                        <Row gutter={8}>
                            <Col span={14}>
                                {getFieldDecorator('cityList', {
                                    initialValue: cityAdress,
                                    rules: [{ type: 'array'}],
                                })(
                                    <Cascader options={cityList} disabled={!Edit} placeholder="选择省市区"/>
                                )}
                            </Col>
                            <Col span={10}>
                                {getFieldDecorator('address', {
                                    initialValue: address
                                })(
                                    <Input disabled={!Edit}/>
                                )}
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="机构描述"
                        >
                        {getFieldDecorator('remark', {
                            initialValue: remark
                        })(
                            <TextArea rows={4} disabled={!Edit}/>
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{ span: 16, offset: 7 }}
                        labelCol= {{span: 8 }}
                        label="授权列表"
                        >
                        <Row gutter={24}>
                            <Col span={6}>
                                <Card style={{height: '145px', textAlign: 'center', lineHeight: '145px'}}>
                                    <Icon type="plus" style={{fontSize: '60px', color:　'#1890ff'}} onClick={this.showModal}/>
                                </Card>
                            </Col>
                            {
                                syscodelist.map((item, index) => {
                                    return (
                                        <Col span={6} key={item.ID}>
                                            <Card style={{position: 'relative', marginBottom: '10px', height: '145px'}}>
                                                <Meta
                                                    avatar={<Avatar src={item.imgpath ? item.imgpath : infoImg} />}
                                                    title={item.sysname}
                                                    description={item.remark}
                                                />
                                                <Icon type="close-circle" style={{position: 'absolute', right: '5px', top: '5px', fontSize: '20px'}} onClick={this.delItem.bind(this, item.ID)}/>
                                            </Card>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                        <Modal
                            title="选择添加的系统"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            okText="保存"
                            cancelText="取消"
                            >
                                <Select placeholder="选择添加的系统" disabled={!Edit} mode="multiple" style={{ width: '100%' }} onChange={this.handleChange}>
                                    {
                                        prowerList.length > 0
                                        ? prowerList.map ((val, k) => {
                                            return (
                                                <Option value={val.ID} key={val.ID}>{val.sysname}</Option>
                                            )
                                        })
                                        : null
                                    }
                                </Select>
                        </Modal>
                    </FormItem>
                    <FormItem
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 16, offset: 8 },
                        }}
                        >
                        <Button type="primary" htmlType="submit" disabled={!Edit}>保存</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const jigou = Form.create()(JigouForm);
export default jigou