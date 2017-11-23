import React, { Component } from 'react';
import { Form, Row, Col, Card, Tabs, Input, Button, Icon, Table, Select, Pagination, Popconfirm } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

//顶部配送站选择及到货列表组件
import Header from '../core/header';
//扫描组件
import ScanOrder from '../core/scanOrder';
//引入枚举值
import { SALES_OUTBOUND } from '../core/enumerate'

class SalesOutbound extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  }

  render() {
    const { dataSource } = this;
    const params = { type: SALES_OUTBOUND, dataSource }
    return (
      <div className="con-body main-list">
        {/* 顶部配送站搜索及到货列表 */}
        <Header {...params} />
        {/* 扫描订单 */}
        <ScanOrder {...params} />
      </div>
    )
  }
}

export default SalesOutbound;
