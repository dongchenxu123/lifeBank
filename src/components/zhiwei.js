import React, { Component } from 'react';
import { Input, Button, Icon, Table, Popconfirm, Divider, Select, Spin, Modal } from 'antd';
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
    }
}


class ZhiweiView extends Component {
    constructor () {
        super()
        this.state = {
            DataList: [],
            loading: true,
            isEdit: false,
            ogList: [],
            og_ids: [],
            searchTxt: ''
        }
    }
    componentDidMount () {
        const syscode = this.props.match.params.syscode
        const _this = this
        const searchObj = {}
        this.getDataList(searchObj)
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
    }
    getDataList (searchObj) {
        const syscode = this.props.match.params.syscode
        const _this = this
        axios.post(menuUrl, {req:"1",syscode: syscode, searchObj: searchObj})
            .then(function (response) {
                const errtext = response.data.errtext
                const result = response.data.result
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
                        isEdit: obj.isEdit
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
        });
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
    handleChange = (value) => {
        this.setState({
            og_ids: value
        })
        const searchTxt = this.state.searchTxt
        const searchObj = {ogList: value, searchTxt: searchTxt}
        this.getDataList(searchObj)
    }
    handleSearch = (value) => {
        this.setState({
            searchTxt: value
        })
        const og_ids = this.state.og_ids
        const searchObj = {ogList: og_ids, searchTxt: value}
        this.getDataList(searchObj)
    }
    renderTable (columns, DataList) {
        if (DataList || DataList.length > 0) {
            return (
                <Table columns={columns} dataSource={DataList} rowKey={record => record.ID} />
            )
        } else {
            return (
                <div style={style.spin}><Icon type="frown-o" />&nbsp;&nbsp;暂无数据</div>
            )
        }
    }
    render () {
        const {loading, DataList, isEdit, ogList} = this.state
        const Edit = isEdit === "false" ? 0 : 1
        const syscode = this.props.match.params.syscode
        const columns = [{
            title: '所属机构',
            dataIndex: 'og_name',
            key: 'og_name',
          }, {
            title: '职位名称',
            dataIndex: 'positionname',
            key: 'positionname',
          }, {
            title: '职位类型',
            dataIndex: 'positiontype',
            key: 'positiontype',
          },{
            title: '职位级别',
            key: 'level',
            dataIndex: 'level'
          },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <Link to={"/zhiweiForm/"+syscode+'/'+record.ID+'/'+Edit}>详细信息</Link>
                <Divider type="vertical" />
                <Popconfirm title="您确定删除吗？" okText="确定" cancelText="取消" onConfirm={this.confirm.bind(this, record.ID)}>
                <span style={{cursor: 'pointer'}}>删除</span>
                </Popconfirm>
               </span>
            ),
        }];
        return (
            <div style={{backgroundColor: '#fff', padding: '15px'}}>
                <Select style={{ width: 400 }} onChange={this.handleChange} mode="multiple" placeholder="选择所属机构">
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
                <Search
                    onSearch={this.handleSearch}
                    enterButton
                    style={{ width: 300, margin:"0 0 15px 15px"}}
                    placeholder="职位名称"
                />
                <div style={{marginBottom:"15px"}}>
                    <Link to={"/zhiweiForm/"+syscode+'/'+0+'/'+Edit}><Button type="primary" size='large'><Icon type="plus" />新建职位</Button></Link>
                </div>
                {   
                    loading
                    ? <div style={style.spin}><Spin spinning={loading}/></div>
                    : this.renderTable(columns, DataList)
                }
            </div>
        )
    }
}

export default ZhiweiView