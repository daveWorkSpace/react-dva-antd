import React, { Component } from 'react';
import { connect } from 'dva';
import { hashHistory, Link } from 'dva/router';
import { Tabs, Modal } from 'antd';
import { ProjectManage } from '../../../../actions';
import Storage from '../../../../../application/library/storage';
import style from '../../style.less';
import SellerInfo from './sellerInfo';
import SignInfo from './signInfo';
import TransferStock from './transferStock';
import OrderRules from './orderRules';
import KnightRules from './knightRules';
import SopRules from './sopRules';
//引入枚举值
import { AFFILIATE, PROJECT_COLUMNS } from '../../core/enumerate';
const warning = Modal.warning;
const {
  getProjectList,
} = ProjectManage;
const TabPane = Tabs.TabPane;

class DirectOperate extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.state = {
      defaultActiveKey: '1',                       //初始化选中面板的 key, 如果没有设置 activeKey
    }
    this.private = {
      storage: new Storage('direct', { useSession: true }),              //缓存实例
      location: props.location,
      tabsTitle: [                                //操作入口信息
        {
          title: '商家信息',
          key: '1',
          content: <SellerInfo />,
        },
        {
          title: '签约信息',
          key: '2',
          content: <SignInfo />,
        },
        {
          title: '订单分单规则',
          key: '4',
          content: <OrderRules />,
        },
        {
          title: '骑士分单规则',
          key: '5',
          content: <KnightRules />,
        },
        {
          title: 'sop规则设置',
          key: '6',
          content: <SopRules />,
        },
      ],
    }
    // 渲染模块函数
    this.renderComponent = this.renderComponent.bind(this);
    // tabs 切换回调
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    const { storage, location } = this.private;
    console.log('location.query',location.query);
    const from = location.query.from;
    const tab = location.query.tab;
    const sellerId = storage.get('seller_id');
    const contractId = storage.get('contract_id');
    // 业务模式
    const bizMode = storage.get('biz_mode')

    if (!sellerId || !contractId) {
      warning({
        title: '无法获取资源，点击跳转至项目管理页面',
        onOk() {
          hashHistory.push('/business/project/direct')
          console.log('OK');
        },
        maskClosable: false,
      });
    }

    // 快递业务才有中转仓
    if (bizMode === 30) {
      const transferStock = {
        title: '中转仓配置',
        key: '3',
        content: <TransferStock />,
      };
      this.private.tabsTitle.splice(2, 0, transferStock)
    }

    // 从历史项目入口进来只有两个tab
    if (from === 'history') {
      const params = { location }
      this.private.tabsTitle = [
        {
          title: '商家信息',
          key: '1',
          content: <SellerInfo />,
        },
        {
          title: '签约信息',
          key: '2',
          content: <SignInfo {...params} />,
        },
      ]
    }

    // 根据缓存中的tab 来 选择显示对应的组件
    this.setState({
      defaultActiveKey: tab || storage.get('tab') || this.state.defaultActiveKey,
    })
  }

  componentWillReceiveProps(nextProps) {

  }

  // 签约商户查询接口
  getContractsSellers() {

  }

  // tab 切换回调
  onChange(values) {
    // 重新设置缓存， 防止用户点击其他tab刷新页面后对应组件错误
    const { storage } = this.private;
    const data = { tab: values }
    storage.set(data)
  }

  // 渲染对应组件
  renderComponent() {
    const { onChange } = this;
    const { defaultActiveKey } = this.state;
    const { tabsTitle } = this.private;
    return (
      <Tabs
        onChange={onChange}
        type="card"
        tabPosition="top"
        defaultActiveKey={defaultActiveKey}
      >
        {
          tabsTitle.map((item, index) => {
            return <TabPane tab={item.title} key={item.key}>{item.content}</TabPane>
          })
        }
      </Tabs>
    )
  }

  render() {
    const { renderComponent } = this;
    return (
      <div className={`${style.component} con-body main-list`}>
        {/* 渲染组件 */}
        <div className="bd-content">
          {renderComponent()}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ ProjectManage }) {
  return { ProjectManage };
}
export default connect(mapStateToProps)(DirectOperate);
