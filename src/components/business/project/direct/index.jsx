// 直营项目 入口文件
import dot from 'dot-prop'
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Switch, Dropdown, Menu, Popconfirm, Icon, Button, Badge, message } from 'antd';
import { ProjectManage, BusinessStock } from '../../../actions';
import Storage from '../../../../application/library/storage';
import { authorize } from '../../../../application';
import { BusinessMode } from '../../../../application/define';
import Search from '../core/search';
import Table from '../core/table';
import style from '../style.less';

//引入枚举值
import { DIRECT, DIRECT_PROJECT_COLUMNS } from '../core/enumerate'
const {
  getProjectList,
  getSignSellerLists,
} = ProjectManage;

const { unsignVendors, updataStateFunc } = BusinessStock;

class DirectProject extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.state = {
      dataSource: {
        _meta: [],
        data: [],
      },
      total: 0,     //申请合作项目总数
      page: 1,      //初始化请求page
    }
    this.private = {
      dispatch,
      vendor_id: authorize.auth.vendorId,
      city_code: dot.get(authorize.vendor, 'city.code'),
      state: 1,       //申请合作项目state
      limit: 10,
      storage: new Storage('direct', { useSession: true }),
      columns: [],
      contract_type: 10,                                      //签约类型为直营
      operateLink: '/business/project/direct/operate',        //操作入口路由
    }
    // 签约回调
    this.confirmHandle = this.confirmHandle.bind(this);
    // 获取项目列表请求
    this.renderProjectList = this.renderProjectList.bind(this);
    // 查询直营项目钩子函数
    this.searchHandle = this.searchHandle.bind(this);
    // 保存商户id、 签约id 至缓存 , 选择tabs 缓存tabs key, 给 操作入口文件使用
    this.saveSellerInfo = this.saveSellerInfo.bind(this);
    // 直营商家两个button
    this.renderButtons = this.renderButtons.bind(this);
  }

  getMenuTitleByBusinessMode = (businessMode) => {
    if (businessMode === BusinessMode.localCity) {
      return [{
        name: '签约信息',
        tab: '2',
      }, {
        name: '中转仓配置',
        tab: '3',
      }, {
        name: '订单分单规则',
        tab: '4',
      }, {
        name: '骑士分单规则',
        tab: '5',
      }, {
        name: 'sop规则设置',
        tab: '6',
      }];
    }
    return [
      {
        name: '签约信息',
        tab: '2',
      }, {
        name: '订单分单规则',
        tab: '4',
      }, {
        name: '骑士分单规则',
        tab: '5',
      }, {
        name: 'sop规则设置',
        tab: '6',
      }
    ];
  }

  componentWillMount() {
    const { dispatch, operateLink, vendor_id, city_code, state, page, limit } = this.private;
    const { confirmHandle, saveId, cancelHandle, renderProjectList, saveSellerInfo, getMenuTitleByBusinessMode } = this;
    const sellerIdCallback = (record) => {
      return (
        <span>
          <Link to={{ pathname: '/operation/order/close/detail/', query: { orderId: record.id, shipmentId: record.shipment_id } }}>{record.seller_no}</Link>
        </span>
      )
    }
    const signStatus = record => (
      <Popconfirm
        style={{ width: '200px!important' }}
        title={record.state == 100 ?
          '解约后将终止与该项目的合作关系，是否确认解约？' :
          '开启后将建立与该项目的合作关系，是否确认开启？'}
        onConfirm={() => confirmHandle(record.contract_id)}
        okText="确认" cancelText="取消"
      >
        <a href="#"><Switch
          checked={record.state == 100} checkedChildren={'签约'}
          unCheckedChildren={'解约'}
        /></a>
      </Popconfirm>
    );

    const operateCallback = record => (
      <span>
        <Link
          onClick={() => saveSellerInfo('1', record)}
          to={operateLink}
        >商家信息</Link>
        &nbsp;&nbsp;
        <Dropdown
          overlay={
            <Menu>
              {
                getMenuTitleByBusinessMode(record.biz_mode).map((item, index) => {
                  return (
                    <Menu.Item key={index}>
                      <Link onClick={() => saveSellerInfo(item.tab, record)} to={operateLink}>{item.name}</Link>
                    </Menu.Item>
                  )
                })
              }
            </Menu>
          } trigger={['click']}
        >
          <a className="ant-dropdown-link" href="#">
            更多<Icon type="down" />
          </a>
        </Dropdown>
      </span>
    )

    this.private.columns = DIRECT_PROJECT_COLUMNS(sellerIdCallback, signStatus, operateCallback);

    // 获取申请合作商家
    const listParams = {
      vendor_id,
      city_code,
      state,
      limit,
      page,
    }

    dispatch({ type: getSignSellerLists, payload: listParams })

    // 初始化请求，获取全部直营项目管理列表
    this.renderProjectList()
  }

  componentWillReceiveProps(nextProps) {
    const { ProjectManage, BusinessStock } = nextProps;
    const { dispatch } = this.private;
    const {
      projectList,
      sellerList,
    } = ProjectManage;
    this.setState({
      dataSource: projectList,
      total: sellerList._meta.result_count || 0,
    })
    if (BusinessStock.isStockRuleUpdateSuccess === true) {
      message.success('已解约')
      // 请求所有合作仓库
      this.renderProjectList()
      // 关闭更新状态开关
      dispatch({ type: updataStateFunc, payload: false })
    }
  }

  renderTableActions = (record) => {
    const children = []

    return children;
  }

  // 获取项目列表请求
  renderProjectList(params) {
    const { contract_type } = this.private;
    const { page } = this.state;
    const { dispatch } = this.private;
    const listParams = {
      contract_type,
      page,
      // TODO 检索添加添加（后台不支持）
      //seller_no: dot.get(params,'sellerNo',''),
      //seller_name: dot.get(params,'sellerName','')
    };
    dispatch({ type: getProjectList, payload: listParams })
  }

  // 解约约状态回调函数
  confirmHandle(contract_id) {
    const { dispatch } = this.private;
    const operator_id = authorize.account.id;
    const note = '解约';
    const params = {
      contract_id,
      operator_id,
      note,
    }
    dispatch({ type: unsignVendors, payload: { values: params } })
  }

  cancelHandle() {

  }

  //保存商户id、 签约id 至缓存 , 选择tabs 缓存tabs key, 给 操作入口文件使用
  saveSellerInfo(tab, record) {
    const { dispatch } = this.props;
    const { storage } = this.private;
    const data = {
      tab,
      seller_id: record.id,
      contract_id: record.contract_id,
      seller_name: record.name,
      biz_mode: record.biz_mode,      //业务模式
      city_code: record.city_code,
      seller_record: record,
    }
    storage.set(data)
  }

  // 查询直营项目钩子函数
  searchHandle(params) {
    const { renderProjectList } = this;
    console.log(params, 'params---');
    renderProjectList(params)
  }

  // 直营商家两个button
  renderButtons() {
    const { total } = this.state;
    return (
      <span>
        <Link to="/business/project/add"><Badge count={total} className="apply-cooperation-count"><Button type="normal" htmlType="submit">查看申请合作商家</Button></Badge></Link>
        <Link to={'/business/project/direct/history'}><Button className={style.cancelButton} >查看历史项目</Button></Link>
      </span>
    )
  }

  render() {
    const { columns, contract_type, limit } = this.private;
    const { page } = this.state;
    const { dataSource } = this.state;
    const { searchHandle, renderProjectList, renderButtons } = this;
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
          // 初始化请求，获取全部直营项目管理列表
          renderProjectList()
        })
      },
    }
    const searchParams = {
      renderButtons,
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

function mapStateToProps({ ProjectManage, BusinessStock }) {
  return { ProjectManage, BusinessStock };
}

export default connect(mapStateToProps)(DirectProject);
