import React, { Component } from 'react';
import { Input, Button, Icon, Table, Popconfirm, Divider, Select, Spin, Modal, Pagination, Row, Col } from 'antd';
import {
	Link
} from 'react-router-dom'
import { menuUrl} from '../help/url'
import axios from 'axios'
const Search = Input.Search;
const Option = Select.Option;
const style={
    spin: {
      textAlign: 'center',
      marginBottom: '20px',
      padding:'30px 50px',
      margin: '20px 0'
    },
    inputStyle: {
        width: '100%',
        marginBottom: '10px'
    }
}
const count = 20
class YuangongView extends Component {
    constructor () {
        super()
        this.state = {
            DataList: [],
            filterDropdownVisible: false,
            searchText: '',
            filtered: false,
            loading: true,
            isEdit: false,
            total: 0,
            current: 1,
            expand: false,
            ogList: [],
            depList: [],
            positionList: [],
            dutiesList: [],
            og_ids: [],
            dep_ids: [],
            position_ids: [],
            duties_ids: [],
            searchTxt: ''
        }
    }
    
    componentDidMount () {
        const current = this.state.current
        const searchObj = {}
        this.getAxiosDatalist(current, count, searchObj)
        const syscode = this.props.match.params.syscode
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
        //获取部门列表
        axios.post(menuUrl, {req:"6",syscode: syscode, datatype: "2", og_name: ''})
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
         axios.post(menuUrl, {req:"6",syscode: syscode, datatype: "3", og_name: ''})
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
         axios.post(menuUrl, {req:"6",syscode: syscode, datatype: "4", og_name: ''})
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
    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }
    getAxiosDatalist (pageNum, count, searchObj) {
        const syscode = this.props.match.params.syscode
        const _this = this
        axios.post(menuUrl, {req: "1", syscode: syscode, count: count, pageNum: pageNum, searchObj: searchObj})
            .then(function (response) {
                const errtext = response.data.errtext
                const result = response.data.result
                const total = response.data.total
                let obj = {}
                if (errtext) {
                    return
                } 
                if (result.length > 0) {
                    for(var i=0; i<result.length; i++) {
                        obj= result[i]
                    }
                    _this.setState({
                        DataList: obj.DataList,
                        loading: false,
                        isEdit: obj.isEdit,
                        total: total
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
        });
    }
    renderTable (columns, DataList) {
        if (DataList || DataList.length > 0) {
            return (
                <Table columns={columns} dataSource={DataList} rowKey={record => record.ID} pagination={false}/>
            )
        } else {
            return (
                <div style={style.spin}><Icon type="frown-o" />&nbsp;&nbsp;暂无数据</div>
            )
        }
    }
    handleOgids = (value) => {
        this.setState({
            og_ids: value
        })
        
        const {dep_ids, duties_ids, position_ids, searchTxt, current} = this.state
        const searchObj = {ogList: value, positionList: position_ids, depList: dep_ids, dutiesList: duties_ids, searchTxt: searchTxt}
        this.getAxiosDatalist(current, count, searchObj)
    }
    handleDepids = (value) => {
        this.setState({
            dep_ids: value
        })
        
        const {og_ids, duties_ids, position_ids, searchTxt, current} = this.state
        const searchObj = {ogList: og_ids, positionList: position_ids, depList: value, dutiesList: duties_ids, searchTxt: searchTxt}
        this.getAxiosDatalist(current, count, searchObj)
    }
    handleDuties = (value) => {
        this.setState({
            duties_ids: value
        })
        const {og_ids, dep_ids, position_ids, searchTxt, current} = this.state
        const searchObj = {ogList: og_ids, positionList: position_ids, depList: dep_ids, dutiesList: value, searchTxt: searchTxt}
        this.getAxiosDatalist(current, count, searchObj)
    }
    handlePosition = (value) => {
        this.setState({
            position_ids: value
        })
        const {og_ids, dep_ids, duties_ids, searchTxt, current} = this.state
        const searchObj = {ogList: og_ids, positionList: value, depList: dep_ids, dutiesList: duties_ids, searchTxt: searchTxt}
        this.getAxiosDatalist(current, count, searchObj)
    }
    handleSearch = (value) => {
        this.setState({
            searchTxt: value
        })
        const {og_ids, dep_ids, duties_ids, position_ids, current} = this.state
        const searchObj = {ogList: og_ids, positionList: position_ids, depList: dep_ids, dutiesList: duties_ids, searchTxt: value}
        this.getAxiosDatalist(current, count, searchObj)
    }
    onChange = (page) => {
        const searchObj = {}
        this.setState({
          current: page,
        });
        this.getAxiosDatalist(page, count, searchObj)
      }
    confirm (id) {
        const syscode = this.props.match.params.syscode
        const DataList = this.state.DataList
        let newDataList = []
        const _this = this
        for(var i=0; i<DataList.length; i++) {
            if(DataList[i].ID !== id) {
                newDataList.push(DataList[i])
            }
        }
        axios.post(menuUrl, {req:"4", syscode: syscode, id: id})
            .then(function (response) {
                const errtext = response.data.errtext
                if (errtext) {
                    Modal.error({
                        title: '错误提示',
                        content: errtext
                    });
                    return
                } else {
                    Modal.success({
                        title: '微信提示',
                        content: '删除成功！',
                        onOk() {
                            _this.setState({
                                DataList: newDataList
                            })
                        },
                    });
                }
               
            })
            .catch(function (error) {
                console.log(error);
        });
    }
    render () {
        const {loading, DataList, isEdit, total, expand, ogList, depList, positionList, dutiesList} = this.state
        const Edit = isEdit === "false" ? 0 : 1
        const syscode = this.props.match.params.syscode
        const columns = [{
            title: '机构',
            dataIndex: 'og_name',
            key: 'og_name'
          }, {
            title: '部门',
            dataIndex: 'dep_name',
            key: 'dep_name',
          }, {
            title: '工号',
            dataIndex: 'empcode',
            key: 'empcode',
          }, {
            title: '姓名',
            dataIndex: 'empname',
            key: 'empname',
          }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
          }, {
            title: '岗位',
            dataIndex: 'duties_name',
            key: 'duties_name',
          },{
            title: '职位',
            dataIndex: 'position_name',
            key: 'position_name',
          },{
            title: '电话',
            dataIndex: 'telnumber',
            key: 'telnumber',
          },{
            title: 'QQ',
            dataIndex: 'qqnumber',
            key: 'qqnumber',
          },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <Link to={"/yuangongForm/" + syscode + '/' + record.ID+ '/' + Edit}>详细信息</Link>
                <Divider type="vertical" />
                <Popconfirm title="您确定删除吗？" okText="确定" cancelText="取消" onConfirm={this.confirm.bind(this, record.ID)}>
                <span style={{cursor: 'pointer'}}>删除</span>
                </Popconfirm>
               </span>
            ),
        }];
        return (
            <div style={{backgroundColor: '#fff', padding: '15px'}}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Select defaultValue="机构名称"  onChange={this.handleOgids} style={style.inputStyle}> 
                            {
                                ogList.length > 0
                                ? ogList.map ((Item, index) => {
                                    return (
                                        <Option value={Item.og_id} key={Item.og_id}>{Item.ogname}</Option>
                                    )
                                })
                                : null
                            }
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Select defaultValue="部门名称" onChange={this.handleDepids} style={style.inputStyle}>
                            {
                                depList.length > 0
                                ? depList.map ((Item, index) => {
                                    return (
                                        <Option value={Item.dep_id} key={Item.dep_id}>{Item.depname}</Option>
                                    )
                                })
                                : null
                            }
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Search
                            onSearch={this.handleSearch}
                            enterButton
                            style={style.inputStyle}
                            placeholder="工号/姓名/电话"
                        />
                    </Col>
                    </Row>
                    {
                        expand
                        ? <Row  gutter={16}>
                            <Col span={8}>
                            <Select defaultValue="岗位名称"  onChange={this.handleDuties} style={style.inputStyle}> 
                                {
                                    dutiesList.length > 0
                                    ? dutiesList.map ((Item, index) => {
                                        return (
                                            <Option value={Item.duties_id} key={Item.duties_id}>{Item.dutiesname}</Option>
                                        )
                                    })
                                    : null
                                }
                            </Select>
                            </Col>
                            <Col span={8}>
                                <Select defaultValue="职位名称" onChange={this.handlePosition} style={style.inputStyle}>
                                    {
                                        positionList.length > 0
                                        ? positionList.map ((Item, index) => {
                                            return (
                                                <Option value={Item.position_id} key={Item.position_id}>{Item.positionname}</Option>
                                            )
                                        })
                                        : null
                                    }
                                </Select>
                            </Col>
                        </Row>
                        : null
                }
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                       <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                        更多搜索 <Icon type={this.state.expand ? 'up' : 'down'} />
                        </a>
                    </Col>
                </Row>
                <div style={{marginBottom:"15px"}}>
                    <Link to={"/yuangongForm/" + syscode + '/' + 0 + '/' +Edit}><Button type="primary" size='large'><Icon type="plus" />新建员工</Button></Link>
                </div>
                {   
                    loading
                    ? <div style={style.spin}><Spin spinning={loading}/></div>
                    : this.renderTable(columns, DataList)
                }
                {
                    total > 0
                    ? <Pagination defaultCurrent={1} total={total} current={this.state.current} onChange={this.onChange} pageSize={count}
                                  style={{textAlign: 'right', marginTop: '10px'}}/>
                    : null
                }
            </div>
        )
    }
}

export default YuangongView