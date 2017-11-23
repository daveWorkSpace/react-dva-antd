
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Table, Radio, Breadcrumb, Alert, Icon, Popover, Pagination, Modal } from 'antd';

import style from './components/style.less';
import DetailHeader from './components/detailHeader';
import Detail from './detail';
import Basic from './basic';
import Trace from './trace';
import { fetchCloseOrderDetail } from '../../services/order';
import { utcTo, isEmptyObject } from '../../../../../utils/newUtils';
import { OrderParams } from '../exports';
import { OperationOrder } from '../../ActionName';

const {
  stateTransform,
  numberDateToStr,
  utcToDate,
} = window.tempAppTool;// 全局变量 来自aoao-core-api-service/src/utils/utils.js

const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;

class DirectDetail extends Component {

  constructor(props) {
    super();
    const { operationOrder } = props;
    const { orderId, shipmentId } = props.location.query;

    //订单状态
    const { closeOrderDetail, closeOrderLog, detailMeta } = operationOrder;

    //初始化状态
    this.state = {
      closeOrderDetail,
      closeOrderLog,
      orderId,
      shipmentId,                    //运单ID
      detailMeta,                    //分页信息
      current: requestPageNumber,    //当前页
      visible: false,                //重新分单对话框
      closeOrderVisible: false,      //关闭订单对话框
    };

    //私有变量属性－－－不要把方法直接挂在this上，固定不变的属性放在 private中
    this.private = {
      //orderId: order_id,                           //供应商id（服务商）
      dispatch: props.dispatch,                      //dispatch函数
    };
  }

  //请求
  componentDidMount = () => {
    const { orderId, shipmentId, current } = this.state;
    const { dispatch } = this.props;

    //异常订单详情
    dispatch({
      type: OperationOrder.fetchCloseOrderDetail,
      payload: orderId,
    });

    //异常订单信息追踪
    dispatch({
      type: OperationOrder.fetchCloseOrderLog,
      payload: {
        shipmentId,
        page: current,
        limit: requestPagerSize,     //分页
        sort: '{created_at: -1}',    //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
      },
    });
  };

  componentWillReceiveProps = (nextProps) => {
    const { operationOrder } = nextProps;
    const { closeOrderDetail, closeOrderLog, detailMeta } = operationOrder;
    const { orderId, shipmentId } = this.state;
    this.setState({
      closeOrderDetail,
      closeOrderLog,
      detailMeta,
      orderId,
      shipmentId,
    })
  };

  //update 分页加载
  onPageChange = (page) => {
    const { orderId, shipmentId } = this.state;
    const { dispatch } = this.props;

    this.setState({ current: page });

    //分页请求
    dispatch({
      type: OperationOrder.fetchCloseOrderLog,
      payload: {
        shipmentId,
        page,
        limit: requestPagerSize,     //分页
        sort: '{created_at: -1}',    //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
      },
    });
  };
  //重新分单对话框
  showModal= () => {
    this.setState({ visible: true });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
    const { dispatch } = this.props;
    const { closeOrderDetail } = this.state;
    const vendorId = closeOrderDetail && closeOrderDetail.vendor_id;               //服务商ID
    const orderId = closeOrderDetail && closeOrderDetail.order_id;                 //订单ID
    const operatorId = (closeOrderDetail && closeOrderDetail.operatorId) || '';    //操作者ID
    const note = (closeOrderDetail && closeOrderDetail.note) || '改派';             //改派理由

    //请求－－－重新分单
    dispatch({
      type: OperationOrder.fetchCloseOrderRedivides,
      payload: {
        vendorId,
        orderId,
        operatorId,
        note,
      },
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  //关闭订单对话框
  showCloseOrderModal = () => {
    this.setState({ closeOrderVisible: true });
  };
  handleCloseOrderOk = () => {
    this.setState({ closeOrderVisible: false });
    const { dispatch } = this.props;
    const { closeOrderDetail } = this.state;
    const orderId = closeOrderDetail && closeOrderDetail.order_id;
    const closedType = (closeOrderDetail && closeOrderDetail.closedType) || '';
    const closedNote = (closeOrderDetail && closeOrderDetail.closedNote) || '';
    const operatorId = (closeOrderDetail && closeOrderDetail.operatorId) || '';
    //关闭订单接口
    dispatch({
      type: OperationOrder.fetchCloseOrder,
      payload: {
        orderId,                   //订单ID
        closed_type: closedType,   //关闭类型
        closed_note: closedNote,   //关闭原因
        operator_id: operatorId,   //操作者ID
      },
    });
  };

  handleCloseOrderCancel = (e) => {
    this.setState({ closeOrderVisible: false });
  };

  //订单基本信息
  renderBasicInfo= () => {
    const { closeOrderDetail } = this.state;

    const props = {
      title: '订单基本信息',
    };

    //下单时间
    const createdAt = utcToDate(closeOrderDetail.created_at);
    createdAt.time.length = 2;
    const createdAtStr = `${createdAt.date.join('-')}  ${createdAt.time.join(':')}`;

    return (
      <div>
        <DetailHeader {...props} />
        <div>
          <Row className={style.lineH}>
            <Col span={6}>订单编号：{(closeOrderDetail && closeOrderDetail.org_order_id) || ''} </Col>
            <Col span={6} offset={6}>期望到达: {(closeOrderDetail && closeOrderDetail.shipment && (`${numberDateToStr(closeOrderDetail.shipment.plan_shipping_date)} ${closeOrderDetail.shipment.plan_shipping_time}`)) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>顾客姓名: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignee_name) || ''}</Col>
            <Col span={6} offset={6}>下单时间: {(closeOrderDetail && createdAtStr) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>店铺名称：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.shop && closeOrderDetail.shipment.shop.name) || ''} </Col>
            <Col span={6} offset={6}>顾客电话: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignee_mobile) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>商家联系人：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignor_name) || ''} </Col>
            <Col span={6} offset={6}>顾客地址: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignee_address) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>商家电话：{(closeOrderDetail && closeOrderDetail.shipment && (closeOrderDetail.shipment.consignor_tel || closeOrderDetail.shipment.consignor_mobile)) || '暂无'} </Col>
            <Col span={6} offset={6}>物流商: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.supply_vendor_info && closeOrderDetail.shipment.supply_vendor_info.name) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>发货地址：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignor_address) || ''} </Col>
            <Col span={6} offset={6}>所属区域: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.area && closeOrderDetail.shipment.area.name) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>代收顾客：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.extra_services && closeOrderDetail.shipment.extra_services.cod) && !isEmptyObject(closeOrderDetail.shipment.extra_services.cod) ? (Number(closeOrderDetail.shipment.extra_services.cod.amount) / 100).toFixed(2) : '0.00' } 元</Col>
            <Col span={6} offset={6}>代付商家: {(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.extra_services && closeOrderDetail.shipment.extra_services.payment) && !isEmptyObject(closeOrderDetail.shipment.extra_services.payment) ? (Number(closeOrderDetail.shipment.extra_services.payment.amount) / 100).toFixed(2) : '0.00' } 元</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>配送距离：{(closeOrderDetail && closeOrderDetail.shipment && (closeOrderDetail.shipment.distance / 1000)) || '0'} km </Col>
            <Col span={6} offset={6}>配送费: {(closeOrderDetail && closeOrderDetail.shipment && (closeOrderDetail.shipment.shipping_fee / 100)) || '0'}元</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>订单备注：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.delivery_note) || '暂无'} </Col>
            <Col span={6} offset={6}>服务商佣金: {(closeOrderDetail && closeOrderDetail.shipment && (closeOrderDetail.shipment.shipping_fee_vendor / 100)) || '0'} 元</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>订单金额：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment && (closeOrderDetail.shipment.o3_order_amount / 100)) || '0'} 元</Col>
            <Col span={6} offset={6}>结算方式: {(closeOrderDetail && closeOrderDetail.shipment && stateTransform('pay_type', closeOrderDetail.shipment.pay_type)) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>小费：{(closeOrderDetail && closeOrderDetail.shipment && (closeOrderDetail.shipment.tip_fee / 100)) || '0'} 元 </Col>
            <Col span={6} offset={6}>骑士提成: {(closeOrderDetail && closeOrderDetail.shipment && (closeOrderDetail.shipment.shipping_fee_courier / 100)) || '0'} 元</Col>
          </Row>
        </div>
      </div>
    )
  };

  //供应商信息
  renderVendorInfo= () => {
    const { closeOrderDetail } = this.state;
    const props = {
      title: '供应商信息',
    };
    return (
      <div>
        <DetailHeader {...props} />
        <Row className={style.lineH}>
          <Col span={6}>供应商：{(closeOrderDetail.shipment && closeOrderDetail.shipment.supply_vendor_info.name) || ''}</Col>
          <Col span={6} offset={6}>配送费：{(closeOrderDetail && closeOrderDetail.shipment && (closeOrderDetail.shipment.shipping_fee / 100)) || '0'}元</Col>
        </Row>
      </div>
    )
  };

  //物流追踪
  renderLogisticsInfo= () => {
    const { closeOrderDetail } = this.state;
    const props = {
      title: '物流追踪',
    };
    return (
      <div>
        <DetailHeader {...props} />
        <div>
          <Row className={style.lineH}>
            <Col span={6}>运单id：{(closeOrderDetail && closeOrderDetail.shipment_id) || ''}</Col>
            <Col span={6} offset={6}>骑士：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignor_name) || ''}</Col>
          </Row>
          <Row className={style.lineH}>
            <Col span={6}>配送区域：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.area.name) || ''}</Col>
            <Col span={6} offset={6}>联系电话：{(closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignor_mobile) || '无联系方式'}</Col>
          </Row>
        </div>
      </div>
    )
  };

  //运单状态
  renderOrderState= () => {
    const { onPageChange, showModal, handleOk, handleCancel, showCloseOrderModal, handleCloseOrderOk, handleCloseOrderCancel } = this;
    const { closeOrderLog, closeOrderDetail, detailMeta, current, visible, closeOrderVisible } = this.state;

    const columns = [{
      title: '运单状态',
      dataIndex: 'event',
      key: 'shipment_state',
      render: (text, record, index) => { return text && stateTransform('event_name', text) },
    }, {
      title: '操作',
      dataIndex: 'event',
      key: 'event',
      render: (text, record, index) => { return text && stateTransform('state_operation', text) },
    }, {
      title: '操作时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text, record, index) => {
        const date = utcToDate(text);
        date.time.length = 2;
        return `${date.date.join('-')}  ${date.time.join(':')}`;
      },
    }, {
      title: '操作人(手机号)',
      dataIndex: 'operator_info',
      key: 'operator_info_mobile',
      render: (text, record, index) => {
        if (record.event === 'created') {
          const name = (closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignor_name) || '暂无';
          const mobile = (closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignee_mobile) || '暂无';
          const tel = (closeOrderDetail && closeOrderDetail.shipment && closeOrderDetail.shipment.consignor && closeOrderDetail.shipment.consignor.tel) || '暂无';
          return `${name}(${mobile})` || `(${tel})`;
        }
        if (record.event === 'confirmed' && (record.operator_info === '' || record.operator_info === undefined)) {
          return '系统自动操作';
        }
        if (record.operator_info) {
          return `${record.operator_info.name}(${record.operator_info.mobile})`;
        }
        if (record.courier_info) {
          return `${record.courier_info.name}(${record.courier_info.mobile})`;
        }
      },
    }, {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      render: (text, record, index) => { return ((text && text) || '暂无备注信息'); },
    }];

    //显示总条数
    const totalNum = detailMeta && detailMeta.result_count > 0 ? detailMeta.result_count : '0';
    const pagination = {
      total: totalNum,
      current,
      pageSize: requestPagerSize,
      onChange: onPageChange,
    };
    const paginationShow = totalNum > 0 ? <Pagination className="ant-table-pagination" {...pagination} showTotal={total1 => `共 ${totalNum} 条`} /> : '';

    return (
      <div>
        <Table rowKey={ record => record.event } dataSource={closeOrderLog} columns={columns} pagination={false} />
        {
          paginationShow
        }
        <Row type="flex" justify="space-between" style={{ lineHeight: '62px' }}>
          {/*关闭订单*/}
          {/*<Col span={8} offset={8} ><Button size="large" onClick={showCloseOrderModal}>关闭</Button></Col>*/}
          {/*重新分单*/}
          {/*<Col span={8}><Button type="primary" size="large" onClick={showModal} >重新分单</Button></Col>*/}
        </Row>
        {/*重新分单对话框*/}
        <Modal
          title="重新分单"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>根据订单分单规则重新分配给供应商，该订单可能会配送超时。确认重新分单？</p>
        </Modal>
        {/*关闭订单对话框*/}
        <Modal
          title="关闭订单"
          visible={closeOrderVisible}
          onOk={handleCloseOrderOk}
          onCancel={handleCloseOrderCancel}
        >
          <p>{'当前由于{供应商原因}异常关闭订单，将不收取商家配送费，是否确认关闭该订单？'}</p>
        </Modal>
      </div>
    );
  };

  render() {
    const {
      renderBasicInfo,
      renderVendorInfo,
      renderLogisticsInfo,
      renderOrderState,
    } = this;

    const { closeOrderDetail } = this.state;

    return (
      <div className={`${style.component} con-body main-list`}>
        <Basic />
        <Detail />
        <Trace />
      </div>
    )
  }
}

function mapStateToProps({ operationOrder }) {
  return { operationOrder };
}
module.exports = connect(mapStateToProps)(DirectDetail);
