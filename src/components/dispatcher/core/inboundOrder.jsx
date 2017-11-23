/**
 * 分拨管理插入表格模块
 * 弹窗提示模块
 * 所有状态及函数均是父组件传递，由scanOrder.jsx传递过来。
 */

import React, { Component } from 'react';
import { Table, Button, message, Select } from 'antd';
import style from './style.less';

//引用通用枚举值
import {
  ARRIVE_DELIVERY,
  PULL_INBOUND,
  KNIGHT_DELIVERY,
  TRANSFER_OUTBOUND,
  SALES_INBOUND,
  SALES_OUTBOUND,
  ARRIVE_DELIVERY_COLUMNS,
  PULL_INBOUND_COLUMNS,
  KNIGHT_DELIVERY_COLUMNS,
  TRANSFER_OUTBOUND_COLUMNS,
  INBOUND_SCAN_COLUMNS,
  KNIGHT_DELIVERY_SCAN_COLUMNS,
  TRANSFER_OUTBOUND_SCAN_COLUMNS,
  SALES_INBOUND_SCAN_COLUMNS,
} from './enumerate'

const Option = Select.Option;

class InboundOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      selectedRowKeys: [],                //当前选中的表格订单列表key
      selectedRows: [],                   //当前选中的表格订单列表
    };

    this.private = {
      one: 1,                 //第一个表格
      two: 2,                 //第二个表格
      columns: [],
    };

    this.title = {
      firstButton: '',                //第一个 button 显示字样
      secondButton: '批量移除',        //第二个button 显示字样
      description: '',                //标题描述
      distributionInbound: '配送入站: 默认显示目的站【即订单所属配送站】是当前站的订单',
      transferInbound: '中转入站：默认显示目的站【即订单所属配送站】不是当前站的订单',
      fButtonWarning: mark => `批量${mark}前，请先选择订单`,
      removeWarning: '批量移除前，请先选择订单',
      fButtonSuccess: count => `成功入站${count}笔订单`,
      removeSuccess: count => `成功移除${count}笔订单`,

    }

    // 表格选择回调函数
    this.onSelectChange = this.onSelectChange.bind(this);
    // 第一个 button 点击 函数
    this.fButtonHandleClick = this.fButtonHandleClick.bind(this);
    // 第二个 button 点击 函数 -> 批量移除
    this.remove = this.remove.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource, clearState, resetClearState } = nextProps;
    if (clearState) {
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      }, () => {
        // 重置清空选项状态
        resetClearState()
      })
    }
    this.setState({ dataSource })
  }

  // 表格选择回调函数
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    console.log('selectedRows changed: ', selectedRows);
    this.setState({ selectedRowKeys, selectedRows });
  }

  // 第一个button点击
  fButtonHandleClick() {
    // 当前选中的 订单
    const { selectedRowKeys, selectedRows } = this.state;
    // 警告信息
    const { fButtonWarning } = this.title;
    const { fButton } = this.props;

    // 当没有选中项时弹出 warning
    if (selectedRowKeys.length === 0) {
      message.warning(fButtonWarning(fButton));
      return;
    }
    const stockOrderIds = [];
    for (let i = 0, j = selectedRows.length; i < j; i++) {
      stockOrderIds.push(selectedRows[i].id);
    }
    // 传给上层钩子函数处理
    this.props.fButtonHandle(stockOrderIds)
    // 删除后让selectedRowKeys 为空
    this.setState({
      // selectedRowKeys: []
    })
  }

  // 第二个button点击 -> 批量移除
  remove() {
    // 当前选中的 订单
    const { selectedRowKeys, selectedRows } = this.state;
    // 警告信息
    const { removeWarning } = this.title;

    console.log(selectedRowKeys)
    // 当没有选中项时弹出 warning
    if (selectedRowKeys.length === 0) {
      message.warning(removeWarning);
      return;
    }

    // 传给上层钩子函数处理，
    this.props.removeHandle(selectedRowKeys)
    // 删除后让selectedRowKeys 为空
    this.setState({
      // selectedRowKeys: []
    })
  }

  render() {
    const { selectedRowKeys } = this.state;
    // const { columns } = this.private;
    const { firstButton, secondButton, description } = this.title;
    const { onSelectChange, fButtonHandleClick, remove } = this;
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    const { dataSource, fButton, sButton, desc, columns } = this.props;
    return (
      <div className={style.orderList}>
        {
          desc && <div className="content-title">{desc}</div>
        }
        <div className={style.handleButton} >
          <Button type="primary" onClick={() => fButtonHandleClick()}>{fButton}</Button>
          {
            secondButton && <Button onClick={() => remove()}>{sButton}</Button>
          }
        </div>
        <Table
          bordered
          rowKey={(record, index) => { return index }}
          pagination={false}
          dataSource={dataSource}
          columns={columns}
          rowSelection={rowSelection}
        />
      </div>
    )
  }
}

export default InboundOrder;
