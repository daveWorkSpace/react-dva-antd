import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { CORUIER } from '../../../ActionsName';
import Search from './Search';
import List from './List';
import { authorize } from '../../../../../../application'

const { stateTransform, dateFormat, utcToDate, numberDateToStr, getMonthDays } = window.tempAppTool;


class View extends Component {
  constructor(props) {
    super();
    const { dispatch } = props;
    const vendor_id = authorize.auth.vendorId;
    // 取当前日期的前一天
    const start_date = 0;
    const end_date = 0;
    let yes_date = 0
    yes_date = new Date(new Date() - 24 * 60 * 60 * 1000);
    yes_date = utcToDate(yes_date);
    yes_date = yes_date.date.join('');

    Object.assign(this, {

      courier_ids: [],
      start_date: yes_date,
      end_date: yes_date,
      dispatch,
      page: 1,
      querys: { vendor_id },
    });
  }

  onSearch = (values) => {
    const { querys, page, dispatch } = this
    this.start_date = values.start_date;
    this.end_date = values.end_date;
    this.courier_ids = values.courier_ids;
    this.page = 1;
    Object.assign(querys, values);
    dispatch({ type: CORUIER.find, payload: { ...querys, page } });
  }


  onPageChange = (page) => {
    const { dispatch, querys } = this;
    querys.start_date = this.start_date
    querys.end_date = this.end_date
    querys.courier_ids = this.courier_ids
    this.page = page;
    dispatch({ type: CORUIER.find, payload: { ...querys, page } });
  }

  render() {
    const { staticticsShipmentsCourier, businessPublic } = this.props;
    const { list_tables } = staticticsShipmentsCourier;
    const { page, onSearch, onPageChange } = this;
    // console.log('234',businessPublic)
    // console.log('couriers', businessPublic.couriers)
    const searchProps = {
      onSearch,
      couriers: businessPublic.couriers,
    };
    const tableProps = {
      ...list_tables,
      onPageChange,
      page,
    };

    return (
      <div className="con-body main-list">
        <div className="bd-header">
          <Search searchProps={searchProps} />
        </div>
        <div className="bd-content">
          <List {...tableProps} />
        </div>
      </div>
    );
  }

}


function mapStateToProps({ staticticsShipmentsCourier, businessPublic }) {
  return { staticticsShipmentsCourier, businessPublic };
}

module.exports = connect(mapStateToProps)(View);
