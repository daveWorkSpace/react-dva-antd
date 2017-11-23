import React, { Component } from 'react';
import { Form, Row, Col, Card, Tabs, Input, Button, Icon, Table, Select, Pagination, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
//顶部搜索组件
import Search from '../core/search';
//扫描组件
// import ScanOrder from '../core/scanOrder';

import style from './style.less';

class TransferOrder extends Component{
  constructor(props){
    super(props)
    this.state = {};
  }

  render() {
    return (
      <div className="con-body main-list">
        {/* 顶部搜索组件 */}
        <Search />
      </div>
    )
  }
}

export default TransferOrder;
