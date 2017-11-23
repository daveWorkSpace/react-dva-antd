import dot from 'dot-prop';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Modal, Form, Row, Col, Input, message, Button } from 'antd';
// import { DETAIL } from './ActionsName';
import Search from '../../common/search';
import Table from './table';
import { OrderManage, CommonManage } from '../../actions';
import { utcToDate } from '../../../utils/newUtils';
import { authorize } from '../../../application';

const {
  getVendorOrderList,
  closeMultiVendorOrders,
  updateStateFunc,
} = OrderManage
const { fetchSellersList, clearSellersList } = CommonManage;

class IndexComponent extends Component {
  constructor(props) {
    super();
    const { dispatch, OrderManage, commonSellers } = props;
    const vendor_id = authorize.auth.vendorId;
    Object.assign(this, {
      dispatch,
      page: 1,
      querys: { vendor_id },
    });
    this.state = {
      vendorOrderList: OrderManage.vendorOrderList,
      count: 0,                           //批量取消显示总数
      page: 1,                         //当前页,方便搜索查询时重置当前页，所以放在 state 里，用来回传给table
      selectedRowKeys: [],               //当前选中的表格订单列表key
      selectedRows: [],                   //当前选中的表格订单列表
      visible: false, //是否显示关闭订单的文字提示
      updateState: false,
      sellersList: commonSellers.sellersList //商户列表
    }
    this.private = {
      dispatch,
      vendorId: authorize.auth.vendorId,
      cityCode: dot.get(authorize.vendor, 'city.code'),
      operatorId: authorize.account.id,                        //操作人ID
      limit: 10,
      contractType: 10,     //默认查询直营
      /** 搜索条件 */
      search:{
        orgOrderId: '',     //订单编号
        areaId: '',         //配送区域-暂无
        state: '',          //订单状态
        sellerId: '',       //商家名称
        startDate: '',
        endDate: '',
        contractType: ''   //签约类型
      }
    }
    this.title = {
      removeWarning: '批量取消前，请先选择订单',
      removeSuccess: count => `成功取消${count}笔订单`,
    }
    // 获取服务商订单列表
    this.renderVendorOrderList = this.renderVendorOrderList.bind(this);
    this.renderCancelOrderPanel = this.renderCancelOrderPanel.bind(this);
    this.onCloseOrder = this.onCloseOrder.bind(this);
    // 批量取消订单
    this.onHandleCloseOrder = this.onHandleCloseOrder.bind(this);
    // 表格选择回调函数
    this.onSelectChange = this.onSelectChange.bind(this);
    // 搜索函数
    this.searchHandle = this.searchHandle.bind(this);
    // 显示操作提示面板
    this.showOrHideNoticePanel = this.showOrHideNoticePanel.bind(this)
  }

  componentWillMount() {
    // 获取服务商订单列表
    this.renderVendorOrderList()
  }
  componentWillReceiveProps(nextProps, nextState) {
    const { dispatch } = this.private;
    const { removeSuccess } = this.title;
    const { vendorOrderList, updateState } = nextProps.OrderManage;
    const { sellersList } = nextProps.commonSellers;
    this.setState({
      vendorOrderList,
      updateState,
      sellersList
    })
    // 更新数据
    if (updateState) {
      // removeSuccess(this.state.count)
      // 重置更新开关
      const state = false;
      // 关闭面板
      this.showOrHideNoticePanel(state)
      this.setState({
        selectedRows: [],
        selectedRowKeys: [],
      })
      dispatch({ type: updateStateFunc, payload: { state } })
      // 重新请求此页数据
      this.renderVendorOrderList()
    }
  }

  // 获取服务商订单列表
  renderVendorOrderList() {
    const { dispatch, vendorId, cityCode,  limit, } = this.private;
    const { startDate, endDate, orgOrderId, state, sellerId ,contractType } = this.private.search;
    const { page } = this.state;
    const listParams = {
      vendorId,
      cityCode,
      page,
      limit,
      // contractType
    }
    // 非必须参数
    if (startDate) {
      listParams.startDate = startDate
    }
    if (endDate) {
      listParams.endDate = endDate
    }
    if (orgOrderId) {
      listParams.orgOrderId = orgOrderId
    }
    if (state) {
      listParams.state = state
    }
    if (sellerId) {
      listParams.sellerId = sellerId;
    }
    dispatch({ type: getVendorOrderList, payload: listParams })
  }

  // 批量取消订单
  onHandleCloseOrder(params) {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      message.warning('批量取消前，请先选择订单');
    } else {
      this.showOrHideNoticePanel(true);
    }
  }

  // 表格选择回调函数
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    console.log('selectedRows changed: ', selectedRows);
    this.setState({ selectedRowKeys, selectedRows });
  }

  trim(str) {
    return str ? str.replace(/(^\s*)|(\s*$)/g, '') : ''
  }

  searchHandle(values) {
    if(values){
      this.private.search.orgOrderId = values.orgOrderId ? values.orgOrderId : '';
      this.private.search.startDate = values.startDate ? values.startDate : '';
      this.private.search.endDate = values.endDate ? values.endDate : '';
      this.private.search.sellerId = values.sellerId ? values.sellerId : '';
      this.private.search.contractType = values.contractType ? values.contractType : '' ;
      this.private.search.areaId = values.areaId ? values.areaId : '';
      this.private.search.state = values.state ? values.state : '';
    } else {
      this.private.search.orgOrderId = '';
      this.private.search.areaId = '';
      this.private.search.state = '';
      this.private.search.startDate = '';
      this.private.search.endDate = '';
      this.private.search.sellerId = ''
      this.private.search.contractType = '';
    }
    // 搜索时默认搜索第一页
    this.setState({
      page: 1,
    }, () => {
      this.renderVendorOrderList()
    })
  }

  //重置


  //获取商家类型的值
  sellerTypeCB = (value) => {
    // const { dispatch, querys } = this;
    // //清空商家
    // !value && dispatch({ type: DETAIL.clearSeller, payload: {} })
    // //商家查询
    // value && dispatch({ type: DETAIL.sellerList, payload: { contract_type: Number(value) } })
  }

  // 显示操作提示面板
  showOrHideNoticePanel(state) {
    const { resetFields } = this.props.form;
    // 重置数据
    resetFields();
    this.setState({ visible: state })
  }

  // 操作回调函数
  onCloseOrder(e) {
    const { selectedRows } = this.state;
    const { dispatch, operatorId } = this.private;

    e.preventDefault();
    const { orderIds } = this.state;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log(selectedRows)

      const orderIds = [];
      for (let i = 0, j = selectedRows.length; i < j; i++) {
        orderIds.push(selectedRows[i].id);
      }
      this.setState({
        count: orderIds.length,
      })
      const params = {
        orderIds,
        closedNote: dot.get(values, 'closedNote', ''),
        operatorId,
      }
      dispatch({ type: closeMultiVendorOrders, payload: params })
    });
  }

  // 取消订单面板
  renderCancelOrderPanel() {
    const { onCloseOrder, showOrHideNoticePanel } = this;
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;

    const itemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 16 } };
    return (
      <Modal title="取消订单" visible={visible} onOk={onCloseOrder} onCancel={() => showOrHideNoticePanel(false)}>
        <Form layout="horizontal" >
          <Row gutter={24}>
            <Form.Item label="关闭原因" {...itemLayout}>
              {
                getFieldDecorator('closedNote', {
                  rules: [{ required: true, message: '请填写关闭原因' }],
                })(
                  <Input placeholder={'请填写关闭原因'} />,
                  )
              }
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    )
  }

  render() {
    const { searchHandle, sellerTypeCB, renderVendorOrderList, onHandleCloseOrder, renderCancelOrderPanel, onSelectChange } = this;
    const { vendorOrderList, selectedRowKeys, page, sellersList } = this.state;
    const { limit, dispatch } = this.private;
    const pagination = {
      total: vendorOrderList._meta.result_count || 0,
      pageSize: limit,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      current: page,
      onChange: (current) => {
        this.setState({
          page: current,
        }, () => {
          renderVendorOrderList()
        })
        // 获取服务商订单列表
      },
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.state === -100 || record.state === 100 || record.state === 50,    // Column configuration not to be checked
      }),
    };
    // 检索条件
    const searchProps = {
      searchHandle,
      sellerTypeCB,
      onHandleCloseOrder,
      dispatch,
      fetchSellersList,
      clearSellersList,
      form: this.props.form,
      isShowBtn: true,       //
      itemsType: 'itmemsOrder',  // 订单查询items
    };
    const tableProps = {
      pagination,
      vendorOrderList,
      rowSelection,
    };

    return (
      <div className="con-body main-list">
        <div>
          <Search {...searchProps} />
        </div>
        <div className="bd-content">
          <Table {...tableProps} />
        </div>

        {/* 渲染取消订单的弹窗提示 */}
        {renderCancelOrderPanel()}
      </div>
    );
  }
}

function mapStateToProps({ staticticsShipmentsDetail, businessPublic, OrderManage, commonSellers }) {
  return { staticticsShipmentsDetail, businessPublic, OrderManage, commonSellers };
}
const wrapper = Form.create()(IndexComponent)
module.exports = connect(mapStateToProps)(wrapper);
