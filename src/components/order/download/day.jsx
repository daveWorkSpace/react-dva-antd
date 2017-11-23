import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import DayCommponent from '../../common/downloadDaily';
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const { stateTransform, dateFormat, utcToDate, numberDateToStr } = window.tempAppTool;

class DayDownload extends Component {
    constructor(props) {
        super();

    }

    //

    render() {
        const props = {
            type: 'vendorOrder', // 订单入口  shipment：运力订单入口
        };
        return (
            <DayCommponent {...props}/>
        )
    }
}

module.exports = DayDownload;