import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Pagination } from 'antd';
import Storage from '../../../../application/library/storage';
import style from '../style.less';
import { geography } from '../../../../application';
import { BusinessSupplierService } from '../../../actions';

import { SUPPLIER_PROJECT_COLUMNS } from '../core/enumerate';

const { getSupplierDetails } = BusinessSupplierService;

class SupplierProject extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch, BusinessSupplierService } = props;
    this.state = {
      // 列表分页请求数据
      pagination: {
        total: 0,
        current: 1,
        pageSize: 30,
      },
      //承运商详情
      supplierDetail: BusinessSupplierService.supplierDetail,
    }
    this.private = {
      dispatch,
      columns: [],
      emptyText: <p>当前无服务商家，<Link>点击进入项目管理进行项目配置（订单分单规则设置）</Link></p>,
      storage: new Storage('supplier', { useSession: true }),              //缓存实例
      itemLayout: { labelCol: { span: 5 }, wrapperCol: { span: 16 } },
    }
  }

  componentWillMount() {
       // 请求所有合作仓库
    const operateCallback = record => (
      <Link>操作</Link>
        )
    this.private.columns = SUPPLIER_PROJECT_COLUMNS(operateCallback)
  }

  componentWillReceiveProps(nextProps) {
    const { BusinessSupplierService } = nextProps;
    this.setState({
      supplierDetail: BusinessSupplierService.supplierDetail,
    })
  }


  render() {
    const { columns, emptyText } = this.private;
    const { pagination } = this.state;
    const locale = {
      emptyText,
    }
    return (
      <div className="bd-content">
        <Table locale={locale} rowKey={(record, index) => { return index }} columns={columns} dataSource={[]} pagination={false} />
        <Pagination className="ant-table-pagination" {...pagination} showTotal={total => `共 ${total} 条`} />
      </div>
    )
  }
}

function mapStateToProps({ BusinessSupplierService }) {
  return { BusinessSupplierService };
}

export default connect(mapStateToProps)(SupplierProject)
