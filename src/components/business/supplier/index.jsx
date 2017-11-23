import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Dropdown, Menu, Icon, Button } from 'antd';
import Search from './search';
import Table from './table';
import { BusinessSupplierService } from '../../actions';
import Storage from '../../../application/library/storage';
import { authorize } from '../../../application';
import { SUPPLIER_LIST_COLUMNS } from './core/enumerate';
const { getSupplierLists } = BusinessSupplierService;

class IndexComponent extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.state = {
      // 列表分页请求数据
      supplierList: {
        _meta: [],
        data: [],
      },
    };
    this.private = {
      dispatch,
      storage: new Storage('supplier', { useSession: true }),     //承运商缓存实例
      limit: 10,            //分页
      page: 1,                //分页
      vendor_id: authorize.auth.vendorId,           //服务商id
      city_code: dot.get(authorize.vendor, 'city.code'),
      columns: [],
      operateLink: '/business/supplier/operate',            //入口链接
      menuTitle: [                                          //操作菜单项
        {
          name: '合作仓库',
          tab: '3',
        },
        // {
        //     name: '服务项目',
        //     tab: '4',
        // },
      ],
    };
    // 查询承运商列表
    //this.searchHandle = this.searchHandle.bind(this);
    // 获得承运商列表请求
    this.renderSupplierList = this.renderSupplierList.bind(this);
    // 保存承运商信息 至缓存 , 选择tabs 缓存tabs key, 给 操作入口文件使用
    this.saveSupplierInfo = this.saveSupplierInfo.bind(this);
  }

  componentWillMount() {
    const { dispatch, limit, vendor_id, city_code, page, operateLink, menuTitle } = this.private;
    const { renderSupplierList, saveSupplierInfo } = this;
    const operateCallback = record =>
      <span>
        <Link onClick={() => saveSupplierInfo('1', record)} to={operateLink}>
          承运商信息
        </Link>
        &nbsp;&nbsp;
        <Link onClick={() => saveSupplierInfo('2', record)} to={operateLink}>
          合作区域
        </Link>
        &nbsp;&nbsp;
        <Dropdown
          overlay={
            <Menu>
              {menuTitle.map((item, index) => {
                return (
                  <Menu.Item key={index}>
                    <Link onClick={() => saveSupplierInfo(item.tab, record)} to={operateLink}>
                      {item.name}
                    </Link>
                  </Menu.Item>
                );
              })}
            </Menu>
          }
          trigger={['click']}
        >
          <a className="ant-dropdown-link" href="#">
            更多<Icon type="down" />
          </a>
        </Dropdown>
      </span>;
    this.private.columns = SUPPLIER_LIST_COLUMNS(operateCallback);

    // 获取承运商列表
    renderSupplierList();
  }

  componentWillReceiveProps = (nextProps) => {
    const { supplierList } = nextProps.BusinessSupplierService;
    this.setState({
      supplierList,
    });
  };

  // 获取承运商列表请求
  renderSupplierList(values) {
    const { dispatch, limit, vendor_id, city_code, page } = this.private;
    const params = {
      vendor_id,
      city_code,
      page,
      limit,
      supply_vendor_id: dot.get(values, 'supplyVendorId', ''),
    };
    dispatch({ type: getSupplierLists, payload: params });
  }

  // 查询承运商列表
  // searchHandle(values) {
  //   console.log(values, 'index---');
  //   const { supplyVendorId } = values;
  //   this.private.supplyVendorId = supplyVendorId;
  //   //刷新列表
  //   this.renderSupplierList(supplyVendorId);
  // }

  //保存承运商信息 至缓存 , 选择tabs 缓存tabs key, 给 操作入口文件使用
  saveSupplierInfo(tab, record) {
    console.log(record);
    const { dispatch } = this.props;
    const { storage } = this.private;
    const data = {
      tab,
      // 商户号
      org_no: record.supply_vendor.org_no,
      // 承运商信息请求参数
      biz_info_id: record.id,
      // 承运商名称
      supplier_name: record.name,
      // 承运商id
      supply_vendor_id: record.supply_vendor_id,
      // 承运商单条列表
      supplier_record: record,
    };
    storage.set(data);
  }

  render() {
    const { searchHandle, renderSupplierList } = this;
    const { supplierList } = this.state;
    const { columns, page, limit } = this.private;
    // 页码
    const pagination = {
      total: supplierList._meta.result_count || 0,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      current: page,
      pageSize: limit,
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      onChange: (current) => {
        this.private.page = current;
        renderSupplierList();
      },
    };
    // 搜索组件传参
    const searchProps = {
      searchHandle,
      renderSupplierList,
    };
    // 列表组件传参
    const tableProps = {
      columns,
      supplierList,
      pagination,
    };
    return (
      <div className="con-body main-list">
        {/*搜索组件*/}
        <Search {...searchProps} />
        {/*列表组件*/}
        <Table {...tableProps} />
      </div>
    );
  }
}

function mapStateToProps({ BusinessSupplierService }) {
  return { BusinessSupplierService };
}

export default connect(mapStateToProps)(IndexComponent);
