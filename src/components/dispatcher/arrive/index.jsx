// 到站收货页面
import React, { Component } from 'react';
import { connect } from 'dva';
import { DispatcherActions } from '../../actions';

//顶部配送站选择及到货列表组件
import Header from '../core/header';
//扫描组件
import ScanOrder from '../core/scanOrder';
//引入枚举值
import { ARRIVE_DELIVERY, ARRIVE_IN_STATISTICS_COLUMNS } from '../core/enumerate';

const { getStockOrdersStatistic } = DispatcherActions;

class ArriveReceiving extends Component {
  constructor(props) {
    super(props);
    const { dispatch, SiteOperate } = props;
    const { stockListByDelivery } = SiteOperate;
    this.state = {
      stockListByDelivery,      //配送站列表
      activeStockId: '',        //当前选中的配送站，默认为列表第一个
      changeState: false,       //切换配送站时的状态
      stockOrdersStatistic: [], //仓订单统计数据
    };

    this.private = {
      dispatch,
      statisticType: 'arrival', //统计类型： arrival:到站收货, stock_in:揽收入站, consignment:骑士领货, stock_out:中转出站
      showStatistics: true,     //显示统计数据
    };
  }

  componentWillReceiveProps(nextProps) {
    const { SiteOperate } = nextProps;
    const { stockListByDelivery, stockOrdersStatistic } = SiteOperate;
    this.setState({
      stockOrdersStatistic: [stockOrdersStatistic],
    });

    // 仅初始化一次，防止污染
    if (!this.state.activeStockId && stockListByDelivery.data.length > 0) {
      this.setState(
        {
          activeStockId: stockListByDelivery.data[0].id,
        },
        () => {
          this.fetchStockOrdersStatistic();
        },
      );
    }
  }

  // 配送站切换钩子函数
  onChangeByDeliveryStock = (value) => {
    const { dispatch } = this.private;

    if (value !== this.state.activeStockId) {
      this.setState({
        changeState: true,
      });
    }

    this.setState({
      activeStockId: value,
    },
      () => {
        this.fetchStockOrdersStatistic();
      },
    );
  }

  // 根据配送站id 获取实时统计信息
  fetchStockOrdersStatistic =() => {
    const { dispatch, statisticType } = this.private;
    const { activeStockId } = this.state;
    const params = {
      statisticType,
      stockId: activeStockId,
    };
    dispatch({ type: getStockOrdersStatistic, payload: params });
  }

  // 重置配送站切换状态
  resetChangeState = () => {
    this.setState({
      changeState: false,
    });
  }

  // 返回提示信息
  renderPopoverContent = () => {
    return (
      <div>
        <h3>实时统计说明</h3>
        <ul>
          <li>1.今日未到货：期望送达时间是今天的所有未到站订单数；</li>
          <li>2.历史未到货：期望送达日期是今天之前的所有未到站订单数；</li>
          <li>3.今日到货：今日到站的订单汇总数；</li>
          <li>4.异常：当前站点异常订单汇总数；</li>
        </ul>
      </div>
    )
  }

  render() {
    const { changeState, stockOrdersStatistic, stockListByDelivery, activeStockId } = this.state;
    const { onChangeByDeliveryStock, resetChangeState, renderPopoverContent, fetchStockOrdersStatistic } = this;
    const { showStatistics } = this.private;

    const headerParams = {
      type: ARRIVE_DELIVERY,
      columns: ARRIVE_IN_STATISTICS_COLUMNS,
      content: renderPopoverContent(),
      showStatistics,
      stockListByDelivery,
      onChangeByDeliveryStock,
      fetchStockOrdersStatistic,
      activeStockId,
      stockOrdersStatistic,
    };

    const tableParams = {
      type: ARRIVE_DELIVERY,
      changeState,
      activeStockId,
      resetChangeState,
    };

    return (
      <div className="con-body main-list">
        {/* 顶部配送站搜索及到货列表 */}
        <Header {...headerParams} />

        {/* 扫描订单 */}
        <ScanOrder {...tableParams} />
      </div>
    );
  }
}

function mapStateToProps({ SiteOperate }) {
  return { SiteOperate };
}

export default connect(mapStateToProps)(ArriveReceiving);
