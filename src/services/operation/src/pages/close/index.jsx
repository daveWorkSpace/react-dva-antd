import dot from 'dot-prop'
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Table, Radio, Breadcrumb, Alert, Icon, Popover } from 'antd';

import SearchComponent from './components/searchComponent';
import StateTable from './components/stateTable';
import HeaderTitle from './components/detailHeader';

import style from './components/style.less';
import { OrderListState, OrderParams } from './../exports';
import { OperationOrder } from '../../ActionName';
import { authorize } from './../../../../../application';

const moment = require('moment');

const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;

class Close extends React.Component {

  constructor(props) {
    super();
    const { operationOrder } = props;

    //订单状态
    const { cityList, closeOrderList, closeMeta } = operationOrder;
    const today = moment().format().replace(rgReg, '').substring(0, 8);

    //获取账户信息
    const vendor_id = authorize.auth.vendorId;
    const city_name = dot.get(authorize.vendor, 'city.name');
    const city_code = dot.get(authorize.vendor, 'city.code');

    //初始化状态
    this.state = {
      cityCode: city_code || 110000,        //当前城市code
      cityName: city_name || '北京市',       //当前城市名称
      cityList,                                        //城市列表
      closeOrderList,                                  //异常订单列表
      closeMeta,
      startDate: today,                                //日期范围
      endDate: today,                                  //日期范围
      current: requestPageNumber,                      //当前页码
    };

    //私有变量属性－－－不要把方法直接挂在this上，固定不变的属性放在 private中
    this.private = {
      vendorId: vendor_id,                           //供应商id（服务商）
      dispatch: props.dispatch,                      //dispatch函数
    };
  }

  componentDidMount = () => {
    const { fetchCloseMethod } = this;
    fetchCloseMethod();
  };

  componentWillReceiveProps = (nextProps) => {
    const { operationOrder } = nextProps;
    const { cityList, closeOrderList, closeMeta } = operationOrder;
    const { cityCode, cityName, startDate, endDate, current } = this.state;

    //状态发生变化时－重新赋值
    this.setState({
      cityList,                                        //城市列表
      cityCode,
      cityName,
      closeOrderList,
      closeMeta,
      startDate,
      endDate,
      current,
    });
  };

  //选择城市---通过回调实现子组件与父组件的通信
  onChangeCity = (code, name) => {
    this.setState({ cityCode: code, cityName: name });
  };

  //选择日期
  onChangeDate= (start, end) => {
    this.setState({ startDate: start, endDate: end });
  };

  //搜索---触发异常订单列表请求
  onHandleSearch = () => {
    const { dispatch } = this.props;
    const { cityCode, startDate, endDate, current } = this.state;
    const vendor_id = authorize.auth.vendorId;
    const state = OrderListState.exception;
    //异常订单列表
    dispatch({
      type: OperationOrder.fetchCloseOrderList,
      payload: {
        vendorId: vendor_id,
        cityCode,
        startDate,
        endDate,
        state,
        page: current,           //页码
        limit: requestPagerSize,     //分页
        sort: '{created_at: -1}',    //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
      },
    });
  };

  //update
  onPageChange = (page) => {
    this.setState({ current: page });

    //分页请求
    const { dispatch } = this.props;
    const { cityCode, startDate, endDate } = this.state;
    const vendor_id = authorize.auth.vendorId;
    const state = OrderListState.exception;
    //异常订单列表
    dispatch({
      type: OperationOrder.fetchCloseOrderList,
      payload: {
        vendorId: vendor_id,
        cityCode,
        startDate,
        endDate,
        state,
        page,           //页码
        limit: requestPagerSize,     //分页
        sort: '{created_at: -1}',    //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
      },
    });
  };

  //请求
  fetchCloseMethod = () => {
    const { dispatch } = this.props;
    const { startDate, endDate, current } = this.state;
    const vendor_id = authorize.auth.vendorId;
    const city_code = dot.get(authorize.vendor, 'city.code');
    const state = OrderListState.exception;
    //const currentPage = arguments.length > 0 ? arguments[0] : current;

    //异常订单列表
    dispatch({
      type: OperationOrder.fetchCloseOrderList,
      payload: {
        vendorId: vendor_id,
        cityCode: city_code || 110000,
        startDate,
        endDate,
        state,
        page: current,           //页码
        limit: requestPagerSize,     //分页
        sort: '{created_at: -1}',    //排序按照创建时间排序：－1代表倒叙排列；默认按照 最早创建的显示在最前面。
      },
    });
  };

  //选择器－search
  renderSearchComponent = () => {
    const { cityCode, cityList, cityName, closeOrderList, closeMeta, startDate, endDate } = this.state;
    const { onChangeCity, onChangeDate, onHandleSearch } = this;
    const props = {
      cityCode,       //当前城市code
      cityName,       //当前城市name
      cityList,       //当前城市列表
      onChangeCity,   //选择城市的事件回调
      onChangeDate,
      onHandleSearch, //搜索回调
      closeOrderList,
      closeMeta,
      startDate,
      endDate,
    };

    return (
      <SearchComponent {...props} />
    );
  };

  //异常单列表－table
  renderStateTableComponent = () => {
    const { onPageChange } = this;
    const { closeOrderList, closeMeta, current } = this.state;
    const props = {
      closeOrderList,
      closeMeta,
      current,
      onPageChange,
    };
    return (
      <div>
        <StateTable {...props} />
      </div>
    )
  };

  render() {
    const { renderSearchComponent, renderStateTableComponent } = this;
    return (
      <div className={`${style.component} con-body main-list`}>
        <Row>
          <Col>
            {/* 渲染条件筛选组件 */}
            <div className="bd-content  m-margin">{renderSearchComponent()}</div>
          </Col>
          <Col>
            {/* 渲染状态数据列表 */}
            <div className="bd-content">{renderStateTableComponent()}</div>
          </Col>
        </Row>
      </div>
    )
  }
}
function mapStateToProps({ operationOrder }) {
  return { operationOrder };
}

module.exports = connect(mapStateToProps)(Close);
