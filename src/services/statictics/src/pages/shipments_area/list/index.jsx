import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { AREA } from '../../../ActionsName';
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

      area_ids: [], //区域ID
      start_date: yes_date,  //开始的时间
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
    this.area_ids = values.area_ids;
    this.page = 1;
    Object.assign(querys, values);
    dispatch({ type: AREA.find, payload: { ...querys, page } });
  }


  onPageChange = (page) => {
    const { dispatch, querys } = this;
    querys.start_date = this.start_date
    querys.end_date = this.end_date
    querys.area_ids = this.area_ids
    this.page = page;
    dispatch({ type: AREA.find, payload: { ...querys, page } });
  }

  render() {
    const { staticticsShipmentsArea, businessPublic } = this.props;
    const { list_tables, areas, vendorList } = staticticsShipmentsArea;
    const { page, onSearch, onPageChange, dispatch } = this;


    const searchProps = {
      areas,
      onSearch,
      dispatch,
      vendorList,
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


function mapStateToProps({ staticticsShipmentsArea, businessPublic }) {
  return { staticticsShipmentsArea, businessPublic };
}

module.exports = connect(mapStateToProps)(View);
