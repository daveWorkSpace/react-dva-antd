// 加盟项目入口文件
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Switch, Dropdown, Menu, Popconfirm, Icon, Button } from 'antd';
import { ProjectManage } from '../../../actions';
import Storage from '../../../../application/library/storage';
import Search from '../core/search';
import Table from '../core/table';
import style from '../style.less';
//引入枚举值
import { AFFILIATE, AFFILIATE_PROJECT_COLUMNS } from '../core/enumerate.js'
const {
  getProjectList,
} = ProjectManage;

class AffiliateProject extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.state = {
      dataSource: {
        _meta: [],
        data: [],
      },
      page: 1,                                                //初始化请求page
    }
    this.private = {
      dispatch,
      storage: new Storage('affiliate', { useSession: true }),
      columns: [],
      contract_type: 20,                                      //签约类型为加盟
      operateLink: '/business/project/affiliate/operate',     //操作入口路由
      menuTitle: [
        {
          name: '商家信息',
          tab: '1',
        }, {
          name: '骑士分单规则',
          tab: '2',
        },
      ],
      limit: 10,
    }
        // 保存商户id、 签约id 至缓存 , 选择tabs 缓存tabs key, 给 操作入口文件使用
    this.saveSellerInfo = this.saveSellerInfo.bind(this);
        // 获取项目列表请求
    this.renderProjectList = this.renderProjectList.bind(this);
        // 查询加盟项目钩子函数
    this.searchHandle = this.searchHandle.bind(this);
  }

  componentWillMount() {
    const { contract_type, page, operateLink, menuTitle } = this.private;
    const { saveSellerInfo, renderProjectList } = this;
        // 商户号回调
    const sellerIdCallback = record => (
      <span>
        <Link to={{ pathname: '/operation/order/close/detail/', query: { orderId: record.id, shipmentId: record.shipment_id } }}>{record.seller_no}</Link>
      </span>
        );

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
                         >
                           { item.name }
                            &nbsp;&nbsp;
                         </Link>
                       )
                     })
                }
      </span>
        );

    this.private.columns = AFFILIATE_PROJECT_COLUMNS(sellerIdCallback, '', operateCallback);

    // 初始化请求，获取全部直营项目管理列表
    renderProjectList()
  }

  componentWillReceiveProps(nextProps) {
    const { ProjectManage } = nextProps;
    const {
            projectList,
        } = ProjectManage;
    this.setState({
      dataSource: projectList,
    })
  }

    // 获取项目列表请求
  renderProjectList() {
    const { dispatch, contract_type } = this.private;
    const { page } = this.state;
    const params = {
      contract_type,
      page,
    }
    dispatch({ type: getProjectList, payload: params })
  }

    //保存商户id、 签约id 至缓存 , 选择tabs 缓存tabs key, 给 操作入口文件使用
  saveSellerInfo(tab, record) {
    console.log(record)
    const { dispatch } = this.props;
    const { storage } = this.private;
    const data = {
      tab,
      seller_id: record.id,
      vendor_id: record.vendor_id,
      contract_id: record.contract_id,
      seller_name: record.name,
      city_code: record.city_code,
      seller_record: record,
    }
    storage.set(data)
  }


    // 查询直营项目钩子函数
  searchHandle(params) {
    const { renderProjectList } = this;
    renderProjectList()
  }

  render() {
    const { columns, contract_type, limit } = this.private;
    const { dataSource, page } = this.state;
    const { searchHandle, renderProjectList } = this;
        // 页码
    const pagination = {
      total: dataSource._meta.result_count || 0,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      current: page,
      pageSize: limit,
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      onChange: (current) => {
        this.setState({
          page: current,
        }, () => {
          // 初始化请求，获取全部加盟项目管理列表
          renderProjectList()
        })
      },
    }
    const searchParams = {
      searchHandle,
    }
    const tableParams = {
      columns,
      pagination,
      dataSource,
    }
    console.log(dataSource)
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
export default connect(mapStateToProps)(AffiliateProject);
