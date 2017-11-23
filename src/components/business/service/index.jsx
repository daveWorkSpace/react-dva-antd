import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Table, Icon, Row, Col, Button, Tooltip, Input, Select } from 'antd';

import { BusinessServiceActions } from '../../actions';
import { Modules, ServiceState } from '../../../application/define';
import { CoreContent, CoreSearch } from '../../core'

//产品设置编辑地址
const EditPath = Modules.getPath(Modules.businessServiceUpdate);
//产品设置创建地址
const CreatePath = Modules.getPath(Modules.businessServiceCreate);
//产品设置详情地址
const DetailPath = Modules.getPath(Modules.businessServiceDetail);

class IndexComponent extends React.Component {
  constructor(props) {
    super();
    const { BusinessService } = props
    this.state = {
      list: BusinessService.list,
    }
    this.private = {
      dispatch: props.dispatch,
    }
  }
  componentWillReceiveProps = (nextProps) => {
    const { BusinessService } = nextProps
    this.setState({
      list: BusinessService.list,
    });
  }

  onChangeServiceList =(page, size) => {
    this.private.dispatch({ type: BusinessServiceActions.fetchServiceList, payload: { page, size } });
  }

  onSearch = (params) => {
    const { serviceId, name, state } = params;
    this.private.dispatch({ type: BusinessServiceActions.fetchServiceList, payload: { serviceId, name, state } });
  }

  // 搜索功能
  renderSearch = () => {
    const items = [
      {
        label: '产品ID',
        form: form => (form.getFieldDecorator('serviceId', { rules: [{ len: 24, message: '请输入24位ID' }] })(<Input placeholder="请输入产品ID" />)),
      },
      {
        label: '产品名称',
        form: form => (form.getFieldDecorator('name')(<Input placeholder="请输入产品名称" />)),
      },
      {
        label: '状态',
        form: form => (form.getFieldDecorator('state', { initialValue: `${ServiceState.on}` })(
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
      onReset: this.onSearch,
      onSearch: this.onSearch,
      operations: (
        <div>
          <Button type="primary" onClick={() => { window.location.href = CreatePath }}>添加新产品</Button>
          <Tooltip placement="topRight" title="服务产品用于服务商与商家进行合作签约使用，为标准签约产品，签约后可在项目管理模块根据商家不同合作情况进行对应的调整">
            <Icon type="question-circle-o" className="tooltip" />
          </Tooltip>
        </div>
      ),
    }
    return (
      <CoreContent>
        <CoreSearch {...props} />
      </CoreContent>
    )
  }

  //渲染列表
  renderList = () => {
    const { onChangeServiceList } = this;
    const { list } = this.state;
    const columns = [{
      title: '产品ID',
      dataIndex: 'id',
      key: 'key',
      render: (text, record) => {
        return (
          <span>
            <a href={`${DetailPath}?id=${record.id}`}>{record.id}</a>
          </span>
        )
      },
    }, {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '业务模式',
      dataIndex: 'businessMode.name',
      key: 'businessMode.name',
    }, {
      title: '生效时间',
      dataIndex: 'updateTime.name',
      key: 'updateTime.name',
    }, {
      title: '创建时间',
      dataIndex: 'createTime.name',
      key: 'createTime.name',
    }, {
      title: '状态',
      dataIndex: 'serviceState.name',
      key: 'serviceState.name',
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
      onChange: onChangeServiceList,
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
    const { renderSearch, renderList } = this;
    return (
      <div className="con-body">
        {/* 渲染搜索 */}
        { renderSearch() }

        {/* 渲染列表 */}
        { renderList() }
      </div>
    )
  }
}
function mapStateToProps({ BusinessService }) {
  return { BusinessService };
}

module.exports = connect(mapStateToProps)(IndexComponent);
