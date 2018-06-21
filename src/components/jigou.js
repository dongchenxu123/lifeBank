import React, { Component } from 'react';
import { Input, Button, Icon, Table, Popconfirm, Divider, Spin, Modal } from 'antd';
import { menuUrl} from '../help/url'
import axios from 'axios'
import {
	Link
} from 'react-router-dom'
import '../style/search.css'

const style={
    spin: {
      textAlign: 'center',
      marginBottom: '20px',
      padding:'30px 50px',
      margin: '20px 0'
    }
}

class JigouView extends Component {
    constructor () {
        super()
        this.state = {
            DataList: [],
            // filterDropdownVisible: false,
            // searchText: '',
            filtered: false,
            loading: true,
            isEdit: false
        }
    }
    // onInputChange = (e) => {
    //     this.setState({ searchText: e.target.value });
    // }
    // onSearch = () => {
    //     const { searchText, DataList } = this.state;
    //     const reg = new RegExp(searchText, 'gi');
    //     this.setState({
    //       filterDropdownVisible: false,
    //       filtered: !!searchText,
    //       DataList: DataList.map((record) => {
    //         const match = record.ogname.match(reg);
    //         if (!match) {
    //           return null;
    //         }
    //         return {
    //           ...record,
    //           name: (
    //             <span>
    //               {record.ogname.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((text, i) => (
    //                 text.toLowerCase() === searchText.toLowerCase() ?
    //                   <span key={i} className="highlight">{text}</span> : text // eslint-disable-line
    //               ))}
    //             </span>
    //           ),
    //         };
    //       }).filter(record => !!record),
    //     });
    //   }
    componentDidMount () {
        const syscode = this.props.match.params.syscode
        const _this = this
        axios.post(menuUrl, {"req":"1","syscode": syscode})
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
                        isEdit: obj.isEdit,
                        loading: false
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
        });
    }
    renderTable (columns, DataList) {
       if (DataList.length > 0) {
            return (
                <Table columns={columns} dataSource={DataList} rowKey={record => record.ID} />
            )
        } else {
            return (
                <div style={style.spin}><Icon type="frown-o" />&nbsp;&nbsp;暂无数据</div>
            )
        }
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
        const {DataList, loading, isEdit} = this.state
        const syscode = this.props.match.params.syscode
        const Edit = isEdit === "false" ? 0 : 1
        const columns = [{
            title: '机构名称',
            dataIndex: 'ogname',
            key: 'ogname',
            // filterDropdown: (
            // <div className="custom-filter-dropdown">
            //     <Input
            //     ref={ele => this.searchInput = ele}
            //     placeholder="输入机构名称"
            //     value={this.state.searchText}
            //     onChange={this.onInputChange}
            //     onPressEnter={this.onSearch}
            //     />
            //     <Button type="primary" onClick={this.onSearch}>搜索</Button>
            // </div>
            // ),
            // // filterIcon: <Icon type="smile-o" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
            // filterDropdownVisible: this.state.filterDropdownVisible,
            // onFilterDropdownVisibleChange: (visible) => {
            // this.setState({
            //     filterDropdownVisible: visible,
            // }, () => this.searchInput && this.searchInput.focus());
            // }
          }, {
            title: '机构简称',
            dataIndex: 'ogabname',
            key: 'ogabname',
          }, {
            title: '机构电话',
            dataIndex: 'telnumber',
            key: 'telnumber',
          },{
            title: '负责人',
            dataIndex: 'linkman',
            key: 'linkman',
          },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <Link to={"/jigouForm/"+ syscode+'/'+ record.ID+'/'+Edit}>详细信息</Link>
                <Divider type="vertical" />
                <Popconfirm title="您确定删除吗？" okText="确定" cancelText="取消" onConfirm={this.confirm.bind(this, record.ID)}>
                    <span style={{cursor: 'pointer'}}>删除</span>
                </Popconfirm>
               </span>
            ),
        }];
        return (
            <div style={{backgroundColor: '#fff', padding: '15px'}}>
                <div style={{marginBottom:"15px"}}>
                    <Link to={"/jigouForm/"+ syscode+'/'+0+'/'+Edit}><Button type="primary" size='large'><Icon type="plus" />新建机构</Button></Link>
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

export default JigouView