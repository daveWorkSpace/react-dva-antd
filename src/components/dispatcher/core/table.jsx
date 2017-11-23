import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Table, Select, Pagination, Popconfirm, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;

import style from './style.less';

//日期时间选择器格式
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

//引用通用枚举值
import {
  KNIGHT_AFFIRM_ORDER,
  EXCEPTION_ORDER,
  DISTRIBUTION_ORDER,
  TRANSFER_ORDER,
  KNIGHT_AFFIRM_ORDER_COLUMNS,
  EXCEPTION_ORDER_COLUMNS,
  DISTRIBUTION_ORDER_COLUMNS,
  TRANSFER_ORDER_COLUMNS,
} from './enumerate';

class OrderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [], //当前选中的表格订单列表key
      selectedRows: [], //当前选中的表格订单列表
    };

    this.private = {
      columns: [],
    };
    // 表格选择回调函数
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { updateState } = nextProps
    // 清空选中项
    updateState && this.setState({
      selectedRowKeys: [],
    });
  }


  // 表格选择回调函数
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    console.log('selectedRows changed: ', selectedRows);
    this.setState({ selectedRowKeys, selectedRows }, () => {
      this.props.selectOrderByBatch(selectedRows)
    });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { onSelectChange } = this;
    const { stockOrdersList, columns, pagination, type } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.state === -100,    // Column configuration not to be checked
      }),
    };
    if (type === DISTRIBUTION_ORDER) {
      rowSelection.getCheckboxProps = record => ({
        disabled: record.state === -100 || record.state === 100 || record.state === 50,    // Column configuration not to be checked
      })
    }
    return (
      <div className="bd-content">
        <Table
          rowKey={(record, index) => {
            return index;
          }}
          bordered
          dataSource={stockOrdersList.data}
          columns={columns}
          pagination={pagination}
          rowSelection={type !== KNIGHT_AFFIRM_ORDER ? rowSelection : {}}
        />
      </div>
    );
  }
}

export default OrderTable;
