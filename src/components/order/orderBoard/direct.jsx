import dot from 'dot-prop'
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, Radio, Breadcrumb, Alert, Icon, Popover } from 'antd';

import Search from '../core/board/search';
import BoardIcon from '../core/board/iconStatistics';
import Table from '../core/board/table';

import style from './style.less';

import { OrderParams } from '../core/exports';
import { OperationOrder } from '../core/ActionName';
import { authorize } from '../../../application';

//引入枚举值
import { DIRECT } from '../core/enumerate'

const moment = require('moment');

const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;

class DirectOrderBoard extends Component {
  constructor(props) {
    super();
    const { operationOrder } = props;

        //订单状态
    const { totalOrderStatistics, cityList, sellerOrderList, sellerMeta } = operationOrder;
    const today = moment().format().replace(rgReg, '').substring(0, 8);

    const city_name = dot.get(authorize.vendor, 'city.name');
    const city_code = dot.get(authorize.vendor, 'city.code');


        //初始化状态
    this.state = {
      cityCode: dot.get(authorize.vendor, 'city.code') || 110000,        //当前城市code
      totalOrderStatistics,                            //订单状态
      sellerOrderList,                                 //商家订单列表
      sellerMeta,
      date: today,                                     //日期
      current: requestPageNumber,                      //当前页
    };

        //私有变量属性－－－不要把方法直接挂在this上，固定不变的属性放在 private中
    this.private = {
      vendorId: authorize.auth.vendorId,                           //供应商id（服务商）
      dispatch: props.dispatch,                      //dispatch函数
    };
  }

    //请求列表数据
  componentDidMount = () => {
    const { fetchOrderMethod } = this;
    fetchOrderMethod();
  };

    //update State
  componentWillReceiveProps = (nextProps) => {
    const { operationOrder } = nextProps;
    const { totalOrderStatistics, cityList, sellerOrderList, sellerMeta } = operationOrder;
    const { cityCode, cityName, date, current } = this.state;
        //状态发生变化时－重新赋值
    this.setState({
      totalOrderStatistics,                            //订单状态
      cityList,                                        //城市列表
      sellerOrderList,                                 //商家订单列表
      sellerMeta,
      date,                                            //日期
      cityCode,
      current,
    });
  };

    //选择城市---通过回调实现子组件与父组件的通信
  onChangeCity = (cityCode, cityName) => {
    this.setState({ cityCode, cityName });
  };

    //选择日期－－－同上
  onChangeDate = (date) => {
    this.setState({ date });
  };

    //搜索---触发商家列表请求
  onHandleSearch = () => {
    const { fetchOrderMethod } = this;
    fetchOrderMethod();
  };

    //update 页码
  onPageChange = (page) => {
    this.setState({ current: page });

        //分页请求
    const { date, cityCode } = this.state;
    const vendor_id = authorize.auth.vendorId;
    const { dispatch } = this.props;
        //请求商家列表
    dispatch({
      type: OperationOrder.fetchSellerOrderList,
      payload: {
        vendorId: vendor_id,
        cityCode,
        shippingDate: date,
        isDirect: true,              //是否是直营
        page,                        //当前页码
        limit: requestPagerSize,     //分页
        sort: '{created_at: -1}',    //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
      },
    })
  };

    //请求
  fetchOrderMethod = () => {
    const { date, cityCode, current } = this.state;
    const vendor_id = authorize.auth.vendorId;
    const { dispatch } = this.props;

        //请求订单状态统计
    dispatch({
      type: OperationOrder.fetchTotalOrderStatistics,
      payload: {
        vendorId: vendor_id,
        cityCode,
        shippingDate: date,
        isDirect: true,              //是否是直营
      },
    });

        //请求商家列表
    dispatch({
      type: OperationOrder.fetchSellerOrderList,
      payload: {
        vendorId: vendor_id,
        cityCode,
        shippingDate: date,
        isDirect: true,              //是否是直营
        page: current,               //当前页码
        limit: requestPagerSize,     //分页
        sort: '{created_at: -1}',    //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
      },
    })
  };

    //选择器-－－－上
  renderFilterComponent = () => {
    const { cityCode, cityList, date } = this.state;
    const { onChangeCity, onChangeDate, onHandleSearch } = this;
    const props = {
      cityCode,       //当前城市code
      cityList,       //当前城市列表
      onChangeCity,   //选择城市的事件回调
      onChangeDate,   //选择日期的时间回调
      onHandleSearch, //搜索回调
      date,           //默认值：today
      type: DIRECT,
    };

    return (
      <Search {...props} />
    );
  };

    //渲染订单状态－－－中
  renderStateDashboardComponent = () => {
    const { totalOrderStatistics } = this.state;
    const props = {
      orderStatistics: totalOrderStatistics,     //订单状态
    };
    return (
      <BoardIcon {...props} />
    )
  };

    //状态数据列表－－－下
  renderStateTableComponent = () => {
    const { onPageChange, requestPageNumber } = this;
    const { sellerOrderList, sellerMeta, date, cityCode } = this.state;
    const props = {
      sellerOrderList,
      sellerMeta,
      date,
      onPageChange,
      requestPageNumber,
      cityCode,
      type: DIRECT,
      isDirect: true,
    };
    return (
      <Table {...props} />
    )
  };

  render() {
    const {
      renderFilterComponent,
            renderStateDashboardComponent,
            renderStateTableComponent,
    } = this;
    return (
      <div className={`${style.component} con-body main-list`}>
        {/* 渲染条件筛选组件 */}
        <div className="bd-header">{renderFilterComponent()}</div>
        {/* 渲染状态数据面板 */}
        <div className="bd-content">{renderStateDashboardComponent()}</div>
        {/* 渲染状态数据列表 */}
        <div className="bd-content">{renderStateTableComponent()}</div>
      </div>
    )
  }
}

function mapStateToProps({ operationOrder }) {
  return { operationOrder };
}

module.exports = connect(mapStateToProps)(DirectOrderBoard);
