import dot from 'dot-prop'
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Radio, Breadcrumb, Alert, Icon, Popover, Modal, Select } from 'antd';
import Search from '../../common/search';
import Table from '../core/exception/table';
import { OrderListState, OrderParams } from '../core/exports';
import { OperationOrder } from '../core/ActionName';
import { authorize } from '../../../application';
import { OrderManage } from '../../actions';
import { utcToDate } from '../../../utils/newUtils';
import { AFFILIATE } from '../core/enumerate.js'
import style from './style.less';

const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;

//引入枚举值
const moment = require('moment');

const FormItem = Form.Item;
const Option = Select.Option;

const {
  getVendorOrderList,
  closeSingleVendorOrder,
  updateStateFunc,
} = OrderManage;


class ExceptionAffiliateOrder extends Component {
  constructor(props) {
    super();
    const { dispatch, OrderManage } = props;
    //初始化状态
    this.state = {
      orderId: '',            //订单id
      visible: false,
      page: 1,        //初始化分页
      vendorOrderList: OrderManage.vendorOrderList,           //服务商订单列表                            //异常订单列表
    };

    //私有变量属性－－－不要把方法直接挂在this上，固定不变的属性放在 private中
    this.private = {
      dispatch,
      vendorId: authorize.auth.vendorId,                           //供应商id（服务商）
      cityCode: dot.get(authorize.vendor, 'city.code'),
      operatorId: authorize.account.id,                        //操作人ID
      today: moment().format().replace(rgReg, '').substring(0, 8),
      relateType: 20,           //加盟
      limit: 10,
      itemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 16 },
      },
      search: {
        startDate: '20160101',
        endDate: moment().format('YYYYMMDD'),
        contractType: '',                   //签约类型：直营 or 加盟
        orgOrderId: '',
        sellerId: '',
      }
    };
    // 获取服务商订单列表
    this.renderVendorOrderList = this.renderVendorOrderList.bind(this);
    // 取消订单
    this.renderVendorOrderClose = this.renderVendorOrderClose.bind(this);
    // 取消订单面板
    this.renderCancelOrderPanel = this.renderCancelOrderPanel.bind(this)
    // 取消订单回调函数
    this.orderOperateCallback = this.orderOperateCallback.bind(this)
    // 显示操作提示面板
    this.showOrHideNoticePanel = this.showOrHideNoticePanel.bind(this)
  }


  componentWillMount() {
    // 获取服务商订单列表
    this.renderVendorOrderList()
  }
  componentWillReceiveProps(nextProps, nextState) {
    const { dispatch } = this.private;
    const { OrderManage } = nextProps;
    const { vendorOrderList, updateState } = OrderManage;
    this.setState({
      vendorOrderList,
      updateState,
    })
    // 更新数据
    if (updateState) {
      // 重置内部状态
      this.setState({
        visible: false,
      })
      // 重置更新开关
      const state = false;
      dispatch({ type: updateStateFunc, payload: { state } })
      // 重新请求此页数据
      this.renderVendorOrderList()
    }
  }

  // 获取服务商订单列表
  renderVendorOrderList() {
    const { dispatch, vendorId, cityCode, relateType, limit } = this.private;
    const { orgOrderId, sellerId, startDate, endDate } = this.private.search;
    const { page } = this.state;
    const listParams = {
      vendorId,
      orgOrderId,
      sellerId,
      cityCode,
      startDate,
      endDate,
      relateType,
      state: OrderListState.exception,   //异常订单状态-50,
      page,
      limit,
    }
    dispatch({ type: getVendorOrderList, payload: listParams })
  }

  // 取消订单
  renderVendorOrderClose(params) {
    const { dispatch } = this.private;
    dispatch({ type: closeSingleVendorOrder, payload: params })
  }

  // 显示操作提示面板
  showOrHideNoticePanel(state, orderId) {
    const { resetFields } = this.props.form;
    // 重置数据
    resetFields();
    this.setState({
      orderId,
      visible: state,
    })
  }

  // 取消订单面板
  renderCancelOrderPanel() {
    const { itemLayout } = this.private;
    const { orderOperateCallback, showOrHideNoticePanel } = this;
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    return (
      <Modal
        title="取消订单"
        visible={visible}
        onOk={orderOperateCallback}
        onCancel={() => showOrHideNoticePanel(false, '')}
      >
        <Form layout="horizontal" >
          <Row gutter={24}>
            <FormItem
              label={'关闭原因'}
              {...itemLayout}
            >
              {
                getFieldDecorator('closed_note', {
                  rules: [{ required: true, message: '请填写关闭原因' }],
                })(
                  <Input placeholder={'请填写关闭原因'} />,
                )
              }
            </FormItem>
          </Row>
        </Form>
      </Modal>
    )
  }

  // 操作回调函数
  orderOperateCallback(e) {
    e.preventDefault();
    const { orderId, flag } = this.state;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { operatorId } = this.private;
      const closedNote = values.closed_note;
      const params = {
        orderIds: [orderId],
        closedNote,
        operatorId,
      }
      this.renderVendorOrderClose(params)
    });
  }

  //搜索---触发异常订单列表请求
  searchHandle = (values) => {
    if(values){
      this.private.search.orgOrderId = values.orgOrderId ? values.orgOrderId : '';
      this.private.search.startDate = values.startDate ? values.startDate : '';
      this.private.search.endDate = values.endDate ? values.endDate : '';
      this.private.search.sellerId = values.sellerId ? values.sellerId : '';
      this.private.search.contractType = values.contractType ? values.contractType : '' ;
    } else {
      this.private.search.orgOrderId = '';
      this.private.search.startDate = '';
      this.private.search.endDate = '';
      this.private.search.sellerId = ''
      this.private.search.contractType = '';
    }
    this.setState({
      page: 1,
    },()=>{
      this.renderVendorOrderList();
    });
  }

  //update 废弃
  // onPageChange = (page) => {
  //   this.setState({ current: page }, () => {
  //     this.fetchCloseMethod();
  //   });
  // };

  //请求 废弃
  // fetchCloseMethod = () => {
  //   const { dispatch } = this.props;
  //   const { current } = this.state;
  //   const state = OrderListState.exception;
  //   //const currentPage = arguments.length > 0 ? arguments[0] : current;

  //   //异常订单列表
  //   dispatch({
  //     type: OperationOrder.fetchCloseOrderList,
  //     payload: {
  //       ...this.private.search,
  //       vendor_id: authorize.auth.vendorId,
  //       city_code: dot.get(authorize.vendor, 'city.code') || 110000,
  //       page: current ? current : 1,           //页码
  //       limit: requestPagerSize,     //分页
  //       sort: '{created_at: -1}',    //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
  //     },
  //   });
  // };

  //选择器－search
  renderSearchComponent = () => {
    const { cityCode, closeOrderList, closeMeta, startDate, endDate } = this.state;
    const { searchHandle } = this;
    const props = {
      cityCode,       //当前城市code
      closeOrderList,
      closeMeta,
      startDate,
      endDate,
      type: AFFILIATE,
      searchHandle, //搜索回调
      itemsType: 'itmemsOrder',
      isOrdersState: true,
    };

    return (
      <Search {...props} />
    );
  };

  //异常单列表－table
  renderStateTableComponent = () => {
    const { vendorOrderList, page } = this.state;
    const { renderVendorOrderList, showOrHideNoticePanel } = this;
    const { limit } = this.private;
    const pagination = {
      total: vendorOrderList._meta.result_count || 0,
      current: page,
      pageSize: limit,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      onChange: (current) => {
        this.setState({
          page: current,
        }, () => {
          // 初始化请求，获取服务商订单列表
          renderVendorOrderList()
        })

      },
    }

    const props = {
      pagination,
      vendorOrderList,
      showOrHideNoticePanel,
      type: AFFILIATE,
    };

    return (
      <Table {...props} />
    )
  };

  render() {
    const { renderSearchComponent, renderStateTableComponent, renderCancelOrderPanel } = this;
    return (
      <div className={'con-body main-list'}>
        {/* 取消订单面板 */}
        {renderCancelOrderPanel()}
        {/* 渲染条件筛选组件 */}
        <div className="bd-header  m-margin">{renderSearchComponent()}</div>
        {/* 渲染状态数据列表 */}
        <div className="bd-content">{renderStateTableComponent()}</div>
      </div>
    )
  }
}
function mapStateToProps({ OrderManage }) {
  return { OrderManage };
}

export default connect(mapStateToProps)(Form.create()(ExceptionAffiliateOrder));
