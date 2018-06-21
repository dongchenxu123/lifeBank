import React, { Component } from 'react';
import { Form, Input, Icon, Cascader, Button, Upload, message, Modal, Breadcrumb} from 'antd'
import axios from 'axios'
import { menuUrl, imgUrl } from '../help/url'
const FormItem = Form.Item;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
function beforeUpload(file) {
    console.log(file.type)
// const isJPG = file.type === 'image/jpeg';
// const isPNG = file.type === 'image/png';
// if (!isJPG || !isPNG) {
//   message.error('只能传jpeg或者png格式的图片!');
// }
const isLt2M = file.size / 1024 / 1024 < 2;
if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
}
return isLt2M;
}
  
class QiyeMessage extends Component {
    constructor () {
        super()
        this.state ={
            isEdit: true,
            address: '',
            loading: false,
            linkman: '',
            telnumber: '',
            qqnumber: '',
            wechatcode: '',
            email: '',
            logopath: '',
            cp_name: '',
            cpab_name: '',
            cityAdress: [],
            id: '',
            cityList: []
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const syscode = this.props.match.params.syscode
        const id = this.state.id
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const logopath = values.logo.file ? values.logo.file.response.result[0].address : values.logo
                const province = values.cityList && values.cityList.length > 0 ? values.cityList[0] : ''
                const city = values.cityList && values.cityList.length > 0 ? values.cityList[1] : ''
                const district = values.cityList && values.cityList.length > 0 ? values.cityList[2] : ''
                const data = {
                    logopath: logopath,
                    province: province,
                    city: city,
                    district: district
                }
                const dataList = Object.assign(values, data)
                axios.post(menuUrl, {req: '3',syscode: syscode, id: id, data: dataList})
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
                        Modal.success({
                            title: '微信提示',
                            content: '修改成功！',
                        });
                     }
                  })
                  .catch(function (error) {
                    console.log(error);
                });
            }
        });
    }
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => this.setState({
            imageUrl,
            loading: false,
            }));
        }
    }
    componentDidMount () {
        const syscode = this.props.match.params.syscode
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
        axios.post(menuUrl, {"req":"1","syscode": syscode})
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
                    isEdit: obj.isEdit,
                    address: DataList.address,
                    linkman:DataList.linkman,
                    telnumber: DataList.telnumber,
                    qqnumber: DataList.qqnumber,
                    wechatcode: DataList.wechatcode,
                    email: DataList.email,
                    logopath: DataList.logopath,
                    cp_name: DataList.cp_name,
                    cpab_name: DataList.cpab_name,
                    cityAdress:　cityAdress,
                    id: DataList.ID
                })
            }
        })
		.catch(function (error) {
			console.log(error);
		});
    }
    
    render () {
        const { getFieldDecorator } = this.props.form;
        const { isEdit, address, linkman, telnumber, qqnumber, wechatcode, email, logopath, cp_name, cpab_name, imageUrl, cityAdress, cityList  } = this.state
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
        };
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">上传图片</div>
            </div>
        );
        
        return (
            <div>
                <div style={{padding: '15px', background: '#fff', marginBottom: '15px'}}>
                    <Breadcrumb>
                        <Breadcrumb.Item>编辑企业信息</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Form onSubmit={this.handleSubmit} style={{backgroundColor: '#fff', padding: '20px 0'}}> 
                    <FormItem
                        {...formItemLayout}
                        label="企业名称"
                        >
                        {getFieldDecorator('cp_name', {
                            rules: [{
                            required: true, message: '请填写企业名称',
                            }],
                            initialValue: cp_name
                        })(
                            <Input disabled={!isEdit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="企业简称"
                        >
                        {getFieldDecorator('cpab_name', {
                            rules: [{
                            required: true, message: '请填写企业简称!',
                            }],
                            initialValue: cpab_name
                        })(
                            <Input disabled={!isEdit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="联系人"
                        >
                        {getFieldDecorator('linkman', {
                            initialValue: linkman
                        })(
                            <Input disabled={!isEdit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="联系电话"
                        >
                        {getFieldDecorator('telnumber', {
                            initialValue: telnumber
                        })(
                            <Input disabled={!isEdit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="QQ号"
                        >
                        {getFieldDecorator('qqnumber', {
                            initialValue: qqnumber
                        })(
                            <Input disabled={!isEdit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="微信号"
                        >
                        {getFieldDecorator('wechatcode', {
                            initialValue: wechatcode
                        })(
                            <Input style={{ width: '100%' }} disabled={!isEdit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="邮箱"
                        >
                        {getFieldDecorator('email', {
                            initialValue: email
                        })(
                            <Input style={{ width: '100%' }} disabled={!isEdit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="所在地区"
                        >
                            {getFieldDecorator('cityList', {
                                    initialValue: cityAdress,
                                    rules: [{ type: 'array'}],
                            })(
                                <Cascader options={cityList} disabled={!isEdit}/>
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="详细地址"
                        >
                        {getFieldDecorator('address', {
                            initialValue: address
                        })(
                            <Input disabled={!isEdit}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上传企业logo"
                        >
                        {getFieldDecorator('logo', {
                            initialValue: logopath
                        })(
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={imgUrl}
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}
                                disabled={!isEdit}
                            >
                            {imageUrl || logopath ? <img src={imageUrl ? imageUrl : logopath} alt="avatar" style={{width: 60, height: 60}}/> : uploadButton}
                        </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 16, offset: 8 },
                        }}
                        >
                        <Button type="primary" htmlType="submit" disabled={!isEdit}>保存</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
const Qiyeform = Form.create()(QiyeMessage);
export default Qiyeform