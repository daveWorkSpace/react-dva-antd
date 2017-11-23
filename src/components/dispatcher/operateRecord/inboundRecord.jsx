// 进站记录页面
import React, { Component } from 'react';
import { connect } from 'dva';
import { DispatcherActions } from '../../actions';

//引入枚举值
import { INBOUND_RECORD, INBOUND_RECORD_COLUMNS } from '../core/enumerate.js';

//导入search组件
import Search from './search';
//导入table组件
import Table from './table';

const { getStockOrdersLog } = DispatcherActions;
const { dateFormat, utcToDate } = window.tempAppTool;

class InboundRecord extends Component {
  constructor(props) {
    super(props);
    const { dispatch, SiteOperate } = props;
    const { stockListByDelivery } = SiteOperate;
    this.state = {
      stockListByDelivery,  //配送站列表
      //仓订单操作日志
      stockOrdersLog: {
        _meta: {},
        data: [],
      },
      activeStockId: '', //当前选中的配送站，默认为列表第一个
      page: 1,           //默认分页信息
    };

    this.private = {
      dispatch,
      limit: 10,
      event: 'stock-order-stock-in',                //入站(stock-order-stock-in)出站(stock-order-done)
      startTime: `${dateFormat(Date.now()).join('-')} 00:00:00`,
      endTime: `${dateFormat(Date.now()).join('-')} 23:59:00`,
    };
    // 搜索函数
    this.searchHandle = this.searchHandle.bind(this);
    // 请求日志列表
    this.fetchStockOrdersLog = this.fetchStockOrdersLog.bind(this);
  }
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
    const { SiteOperate, OperateRecord } = nextProps;
    const { stockListByDelivery } = SiteOperate;
    const { stockOrdersLog } = OperateRecord;
    // 仅初始化一次，防止污染
    if (!this.state.activeStockId && stockListByDelivery.data.length > 0) {
      this.setState({
        activeStockId: stockListByDelivery.data[0].id,
      }, () => {
        this.fetchStockOrdersLog()
      });
    }
    this.setState({
      stockOrdersLog,
    });
  }

  // 请求日志列表
  fetchStockOrdersLog() {
    const { dispatch, limit, event, startTime, endTime } = this.private;
    const { activeStockId, page } = this.state;
    const params = {
      stockId: activeStockId,
      event,
      page,
      limit,
    };
    if (startTime) {
      params.startTime = startTime;
    }
    if (endTime) {
      params.endTime = endTime;
    }
    dispatch({ type: getStockOrdersLog, payload: params });
  }

  // 搜索函数钩子
  searchHandle(values) {
    let [startTime, endTime] = ['', '']
    try {
      if (values.date[0]) {
        const dateTime = utcToDate(values.date[0]);
        const date = dateTime.date.join('-');
        const time = dateTime.time.join(':');
        startTime = `${date} ${time}`;
      }
      if (values.date[1]) {
        const dateTime = utcToDate(values.date[1]);
        const date = dateTime.date.join('-');
        const time = dateTime.time.join(':');
        endTime = `${date} ${time}`;
      }
    } catch (error) {
      this.private.startTime = ''
      this.private.endTime = ''
    }

    const activeStockId = values.stock;
    if (values.date.length === 0) {
      this.private.startTime = ''
      this.private.endTime = ''
    } else {
      this.private.startTime = startTime;
      this.private.endTime = endTime;
    }

    this.setState({
      activeStockId,
      page: 1,
    }, () => {
      this.fetchStockOrdersLog()
    })
  }

  render() {
    const { activeStockId, stockOrdersLog, stockListByDelivery, page } = this.state;
    const { limit } = this.private;
    const { searchHandle, fetchStockOrdersLog } = this;
    const pagination = {
      total: stockOrdersLog._meta.result_count || 0,
      pageSize: limit,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      current: page,
      onChange: (current) => {
        this.setState(
          {
            page: current,
          },
          () => {
            fetchStockOrdersLog();
          },
        );
      },
    };
    const searchParams = {
      type: INBOUND_RECORD,
      activeStockId,
      stockListByDelivery,
      searchHandle,
    };
    const tableParams = {
      columns: INBOUND_RECORD_COLUMNS,
      stockOrdersLog,
      pagination,
    };
    return (
      <div className="con-body main-list">
        {/* 顶部搜索组件 */}
        <Search {...searchParams} />
        {/* 订单数据表格 */}
        <Table {...tableParams} />
      </div>
    );
  }
}

function mapStateToProps({ OperateRecord, SiteOperate }) {
  return { OperateRecord, SiteOperate };
}

export default connect(mapStateToProps)(InboundRecord);
