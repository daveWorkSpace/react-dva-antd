import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { DETAIL } from '../core/ActionName';
import Search from './search';
import Table from './table';
import { OrderManage } from '../../actions';
import { authorize } from '../../../application';
//引入枚举值
import { DOWNLOAD_DAILY_DETAIL } from '../core/enumerate.js';
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const { stateTransform, dateFormat, utcToDate, numberDateToStr } = window.tempAppTool;
const {
  getShipmentsDailyByVendor,
  getDownloadFileUrl,
} = OrderManage;

class DailyDownload extends Component {
  constructor(props) {
    super();
    const { dispatch, OrderManage } = props;
    this.state = {
      page: 1,  //初始化分页
      startDate: dateFormat(Date.now() - 24 * 60 * 60 * 1000).join(''),   //初始化开始时间
      endDate: dateFormat(Date.now() - 24 * 60 * 60 * 1000).join(''),     //初始化结束时间
      shipmentsDaily: OrderManage.shipmentsDaily,         //日订单
    };
    this.private = {
      dispatch,
      vendorId: authorize.auth.vendorId,        //服务商id
      cityCode: dot.get(authorize.vendor, 'city.code'),   //城市code
      limit: 10,
    };
    // 日订单明细列表
    this.getShipmentsDaily = this.getShipmentsDaily.bind(this);
    // 下载统计文件
    this.downloadFile = this.downloadFile.bind(this);
    // 查询函数
    this.onSearch = this.onSearch.bind(this);
    // 取当前日期的前一天
    const start_date = 0;
    const end_date = 0;
    let yes_date = 0;
    yes_date = new Date(new Date() - 24 * 60 * 60 * 1000);
    yes_date = utcToDate(yes_date);
    yes_date = yes_date.date.join('');

    Object.assign(this, {
      dispatch,
      page: 1,
      querys: { vendor_id: authorize.auth.vendorId },
      start_date: yes_date,
      end_date: yes_date,
    });
  }

  componentWillMount() {
    this.getShipmentsDaily();
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { OrderManage } = nextProps;
    const { shipmentsDaily } = OrderManage;
    this.setState({
      shipmentsDaily,
    });
  }

  // 日订单明细列表
  getShipmentsDaily() {
    const { page, startDate, endDate } = this.state;
    const { dispatch, vendorId, limit } = this.private;
    const params = {
      vendorId,
      startDate,
      endDate,
      page,
      limit,
    };
    dispatch({ type: getShipmentsDailyByVendor, payload: params });
  }

  // 下载统计文件
  downloadFile(value) {
    const { dispatch } = this.private;
    const params = {
      filename: value,
    }
    dispatch({ type: getDownloadFileUrl, payload: params });
  }

  // 查询函数
  onSearch(values) {
    let [startDate, endDate] = ['', '']
    if (values[0]) {
      startDate = utcToDate(values[0]) ? utcToDate(values[0]).date.join('') : '';
    }
    if (values[1]) {
      endDate = utcToDate(values[1]) ? utcToDate(values[1]).date.join('') : '';
    }
    if (startDate && endDate) {
      this.setState({
        startDate,
        endDate,
        page: 1,
      }, () => {
        this.getShipmentsDaily();
      })
    }
  }

  render() {
    const { onSearch, downloadFile, getShipmentsDaily } = this;
    const { shipmentsDaily, page } = this.state;
    const { limit } = this.private;
    const pagination = {
      total: shipmentsDaily._meta.result_count || 0,
      pageSize: limit,
      current: page,
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
          // 分页获取列表
          getShipmentsDaily()
        })
      },
    }
    const searchProps = {
      onSearch,
      type: DOWNLOAD_DAILY_DETAIL,
    };
    const tableProps = {
      shipmentsDaily,
      pagination,
      downloadFile,
      type: DOWNLOAD_DAILY_DETAIL,
    };

    return (
      <div className="con-body main-list">
        <div className="bd-header">
          <Search {...searchProps} />
        </div>
        <div className="bd-content">
          <Table {...tableProps} />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ OrderManage }) {
  return { OrderManage };
}

module.exports = connect(mapStateToProps)(DailyDownload);
