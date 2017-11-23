import dot from 'dot-prop';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Button, Tooltip, Icon, Tag, Input, Select } from 'antd';
import { BusinessAreaActions } from '../../../actions';
import { CoreForm, CoreContent, CoreSearch } from '../../../core';
import { ServiceState } from '../../../../application/define';

class IndexComponent extends React.Component {
  constructor(props) {
    super();
    const { rules } = props.BusinessArea;
    this.state = {
      rules,
    }
    this.private = {
      dispatch: props.dispatch,
      search: {
        areaId: '',             //区域id
        name: '',               //区域名称
        state: ServiceState.on, //区域状态
      },
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { rules } = nextProps.BusinessArea;
    this.setState({
      rules,
    })
  }

  //切换分页
  onChangePage = (page, size) => {
    const { areaId, name, state } = this.private.search;
    this.private.dispatch({ type: BusinessAreaActions.fetchAreaRules, payload: { areaId, name, state, page, size } });
  }

  //查询
  onSearch = (params) => {
    const { areaId, name, state } = params;

    //保存搜索项目，提供给分页检索使用
    this.private.search.areaId = areaId;
    this.private.search.name = name;
    this.private.search.state = state;

    this.onChangePage();
  }

  //重置搜索查询
  onReset = () => {
    this.private.search = {
      areaId: '',             //区域id
      name: '',               //区域名称
      state: ServiceState.on, //区域状态
    }

    this.onChangePage();
  }

  //搜索功能
  renderSearch = () => {
    const { name, state } = this.private.search;

    const items = [
      {
        label: '区域ID',
        form: form => (form.getFieldDecorator('areaId')(<Input placeholder="区域ID" />)),
      },
      {
        label: '区域名称',
        form: form => (form.getFieldDecorator('name')(<Input placeholder="区域名称" />)),
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
    }

    return (
      <CoreContent>
        <CoreSearch {...props} />
      </CoreContent>
    )
  }

  renderTags = (tags = []) => {
    const children = [];
    tags.forEach((tag, index, array) => {
      const key = `tagKey${tag}${index}${Math.random()}`
      children.push(<Tag key={key}>{tag}</Tag>)
    })
    return (
      <span>
        {children}
      </span>
    )
  }

  //渲染仓库规则列表
  renderList = () => {
    const { rules } = this.state;
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
      title: (
        <div>关联库房
          <Tooltip title="库房：即“有存储能力”的仓库" arrowPointAtCenter>
            <Icon type="question-circle-o" className="tooltip" />
          </Tooltip>
        </div>
      ),
      dataIndex: 'stocks',
      key: 'stocks',
      render: this.renderTags,
    }, {
      title: (
        <div>关联配送站
          <Tooltip title="配送站：即“有配送站能力”的仓库" arrowPointAtCenter>
            <Icon type="question-circle-o" className="tooltip" />
          </Tooltip>
        </div>
      ),
      dataIndex: 'stations',
      key: 'stations',
      render: this.renderTags,
    }];

        //列表的分页配置
    const pagination = {
      current: rules.page,
      pageSize: rules.size,
      total: rules.total,
      size: 'small',
      showTotal: () => {
        return `共 ${rules.total} 条`
      },
      onChange: this.onChangePage,
    };

    return (
      <div className="bd-content">
        <div className="content">
          <Table rowKey="id" columns={columns} dataSource={rules.data} pagination={pagination} />
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
function mapStateToProps({ BusinessArea }) {
  return { BusinessArea };
}

module.exports = connect(mapStateToProps)(IndexComponent);
