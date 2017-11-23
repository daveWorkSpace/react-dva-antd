import React, { Component } from 'react';
import { Form, Row, Col, Table } from 'antd';
const FormItem = Form.Item;

//引用通用枚举值
import {
    DISTRIBUTION_ORDER_DETAIL_COLUMNS,
    DISTRIBUTION_ORDER_TRACE_COLUMNS
} from '../../../../../components/dispatcher/core/enumerate.js'

import style from './style.less';
const itemLayout = { '6_18': { labelCol: { span: 6 }, wrapperCol: { span: 18 } } };


const Detail = () => {
    return (
         <div className={ style.detailModule }>
            <h3 className={"form-divider-header " + style.tableLabel}>订单明细</h3>
                <Row type="flex" justify="center">
                <Col sm={10}>
                    <FormItem label="备注" {...itemLayout['6_18']}>
                        123123213123131
                    </FormItem>
                    <FormItem label="货品类型" {...itemLayout['6_18']}>
                        外卖美食
                    </FormItem>
                </Col>
                <Col sm={10}>
                    <FormItem label="订单金额" {...itemLayout['6_18']}>
                        34.50元
                    </FormItem>
                </Col>
            </Row>
            <p>以下为货品详情</p>
            <Table rowKey={(record, index) => { return index }} columns={ DISTRIBUTION_ORDER_DETAIL_COLUMNS } dataSource={[]} />
            <p>以下为配送费支付信息</p>
            <Row type="flex" justify="center">
                <Col sm={10}>
                    <FormItem label="配送费" {...itemLayout['6_18']}>
                        123123213123131
                    </FormItem>
                    <FormItem label="支付方式" {...itemLayout['6_18']}>
                        外卖美食
                    </FormItem>
                </Col>
                <Col sm={10}>
                    <FormItem label="小费" {...itemLayout['6_18']}>
                        34.50元
                    </FormItem>
                    <FormItem label="结算方式" {...itemLayout['6_18']}>
                        34.50元
                    </FormItem>
                </Col>
            </Row>
        </div>
    )
}

export default Detail;


