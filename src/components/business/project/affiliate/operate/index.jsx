import React, { Component } from 'react';
import { connect } from 'dva';
import { hashHistory, Link } from 'dva/router';
import { Tabs, Modal } from 'antd';
import { ProjectManage } from '../../../../actions';
import Storage from '../../../../../application/library/storage';
import style from '../../style.less';
import SellerInfo from './sellerInfo';
import KnightRules from './knightRules';
//引入枚举值
import { AFFILIATE, PROJECT_COLUMNS } from '../../core/enumerate.js'
const warning = Modal.warning;

const {
  getProjectList,
} = ProjectManage;
const TabPane = Tabs.TabPane;


class AffiliateProject extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.state = {
      defaultActiveKey: '1',                       //初始化选中面板的 key, 如果没有设置 activeKey
    }
    this.private = {
      storage: new Storage('affiliate', { useSession: true }),              //缓存实例
      location: props.location,
      tabsTitle: [
        {
          title: '商家信息',
          key: '1',
          content: <SellerInfo />,
        },
        {
          title: '骑士分单规则',
          key: '2',
          content: <KnightRules />,
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
    const sellerId = storage.get('seller_id');
    const contractId = storage.get('contract_id');
    if (!sellerId || !contractId) {
      warning({
        title: '无法获取资源，点击跳转至项目管理页面',
        onOk() {
          hashHistory.push('/business/project/affiliate')
          console.log('OK');
        },
        maskClosable: false,
      });
    }
        // 根据缓存中的tab 来 选择显示对应的组件
    this.setState({
      defaultActiveKey: storage.get('tab') || this.state.defaultActiveKey,
    })
  }

  componentWillReceiveProps(nextProps) {

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
                      return <TabPane tab={item.title} key={item.key}>{ item.content }</TabPane>
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
          { renderComponent() }
        </div>
      </div>
    )
  }
}

function mapStateToProps({ ProjectManage }) {
  return { ProjectManage };
}
export default connect(mapStateToProps)(AffiliateProject);
