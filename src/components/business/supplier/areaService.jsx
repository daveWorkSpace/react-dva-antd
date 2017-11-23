import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Table, Row, Col, Button, Tag, Tooltip, Icon, Select } from 'antd';
import { authorize } from '../../../application';
import { BusinessType, ServiceState } from '../../../application/define';
import { BusinessSupplierService } from '../../actions';
import { CoreContent, CoreSearch } from '../../core';

const FormItem = Form.Item;
const { fetchAreaListBySupplier } = BusinessSupplierService;

class IndexComponent extends React.Component {
  constructor(props) {
    super(props);
    const { areas } = props.BusinessSupplierService;
    const { dispatch } = props;
    this.state = {
      areas,
    }
    this.private = {
      dispatch,
      itemLayout: { labelCol: { span: 4 }, wrapperCol: { span: 10 } },
      search: {       //搜索的条件
        name: '',     //区域名称
        areaId: '',   //区域ID
        state: ServiceState.on,    //区域状态
      },
    }
  }

  componentWillMount() {
    this.onChangeAreaList(1, 10)
  }

  componentWillReceiveProps(nextProps) {
    const { BusinessSupplierService } = nextProps;
    this.setState({
      areas: BusinessSupplierService.areas,
    })
  }

  // 查询区域列表
  onChangeAreaList = (page = 1, size = 10) => {
    const { areaId, name, state } = this.private.search;
    const vendorId = authorize.auth.vendorId;
    const cityCode = dot.get(authorize.vendor, 'city.code');
    const businessType = BusinessType.driect;
    this.private.dispatch({ type: fetchAreaListBySupplier, payload: { vendorId, cityCode, businessType, areaId, name, state, page, size } })
  }

  //查询
  onSearch = (params) => {
    const { areaId, name, state } = params;
    const vendorId = authorize.auth.vendorId;
    const cityCode = dot.get(authorize.vendor, 'city.code');
    const businessType = BusinessType.driect;
    this.private.dispatch({ type: fetchAreaListBySupplier, payload: { vendorId, cityCode, businessType, areaId, name, state } });

    //保存搜索项目，提供给分页检索使用
    this.private.search.name = name;
    this.private.search.state = state;
    this.private.search.areaId = areaId;
  };

  //重置搜索查询
  onReset = () => {
    this.private.search = {
      name: '',     //区域名称
      state: ServiceState.on,    //区域状态
      areaId: '',   //区域ID
    };
    this.onChangeAreaList();
  };

  //搜索功能
  renderSearch = () => {
    const { areaId, name, state } = this.private.search;
    const items = [
      {
        label: '区域ID',
        form: form => (form.getFieldDecorator('areaId', { initialValue: areaId })(<Input placeholder="请输入区域ID" />)),
      },
      {
        label: '区域名称',
        form: form => (form.getFieldDecorator('name', { initialValue: name })(<Input placeholder="请输入区域名称" />)),
      },
      {
        label: '区域状态',
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
      operations: (
        <div>
          <Tooltip placement="topRight" title="备注：以下均为直营区域">
            <Icon type="question-circle-o" className="tooltip" />
          </Tooltip>
        </div>
      ),
    };
    return (
      <CoreContent>
        <CoreSearch {...props} />
      </CoreContent>
    )
  };


  renderList = () => {
    const { areas } = this.state;

    //页码
    const pagination = {
      total: areas.total,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      current: areas.page,
      pageSize: areas.size,
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      onChange: (currentPage) => {
        this.onChangeAreaList(currentPage);
      },
    };

    //渲染承运商数据
    const renderSupplierTags = (suppliers, areaInfo) => {
      const children = [];
      if (suppliers !== undefined) {
        suppliers.forEach((supplier, index, array) => {
          const key = `tagKey${supplier.id}${supplier.name}${areaInfo.id}`
          children.push(
            <Tag key={key}>{supplier.name}</Tag>,
          )
        })
      }
      return (
        <span>
          {children}
        </span>
      )
    }

    const columns = [{
      title: '区域ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '区域名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '区域状态',
      dataIndex: 'serviceState.name',
      key: 'serviceState.name',
    }, {
      title: '合作承运商',
      dataIndex: 'supplier',
      key: 'supplier',
      render: renderSupplierTags,
    }];
    return (
      <div className="bd-content">
        <div className="content">
          <Table rowKey={(record, index) => { return index }} columns={columns} dataSource={areas.data} pagination={pagination} />
        </div>
      </div>
    )
  }

  render() {
    const { renderSearch, renderList } = this;
    return (
      <div className="con-body">
        {/* 渲染搜索 */}
        {renderSearch()}

        {/* 渲染列表 */}
        {renderList()}
      </div>
    )
  }
}

function mapStateToProps({ BusinessSupplierService }) {
  return { BusinessSupplierService };
}

module.exports = connect(mapStateToProps)(Form.create()(IndexComponent))
