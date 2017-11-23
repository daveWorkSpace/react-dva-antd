import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Pagination } from 'antd';

class SupplierTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }


  render() {
    const { columns, supplierList, pagination } = this.props;
    return (
      <div className="bd-content">
        <div className="content">
          <Table rowKey={(record, index) => { return index }} columns={columns} dataSource={supplierList.data} pagination={pagination} />
        </div>
      </div>
    )
  }
}

function mapStateToProps({ BusinessSupplierService }) {
  return { BusinessSupplierService };
}

export default connect(mapStateToProps)(SupplierTable);
