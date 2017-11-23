// 历史项目
import dot from 'dot-prop'
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Row, Switch, Dropdown, Menu, Popconfirm, Icon, Button, Badge, Select, Modal } from 'antd';
import { ProjectManage } from '../../../actions';
import { authorize } from '../../../../application';
import Storage from '../../../../application/library/storage';
import Search from '../core/subSearch';
import Table from '../core/subTable';
import style from '../style.less';
//引入枚举值
import { DIRECT, ADD_NEW_PROJECT, DERECT_HISTORY_PROJECT_COLUMNS } from '../core/enumerate.js'
const {
  getHistoryProject,
  getSignSellerLists,
} = ProjectManage;

const FormItem = Form.Item;
const Option = Select.Option;


class HistoryProject extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.state = {
      dataSource: {
        _meta: [],
        data: [],
      },
    }
    this.private = {
      dispatch,
      columns: [],
      storage: new Storage('direct', { useSession: true }),
      vendor_id: authorize.auth.vendorId,
      city_code: dot.get(authorize.vendor, 'city.code'),
      state: -100,                                            //状态
      contract_type: 10,                                      //签约类型为直营
      page: 1,                                                //初始化请求page
      limit: 10,
      operateLink: '/business/project/direct/operate?from=history',        //操作入口路由
      menuTitle: [
        {
          name: '商家信息',
          tab: '1',
        },
        {
          name: '签约信息',
          tab: '2',
        },
      ],
    }
    // 获取项目列表请求
    this.renderProjectList = this.renderProjectList.bind(this);
    // 查询直营项目钩子函数
    this.searchHandle = this.searchHandle.bind(this);
    // 保存商户id、 签约id 至缓存 , 选择tabs 缓存tabs key, 给 操作入口文件使用
    this.saveSellerInfo = this.saveSellerInfo.bind(this);
  }

  componentWillMount() {
    const { menuTitle, operateLink } = this.private;

    const { renderProjectList, saveSellerInfo } = this;
    // 操作回调
    const operateCallback = record => (
      <span>
        {
          menuTitle.map((item, index) => {
            return (
              <Link
                key={index}
                onClick={() => saveSellerInfo(item.tab, record)}
                to={operateLink}
              >{item.name}&nbsp;&nbsp;</Link>
            )
          })
        }
      </span>
    );

    this.private.columns = DERECT_HISTORY_PROJECT_COLUMNS(operateCallback);

    renderProjectList({})
  }


  componentWillReceiveProps(nextProps) {
    const { ProjectManage } = nextProps;
    const {
            sellerList,
        } = ProjectManage;
    this.setState({
      dataSource: sellerList,
    })
  }

  //保存商户id、 签约id 至缓存 , 选择tabs 缓存tabs key, 给 操作入口文件使用
  saveSellerInfo(tab, record) {
    const { dispatch } = this.props;
    const { storage } = this.private;
    const data = {
      tab,
      seller_id: record.seller_id,
      contract_id: record.id,
      seller_name: record.seller.name,
      city_code: record.seller.city_code,
      seller_record: record,
    }
    storage.set(data)
  }


  // 获取项目列表请求
  renderProjectList(params) {
    const { dispatch, page, vendor_id, city_code, state, limit } = this.private;
    const { sellerNo, sellerName } = params;
    const listParams = {
      vendor_id: params.vendor_id || vendor_id,
      city_code: params.city_code || city_code,
      state: params.state || state,
      limit: params.limit || limit,
      page: params.page || page,
      seller_no: sellerNo,
      seller_name: sellerName,
    }
    dispatch({ type: getSignSellerLists, payload: listParams })
  }

  // 查询钩子函数
  searchHandle(params) {
    const { renderProjectList } = this;
    renderProjectList(params)
  }

  render() {
    const { columns, contract_type } = this.private;
    const { dataSource } = this.state;
    const { searchHandle, renderProjectList } = this;
    // 页码
    const pagination = {
      total: dataSource._meta.result_count || 0,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      onChange: (current) => {
        const page = current;
        const listParams = {
          page,
        }
        renderProjectList(listParams)
      },
    }
    const searchParams = {
      searchHandle,
    }
    const tableParams = {
      columns,
      dataSource,
      pagination,
    }
    return (
      <div className={`${style.component} con-body main-list`}>
        {/* 渲染条件筛选组件 */}
        <div className="bd-content">
          <Search {...searchParams} />
        </div>
        {/* 渲染table */}
        <div className="bd-content">
          <Table {...tableParams} />
        </div>
      </div>
    )
  }
}

function mapStateToProps({ ProjectManage }) {
  return { ProjectManage };
}

export default connect(mapStateToProps)(HistoryProject);
