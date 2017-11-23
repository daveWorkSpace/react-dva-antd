import React, { Component } from 'react';
import { Table } from 'antd';

//引用通用枚举值
import {
    DISTRIBUTION_ORDER_DETAIL_COLUMNS,
    DISTRIBUTION_ORDER_TRACE_COLUMNS
} from '../../../../../components/dispatcher/core/enumerate.js'

import style from './style.less';
const itemLayout = { '6_18': { labelCol: { span: 6 }, wrapperCol: { span: 18 } } };


const Trace = () => {
    return (
        <div className={ style.detailModule }>
            <h3 className={"form-divider-header " + style.tableLabel}>订单追踪</h3>
            <p>配送单号： 23412314341242314124</p>
            <Table rowKey={(record, index) => { return index }} columns={ DISTRIBUTION_ORDER_TRACE_COLUMNS } dataSource={[]} />
        </div>
    )
}

export default Trace;


