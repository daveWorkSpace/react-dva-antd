import React, { Component } from 'react';
import { Form, Row, Col } from 'antd';
const FormItem = Form.Item;

//引用通用枚举值
import {
  DISTRIBUTION_ORDER_DETAIL_COLUMNS,
  DISTRIBUTION_ORDER_TRACE_COLUMNS
} from '../../../components/dispatcher/core/enumerate'

import style from './style.less';
const itemLayout = { '6_18': { labelCol: { span: 6 }, wrapperCol: { span: 18 } } };


const Basic = () => {
  return (
    <div className={style.detailModule}>
      <h3 className={"form-divider-header " + style.tableLabel}>基本信息</h3>
      <Row type="flex" justify="center">
        <Col sm={10}>
          <FormItem label="订单编号" {...itemLayout['6_18']}>
            123123213123131
                    {/*{shipment_detail.org_order_id}*/}
          </FormItem>
          <FormItem label="商家名称" {...itemLayout['6_18']}>
            白白鲜花园
                    {/*{seller_name}*/}
          </FormItem>
          <FormItem label="商品类型" {...itemLayout['6_18']}>
            鲜花
                    {/*{stateTransform('seller_type', shipment_detail.seller_type)}*/}
          </FormItem>
          <FormItem label="店铺名称" {...itemLayout['6_18']}>
            酒仙桥商家
                    {/*{shop_name}*/}
          </FormItem>
          <FormItem label="商家联系人" {...itemLayout['6_18']}>
            花一
                    {/*{shipment_detail.consignor_name}*/}
          </FormItem>
          <FormItem label="商家电话" {...itemLayout['6_18']}>
            1398575534
                    {/*{shipment_detail.consignor_mobile || shipment_detail.consignor_tel}*/}
          </FormItem>
          <FormItem label="发货地址" {...itemLayout['6_18']}>
            酒仙桥路百子湾社区
                    {/*{shipment_detail.consignor_address} {shipment_detail.consignor_address_detail}*/}
          </FormItem>
          <FormItem label="代付商家" {...itemLayout['6_18']}>
            百子湾商家
                    {/*{ shipment_detail.extra_services && shipment_detail.extra_services.payment && !isEmptyObject(shipment_detail.extra_services.payment) ? (Number(shipment_detail.extra_services.payment.amount) / 100).toFixed(2) : '0.00' } 元*/}
          </FormItem>
          <FormItem label="配送距离" {...itemLayout['6_18']}>
            122KM
                    {/*{shipment_detail.local_calc_distance}km*/}
          </FormItem>
          <FormItem label="订单备注" {...itemLayout['6_18']}>
            在河边上
                    {/*{shipment_detail.delivery_note}*/}
          </FormItem>
          <FormItem label="订单金额" {...itemLayout['6_18']}>
            12.00
                    {/*{shipment_detail.local_calc_o3_order_amount}元*/}
          </FormItem>
          <FormItem label="小费" {...itemLayout['6_18']}>
            23.00
                    {/*{shipment_detail.local_calc_tip_fee}元*/}
          </FormItem>
          <FormItem label="关闭原因" {...itemLayout['6_18']}>
            美原油
                    {/*{shipment_detail.closed_note}*/}
          </FormItem>

        </Col>
        <Col sm={10}>
          <FormItem label="条形码" {...itemLayout['6_18']}>
            {/*{shipment_detail.barcode}*/}
          </FormItem>
          <FormItem label="期望送达" {...itemLayout['6_18']}>
            {/*{shipping_time}*/}
          </FormItem>
          <FormItem label="下单时间" {...itemLayout['6_18']}>
            {/*{created_at}*/}
          </FormItem>
          <FormItem label="顾客姓名" {...itemLayout['6_18']}>
            {/*{shipment_detail.consignee_name}*/}
          </FormItem>
          <FormItem label="顾客电话" {...itemLayout['6_18']}>
            {/*{shipment_detail.consignee_mobile || shipment_detail.consignee_tel}*/}
          </FormItem>
          <FormItem label="顾客地址" {...itemLayout['6_18']}>
            {/*{shipment_detail.consignee_address} {shipment_detail.consignee_address_detail}*/}
          </FormItem>
          <FormItem label="代收顾客" {...itemLayout['6_18']}>
            {/*{ shipment_detail.extra_services && shipment_detail.extra_services.cod && !isEmptyObject(shipment_detail.extra_services.cod) ? (Number(shipment_detail.extra_services.cod.amount) / 100).toFixed(2) : '0.00' } 元*/}
          </FormItem>
          <FormItem label="物流商" {...itemLayout['6_18']}>
            {/*{vendor_name}*/}
          </FormItem>
          <FormItem label="所属区域" {...itemLayout['6_18']}>
            {/*{shipment_area.name}*/}
          </FormItem>
          <FormItem label="配送费" {...itemLayout['6_18']}>
            {/*{shipment_detail.local_calc_shipping_fee} 元*/}
          </FormItem>
          <FormItem label="服务商佣金" {...itemLayout['6_18']}>
            {/*{_local_calc_fee_vendor || 0 }元*/}
          </FormItem>
          <FormItem label="结算方式" {...itemLayout['6_18']}>
            {/*{stateTransform('pay_type', shipment_detail.pay_type)}*/}
          </FormItem>
          <FormItem label="骑士提成" {...itemLayout['6_18']}>
            {/*{_local_calc_fee_courier || 0} 元*/}
          </FormItem>
        </Col>
      </Row>
    </div>
  )
}

export default Basic;


