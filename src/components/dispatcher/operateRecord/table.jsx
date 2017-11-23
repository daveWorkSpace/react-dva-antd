import React, { Component } from 'react';
import { Table } from 'antd';

class OrderTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { columns, pagination, stockOrdersLog } = this.props;
    return (
      <div className="bd-content">
        <Table
          rowKey={(record, index) => { return index }}
          bordered
          dataSource={stockOrdersLog.data}
          pagination={pagination}
          columns={columns}
        />
      </div>
    )
  }
}

export default OrderTable;
