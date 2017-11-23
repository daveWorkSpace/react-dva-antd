import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Button, Input, Select } from 'antd';
import { Modules, ServiceState } from '../../../application/define';
import { BusinessStock } from '../../actions';
import { CoreContent, CoreSearch } from '../../core';

const CreatePath = Modules.getPath(Modules.businessStockCreate);
const DetailPath = Modules.getPath(Modules.businessStockDetail);
const EditPath = Modules.getPath(Modules.businessStockUpdate);

class IndexComponent extends React.Component {
  constructor(props) {
    super();
    //当前的访问路径
    const { pathname } = props.location
    //是否是直营模块
    const isDriectModule = Modules.equalPath(Modules.businessStockDriect, pathname);

    const { list } = props.BusinessStock;
    this.state = {
      list,
      isDriectModule,         //是否是直营模块
    }
    this.private = {
      dispatch: props.dispatch,
      search: {
        stockId: '',    //仓库id
        name: '',       //区域名称
        state: ServiceState.on, //区域状态
        isReset: false, //是否重置搜索
      },
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { isDriectModule } = this.state;
    const { list } = nextProps.BusinessStock;

    //当前的访问路径
    const { pathname } = nextProps.location
    //是否是直营模块
    const isDriect = Modules.equalPath(Modules.businessStockDriect, pathname);
    //是否重置搜索设置
    this.setState({
      isDriectModule: isDriect,
      list,
    })

    //是否重置搜索
    this.private.search.isReset = isDriectModule !== isDriect;
  }

  onChangeDriectList =(page, size) => {
    const { stockId, name, state } = this.private.search;
    this.private.dispatch({ type: BusinessStock.fetchDriectList, payload: { stockId, name, state, page, size } });
  }

  onChangeAffiliateList =(page, size) => {
    const { stockId, name, state } = this.private.search;
    this.private.dispatch({ type: BusinessStock.fetchAffiliateList, payload: { stockId, name, state, page, size } });
  }

  //查询
  onSearch = (params) => {
    const { isDriectModule } = this.state;
    const { stockId, name, state } = params;

    //保存搜索项目，提供给分页检索使用
    this.private.search.stockId = stockId;
    this.private.search.name = name;
    this.private.search.state = state;

    //判断是直营还是加盟，查询数据
    if (isDriectModule) {
      this.onChangeDriectList();
    } else {
      this.onChangeAffiliateList();
    }
  }

  //重置搜索查询
  onReset = () => {
    const { isDriectModule } = this.state;

    this.private.search = {
      stockId: '',    //仓库id
      name: '',       //区域名称
      state: ServiceState.on,      //区域状态
      isReset: false, //是否重置搜索
    }

    if (isDriectModule) {
      this.onChangeDriectList()
    } else {
      this.onChangeAffiliateList()
    }
  }

  //搜索功能
  renderSearch = () => {
    const { name, state, isReset } = this.private.search;
    const { isDriectModule } = this.state;

    const items = [
      {
        label: '仓库ID',
        form: form => (form.getFieldDecorator('stockId')(<Input placeholder="仓库ID" />)),
      },
      {
        label: '仓库名称',
        form: form => (form.getFieldDecorator('name', { initialValue: name })(<Input placeholder="仓库名称" />)),
      },
      {
        label: '仓库状态',
        form: form => (form.getFieldDecorator('state', { initialValue: `${state}` })(
          <Select>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value={`${ServiceState.on}`}>{ServiceState.description(ServiceState.on)}</Select.Option>
            <Select.Option value={`${ServiceState.off}`}>{ServiceState.description(ServiceState.off)}</Select.Option>
          </Select>,
        )),
      },
    ];
    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
    }

    //判断是否显示添加按钮
    if (isDriectModule === true) {
      props.operations = (
        <Button type="primary" onClick={() => { window.location.href = CreatePath }}>添加</Button>
      );
    }

    //重置表单
    if (isReset === true) {
      props.isReset = true;
    }

    return (
      <CoreContent>
        <CoreSearch {...props} />
      </CoreContent>
    )
  }

  //渲染直营列表
  renderDriectList = () => {
    const { onChangeDriectList } = this;
    const { list } = this.state;
    const columns = [{
      title: '仓库ID',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => {
        return (
          <span>
            <a href={`${DetailPath}?id=${record.id}`}>{record.id}</a>
          </span>
        )
      },
    }, {
      title: '仓库名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '承运商',
      dataIndex: 'supplyVendorName',
      key: 'supplyVendorName',
      render: (text, record) => {
        return text || '无';
      },
    }, {
      title: '库房存储能力',
      dataIndex: 'isInventory.name',
      key: 'isInventory.name',
    }, {
      title: '配送站能力',
      dataIndex: 'isDelivery.name',
      key: 'isDelivery.name',
    }, {
      title: '联系人',
      dataIndex: 'admin',
      key: 'admin',
    }, {
      title: '联系人电话',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '仓库地址',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => {
        return (<span>{record.address}{record.addressDetail}</span>)
      },
    }, {
      title: '状态',
      dataIndex: 'serviceState.name',
      key: 'serviceState.name',
    }, {
      title: '创建时间',
      dataIndex: 'createTime.name',
      key: 'createTime.name',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a href={`${EditPath}?id=${record.id}`}>编辑</a>
          </span>
        )
      },
    }];

    //列表的分页配置
    const pagination = {
      current: list.page,
      pageSize: list.size,
      total: list.total,
      size: 'small',
      showTotal: () => {
        return `共 ${list.total} 条`
      },
      onChange: onChangeDriectList,
    };

    return (
      <div className="bd-content">
        <div className="content">
          <Table rowKey="id" columns={columns} dataSource={list.data} pagination={pagination} />
        </div>
      </div>
    )
  }

  //渲染加盟列表
  renderAffiliateList = () => {
    const { onChangeAffiliateList } = this;
    const { list } = this.state;
    const columns = [{
      title: '仓库ID',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => {
        return (
          <span>
            <a href={`${DetailPath}?id=${record.id}`}>{record.id}</a>
          </span>
        )
      },
    }, {
      title: '仓库名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '总加盟商',
      dataIndex: 'vendorName',
      key: 'vendorName',
    }, {
      title: '库房存储能力',
      dataIndex: 'isInventory.name',
      key: 'isInventory.name',
    }, {
      title: '配送站能力',
      dataIndex: 'isDelivery.name',
      key: 'isDelivery.name',
    }, {
      title: '联系人',
      dataIndex: 'admin',
      key: 'admin',
    }, {
      title: '联系人电话',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '仓库地址',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '状态',
      dataIndex: 'serviceState.name',
      key: 'serviceState.name',
    }, {
      title: '创建时间',
      dataIndex: 'createTime.name',
      key: 'createTime.name',
    }];

    //列表的分页配置
    const pagination = {
      current: list.page,
      pageSize: list.size,
      total: list.total,
      size: 'small',
      showTotal: () => {
        return `共 ${list.total} 条`
      },
      onChange: onChangeAffiliateList,
    };

    return (
      <div className="bd-content">
        <div className="content">
          <Table rowKey="id" columns={columns} dataSource={list.data} pagination={pagination} />
        </div>
      </div>
    )
  }

  render() {
    const { isDriectModule } = this.state;
    const { renderSearch, renderDriectList, renderAffiliateList } = this;

    let list;
    if (isDriectModule) {
      list = renderDriectList();
    } else {
      list = renderAffiliateList();
    }

    return (
      <div className="con-body">
        {/* 渲染标题栏目 */}
        { renderSearch() }

        {/* 渲染列表 */}
        { list }
      </div>
    )
  }
}

function mapStateToProps({ BusinessStock }) {
  return { BusinessStock };
}

module.exports = connect(mapStateToProps)(IndexComponent);
