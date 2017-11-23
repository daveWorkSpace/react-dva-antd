import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Table, Row, Col, Button, Tag, Select, Tooltip, Icon } from 'antd';
import { authorize } from '../../../application';
import { BusinessStock } from '../../actions';
import { CoreContent, CoreSearch } from '../../core';
import { ServiceState } from '../../../application/define';

const FormItem = Form.Item;
const { getStockListByUnity } = BusinessStock;

class IndexComponent extends Component {
  constructor(props) {
    super(props);
  // const { stocks } = props.BusinessSupplierService;
    const { dispatch, BusinessStock } = props;
    //仓库列表
    this.state = {
      stockListByUnity: BusinessStock.stockListByUnity,
    };
    this.private = {
      dispatch,
      vendorId: authorize.auth.vendorId,                  //服务商id
      cityCode: dot.get(authorize.vendor, 'city.code'),   //城市code
      page: 1,                                            //默认分页
      size: 10,                                           //默认分页数
      sort: '{"_id":-1}',                                 //排序
      itemLayout: { labelCol: { span: 4 }, wrapperCol: { span: 10 } },
      search: {
        stockId: '',    //仓库ID
        name: '',       //仓库名称
        state: ServiceState.on, //仓库状态
      },
    };
  // 查询
    this.onSearch = this.onSearch.bind(this);
  // 查询仓库列表
    this.renderStockList = this.renderStockList.bind(this);
  }

  componentWillMount() {
    this.renderStockList();
  }

  componentWillReceiveProps(nextProps) {
    const { BusinessStock } = nextProps;
    this.setState({
      stockListByUnity: BusinessStock.stockListByUnity,
    });
  }

// 查询仓库列表
  renderStockList() {
    const { dispatch, vendorId, cityCode, page, size, sort } = this.private;
    const { stockId, name, state } = this.private.search;
    const params = {
      vendorId,
      cityCode,
      page,
      size,
      sort,
      stockId,
      name,
      state,
    };
    dispatch({ type: getStockListByUnity, payload: params });
  }

//  查询
  onSearch = (values) => {
    const { dispatch, vendorId, cityCode, page, size, sort } = this.private;
    const { stockId, name, state } = values;

    const params = {
      vendorId,
      cityCode,
      page,
      size,
      sort,
      stockId,
      name,
      state,
    };
    dispatch({ type: getStockListByUnity, payload: params });
    //保存搜索项目，提供给分页检索使用
    this.private.search.stockId = stockId;
    this.private.search.name = name;
    this.private.search.state = state;
  };

  //重置搜索查询
  onReset = () => {
    this.private.search = {
      stockId: '',      //仓库ID
      name: '',         //仓库名称
      state: ServiceState.on, //仓库状态
    };
    //重新刷新列表
    this.renderStockList();
  };

  //搜索功能
  renderSearch = () => {
    const { stockId, name, state } = this.private.search;
    const items = [
      {
        label: '仓库ID',
        form: form => (form.getFieldDecorator('stockId', { initialValue: stockId })(<Input placeholder="请输入仓库ID" />)),
      },
      {
        label: '仓库名称',
        form: form => (form.getFieldDecorator('name', { initialValue: name })(<Input placeholder="请输入仓库名称" />)),
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
      operations: (
        <div>
          <Tooltip placement="topRight" title="备注：以下均为直营仓库">
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
    const { stockListByUnity } = this.state;
    const { page, size } = this.private;
  // 页码
    const pagination = {
      total: stockListByUnity._meta.result_count || 0,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      current: page,
      pageSize: size,
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      onChange: (current) => {
        this.private.page = current;
        this.renderStockList();
      },
    };

    const columns = [
      {
        title: '仓库ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '仓库名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '库房存储能力',
        dataIndex: 'is_inventory',
        key: 'is_inventory',
        render: (text, record) => {
          const content = text ? '有' : '无';
          return (
            <span>
              {content}
            </span>
          );
        },
      },
      {
        title: '配送站能力',
        dataIndex: 'is_dispatch',
        key: 'is_dispatch',
        render: (text, record) => {
          const content = text ? '有' : '无';
          return (
            <span>
              {content}
            </span>
          );
        },
      },
      {
        title: '仓库状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          const content = text === 100 ? '启用' : '禁用';
          return (
            <span>
              {content}
            </span>
          );
        },
      },
      {
        title: '合作承运商',
        dataIndex: 'supply_vendor_info.name',
        key: 'supply_vendor_info.name',
        render: (text, record) => {
          const content = text || '- -';
          return (
            <span>
              {content}
            </span>
          );
        },
      },
    ];
    return (
      <div className="bd-content">
        <div className="content">
          <Table
            rowKey={(record, index) => {
              return index;
            }}
            columns={columns}
            dataSource={stockListByUnity.data}
            pagination={pagination}
          />
        </div>
      </div>
    );
  };

  render() {
    const { renderSearch, renderList } = this;
    return (
      <div className="con-body">
        {/* 渲染标题 */}
        {renderSearch()}

        {/* 渲染列表 */}
        {renderList()}
      </div>
    );
  }
}

function mapStateToProps({ BusinessSupplierService, BusinessStock }) {
  return { BusinessSupplierService, BusinessStock };
}

module.exports = connect(mapStateToProps)(Form.create()(IndexComponent));
