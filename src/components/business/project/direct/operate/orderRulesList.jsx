import React, { Component, PropTypes } from 'react';
import { Table } from 'antd';
import { authorize } from '../../../../../application';

class OrderRulesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
    }
  }

  // 接受父级的数据
  componentWillReceiveProps = (nextProps) => {
  };

  render() {
    const { columns, activeAreaName, orderRuleListDetail } = this.props;
    return (
      <Table rowKey={(record, index) => { return index }} columns={columns} dataSource={activeAreaName ? orderRuleListDetail : []} pagination={this.state.pagination} />
    )
  }
}
export default OrderRulesList
