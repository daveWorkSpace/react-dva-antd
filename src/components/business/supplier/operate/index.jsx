import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { hashHistory, Link } from 'dva/router';
import { Tabs, Button, Alert, Col, Switch, Popconfirm, Modal } from 'antd';
import Details from './details';
import Area from './area';
import Stock from './stock';
import Project from './project';
import { BusinessSupplierService } from '../../../actions';
import Storage from '../../../../application/library/storage';
import style from '../style.less';

const TabPane = Tabs.TabPane;
const { openBusinessE, closeBusinessE, modifyBusinessState, getSupplierDetails } = BusinessSupplierService;
const warning = Modal.warning;

class SupplierOperate extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch, BusinessSupplierService } = props;
    this.state = {
      //承运商详情
      supplierDetail: BusinessSupplierService.supplierDetail,
      defaultActiveKey: '1',                       //初始化选中面板的 key, 如果没有设置 activeKey
    }
    this.private = {
      dispatch,
      storage: new Storage('supplier', { useSession: true }),              //缓存实例
      location: props.location,
      tabsTitle: [
        {
          title: '承运商信息',
          key: '1',
          content: <Details />,
        },
        {
          title: '合作区域',
          key: '2',
          content: <Area />,
        },
        {
          title: '合作仓库',
          key: '3',
          content: <Stock />,
        },
                // {
                //     title: '服务项目',
                //     key: '4',
                //     content: <Project />,
                // },
      ],
    }
        // 渲染模块函数
    this.renderComponent = this.renderComponent.bind(this);
        // tabs 切换回调
    this.onChange = this.onChange.bind(this);
        // 确认业务切换
    this.confirm = this.confirm.bind(this);
        // 开启业务
    this.openBusiness = this.openBusiness.bind(this);
        // 关闭业务
    this.closeBusiness = this.closeBusiness.bind(this);
  }

  componentWillMount() {
    const { dispatch, storage, location } = this.private;
    const supplyVendorId = storage.get('supply_vendor_id');
    const orgNo = storage.get('org_no');
    if (!supplyVendorId || !orgNo) {
      warning({
        title: '无法获取资源，点击跳转至承运商列表页面',
        onOk() {
          hashHistory.push('/business/supplier/list')
          console.log('OK');
        },
        maskClosable: false,
      });
    }
    // 根据缓存中的tab 来 选择显示对应的组件
    this.setState({
      defaultActiveKey: storage.get('tab') || this.state.defaultActiveKey,
    })
    const biz_info_id = storage.get('biz_info_id');

        // 获取承运商信息
    const supplierParams = {
      biz_info_id,
    }
    dispatch({ type: getSupplierDetails, payload: supplierParams });
  }

  componentWillReceiveProps(nextProps) {
    const { BusinessSupplierService } = nextProps;
    this.setState({
      supplierDetail: BusinessSupplierService.supplierDetail,
    })
  }

    // tab 切换回调
  onChange(values) {
        // 重新设置缓存， 防止用户点击其他tab刷新页面后对应组件错误
    const { storage } = this.private;
    const data = { tab: values }
    storage.set(data)
  }

    // 确认业务切换
  confirm() {
    const { supplierDetail } = this.state;
    if (supplierDetail.business_state === -100) {
      this.openBusiness();
    } else {
      this.closeBusiness();
    }
  }

    // 关闭业务
  closeBusiness() {
    const { dispatch, storage } = this.private;
    const { supplierDetail } = this.state;
    const biz_info_id = storage.get('biz_info_id');
    supplierDetail.business_state = -100;
    const params = {
      biz_info_id,
    }
        // 关闭业务
    dispatch({ type: closeBusinessE, payload: params })

        // 更新业务
    dispatch({ type: modifyBusinessState, payload: supplierDetail });
  }

    // 开启业务
  openBusiness() {
    const { dispatch, storage } = this.private;
    const { supplierDetail } = this.state;
    const biz_info_id = storage.get('biz_info_id');
    supplierDetail.business_state = 100;
    const params = {
      biz_info_id,
    }
        // 开启业务
    dispatch({ type: openBusinessE, payload: { biz_info_id } })

        // 更新业务
    dispatch({ type: modifyBusinessState, payload: supplierDetail });
  }

    // 渲染对应组件
  renderComponent() {
    const { onChange } = this;
    const { defaultActiveKey, supplierDetail } = this.state;
    const { tabsTitle } = this.private;
    const operations = (
      <div>
        <div style={{ display: 'inline-flex' }}>{supplierDetail.business_state == 100 ?
          <Alert message="已开启业务" type="success" showIcon style={{ marginBottom: 0 }} /> :
          <Alert message="当前未开启业务" type="warning" showIcon />}&nbsp;&nbsp;
        </div>
        <div style={{ display: 'inline-flex' }}>
          <Popconfirm
            title={supplierDetail.business_state == 100 ? '你确定关闭这项业务吗?' : '你确定开启这项业务吗?'} onConfirm={this.confirm}
            okText="确定" cancelText="取消"
          >
            <a href="#"><Switch checked={supplierDetail.business_state == 100} checkedChildren={'开'} unCheckedChildren={'关'} /></a>
          </Popconfirm>
        </div>
      </div>
        );
    return (
      <Tabs
        tabBarExtraContent={operations}
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
      <div className={'con-body main-list'}>
        {/* 渲染组件 */}
        <div className="bd-content">
          { renderComponent() }
        </div>
      </div>
    )
  }
}

function mapStateToProps({ BusinessSupplierService }) {
  return { BusinessSupplierService };
}

export default connect(mapStateToProps)(SupplierOperate)
