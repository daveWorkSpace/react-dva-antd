import React, { Component, PropTypes } from 'react';
import { Table, Pagination } from 'antd';

class AreaTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }

    this.private = {
    }
  }

  render() {
    const { columns, areaList, pagination } = this.props;
    return (
      <Table rowKey={(record, index) => { return index }} columns={columns} dataSource={areaList.data} pagination={pagination} />
    );
  }
}

export default AreaTable;
