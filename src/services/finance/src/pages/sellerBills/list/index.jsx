import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { SellerBills } from '../../../ActionsName';
import DaySearch from './day_Search';
import DayList from './day_List';
import MonthSearch from './month_Search';
import MonthList from './month_List';
import { authorize } from '../../../../../../application'

const TabPane = Tabs.TabPane;
const { stateTransform, dateFormat, utcToDate, numberDateToStr } = window.tempAppTool;

class View extends Component {
  constructor(props) {
    super();
    // 从props里面获取信息
    const { dispatch } = props;
    // 从全局变量中获取相关的信息
    const vendor_id = authorize.auth.vendorId;
    const city_code = dot.get(authorize.vendor, 'city.code');
    // 取当前日期的前一天
    const start_date = 0;
    const end_date = 0;
    let yes_date = 0
    yes_date = new Date(new Date() - 24 * 60 * 60 * 1000);
    yes_date = utcToDate(yes_date);
    yes_date = yes_date.date.join('');

    // 获取上个月的日期
    let last_month = new Date();
    last_month = last_month.getMonth() + 1
    last_month = (last_month < 10) ? `0${last_month}` : last_month;
    let month_date = dateFormat();
    month_date.length = 1;
    month_date += last_month;

    Object.assign(this, {
      dispatch,
      page: 1, //当前页数
      querys: { vendor_id }, //查询的参数对象
      start_date: yes_date, //开始日期
      end_date: yes_date, //结束日期
      start_date2: month_date, //月账单的开始日期
      end_date2: month_date, //月账单的结束日期
      seller_ids_day: [], //日账单查询用到的商户ID
      seller_ids_month: [], //月账单用到的商户ID
    });
  }
// 日账单查询
  dayOnSearch = (values) => {
    // 获取相关的参数
    this.start_date = values.start_date;
    this.end_date = values.end_date;
    this.seller_ids_day = values.seller_ids;
    this.page = 1;
    const { dispatch, page } = this;
    Object.assign(this.querys, values);
    // 触发action
    dispatch({ type: SellerBills.fetchBills, payload: { ...this.querys, page } });
  }
// 月账单查询
  monthOnSearch = (values) => {
    this.start_date2 = values.start_date;
    this.end_date2 = values.end_date;
    this.seller_ids_month = values.seller_ids;
    this.page = 1;
    const { dispatch, page } = this;
    Object.assign(this.querys, values);
    // 触发action
    dispatch({ type: SellerBills.fetchBillsByMonth, payload: { ...this.querys, page } });
  }
// 日账单的分页函数
  dayOnPageChange = (page) => {
    const { dispatch, querys } = this;
    querys.start_date = this.start_date
    querys.end_date = this.end_date
    querys.seller_ids = this.seller_ids_day
    this.page = page;
    dispatch({ type: SellerBills.fetchBills, payload: { ...querys, page } });
  }
// 月账单的分页函数
  monthOnPageChange = (page) => {
    const { dispatch, querys } = this;
    querys.start_date = this.start_date2
    querys.end_date = this.start_date2
    querys.seller_ids = this.seller_ids_month
    this.page = page;
    dispatch({ type: SellerBills.fetchBillsByMonth, payload: { ...querys, page } });
  }

  callback = (key) => {
    console.log(key);
  }
  render() {
    // 从props里面获取信息
    const { businessSellerBills, dispatch, businessPublic } = this.props;
    // 从model获取details信息
    const { Day_list_tables, Month_list_tables } = businessSellerBills;
    const { sellers } = businessPublic;
    // 从this里面获取信息
    const { page, callback, dayOnSearch, monthOnSearch, dayOnPageChange, monthOnPageChange } = this;
    // 日账单搜索组件的参数 要通过props传递到子组件中
    const daySearchProps = {
      sellers,
      dayOnSearch, //日账单查询的搜索函数
    };
    // 月账单搜索组件的参数 要通过props传递到子组件中
    const MonthSearchProps = {
      sellers,
      monthOnSearch, //月账单查询的搜索函数
    };
    // 日账单页面列表组件的参数 要通过props传递到子组件中
    const day_tableProps = {
      ...Day_list_tables,
      dayOnPageChange, //分页函数
      page,
    };
    // 月账单页面列表组件的参数 要通过props传递到子组件中
    const month_tableProps = {
      ...Month_list_tables,
      monthOnPageChange, //分页函数
      page,
    };

    return (
      <div className="con-body main-list">
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="日账单" key="1">
            <div className="bd-content">
              <DaySearch searchProps={daySearchProps} />
            </div>
            <div className="bd-content">
              <DayList {...day_tableProps} />
            </div>
          </TabPane>

          <TabPane tab="月账单" key="2">
            <div className="bd-content">
              <MonthSearch searchProps={MonthSearchProps} />
            </div>
            <div className="bd-content">
              <MonthList {...month_tableProps} />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }

}


function mapStateToProps({ businessSellerBills, businessPublic }) {
  return { businessSellerBills, businessPublic };
}

module.exports = connect(mapStateToProps)(View);
