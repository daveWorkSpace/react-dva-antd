// 退货入站页面
import React, { Component } from 'react';
import { connect } from 'dva';
import { DispatcherActions } from '../../actions';

//顶部配送站选择及到货列表组件
import Header from '../core/header';
//扫描组件
import ScanOrder from '../core/scanOrder';
//引入枚举值
import { SALES_INBOUND } from '../core/enumerate';

class SalesInbound extends Component {
  constructor(props) {
    super(props);
    const { dispatch, SiteOperate } = props;
    const { stockListByDelivery } = SiteOperate;
    this.state = {
      stockListByDelivery,
      activeStockId: '', //当前选中的配送站，默认为列表第一个
      changeState: false, //切换配送站时的状态
    };

    this.private = {
      dispatch,
    };
    // 切换配送站钩子函数
    this.onChangeByDeliveryStock = this.onChangeByDeliveryStock.bind(this);
    // 重置配送站切换状态
    this.resetChangeState = this.resetChangeState.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { SiteOperate } = nextProps;
    const { stockListByDelivery } = SiteOperate;
    // 仅初始化一次，防止污染
    if (!this.state.activeStockId && stockListByDelivery.data.length > 0) {
      this.setState(
        {
          activeStockId: stockListByDelivery.data[0].id,
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
    );
  }

  // 重置change 状态
  resetChangeState() {
    this.setState({
      changeState: false,
    });
  }

  render() {
    const { changeState, stockListByDelivery, activeStockId } = this.state;
    const { onChangeByDeliveryStock, resetChangeState } = this;
    const { showStatistics } = this.private;
    const headerParams = {
      type: SALES_INBOUND,
      stockListByDelivery,
      onChangeByDeliveryStock,
      activeStockId,
    };
    const tableParams = {
      type: SALES_INBOUND,
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

export default connect(mapStateToProps)(SalesInbound);
