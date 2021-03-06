// 骑士领货页面
import React, { Component } from 'react';
import { connect } from 'dva';
import { DispatcherActions } from '../../actions';

//顶部配送站选择及到货列表组件
import Header from '../core/header';
//扫描组件
import ScanOrder from '../core/scanOrder';
//引入枚举值
import { KNIGHT_DELIVERY, KNIGHT_STATISTICS_COLUMNS } from '../core/enumerate';

const { getStockOrdersStatistic } = DispatcherActions;

class KnightDelivery extends Component {
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
      statisticType: 'consignment', //统计类型： arrival:到站收货, stock_in:揽收入站, consignment:骑士领货, stock_out:中转出站
      showStatistics: true, //显示实时数据
    };
    // 切换配送站钩子函数
    this.onChangeByDeliveryStock = this.onChangeByDeliveryStock.bind(this);
    // 根据配送站id 获取实时统计信息
    this.fetchStockOrdersStatistic = this.fetchStockOrdersStatistic.bind(this);
    // 重置配送站切换状态
    this.resetChangeState = this.resetChangeState.bind(this);
    // 返回提示信息
    this.renderPopoverContent = this.renderPopoverContent.bind(this);
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

  //   配送站切换钩子函数
  onChangeByDeliveryStock(value) {
    const { dispatch } = this.private;
    (value !== this.state.activeStockId) && this.setState({
      changeState: true,
    });
    this.setState(
      {
        activeStockId: value,
      },
      () => {
        this.fetchStockOrdersStatistic();
      },
    );
  }

  // 获取订单日实时统计
  fetchStockOrdersStatistic() {
    const { dispatch, statisticType } = this.private;
    const { activeStockId } = this.state;
    const params = {
      statisticType,
      stockId: activeStockId,
    };
    dispatch({ type: getStockOrdersStatistic, payload: params });
  }

  // 重置change 状态
  resetChangeState() {
    this.setState({
      changeState: false,
    });
  }

  // 返回提示信息
  renderPopoverContent() {
    return (
      <div>
        <h3>实时统计说明</h3>
        <ul>
          <li>1.今日未领货：期望送达时间是今天的骑士未领取的订单汇总数；</li>
          <li>2.历史未领货：期望送达日期是今天之前的骑士未领取的订单汇总数；</li>
          <li>3.今日已领货 ：今日骑士已领取的订单汇总数；</li>
          <li>4.异常：当前站点异常订单汇总数；</li>
          <li>5.今日配送中：今日骑士领取后在配送中的订单汇总数</li>
        </ul>
      </div>
    )
  }

  render() {
    const { changeState, stockOrdersStatistic, stockListByDelivery, activeStockId } = this.state;
    const { onChangeByDeliveryStock, resetChangeState, renderPopoverContent, fetchStockOrdersStatistic } = this;
    const { showStatistics } = this.private;
    const headerParams = {
      type: KNIGHT_DELIVERY,
      columns: KNIGHT_STATISTICS_COLUMNS,
      content: renderPopoverContent(),
      showStatistics,
      stockListByDelivery,
      onChangeByDeliveryStock,
      fetchStockOrdersStatistic,
      activeStockId,
      stockOrdersStatistic,
    };
    const tableParams = {
      type: KNIGHT_DELIVERY,
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

export default connect(mapStateToProps)(KnightDelivery);
