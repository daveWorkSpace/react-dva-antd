import React, { Component, PropTypes } from 'react';
import { Table } from 'antd';


class OrderTable extends Component {
  constructor(props) {
    super();
    this.state = {
    }
  }

  render() {
    const { columns, shipmentsList, pagination } = this.props;
    return (
      <div className="bd-content">
        <div className="content">
          <Table
            rowKey={(record, index) => { return index }}
            columns={columns}
            dataSource={shipmentsList.data}
            pagination={pagination}
          />
        </div>
      </div>
    )
  }
}

export default OrderTable;
