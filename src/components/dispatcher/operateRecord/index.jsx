import React, { Component } from 'react';
import { Form, Row, Col, Card, Tabs, Input, Button, Icon, Table, Select, Pagination, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
//引入枚举值
import { PULL_INBOUND } from '../core/enumerate.js'

class OperateRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  }

  render() {
    return (
      <div className="con-body main-list" />
    )
  }
}

export default OperateRecord;
