import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { DETAIL } from '../../../ActionsName';
import Search from './Search';
import List from './List';
import { authorize } from '../../../../../../application'

const { stateTransform, utcToDate, numberDateToStr } = window.tempAppTool;


class View extends Component {
  constructor(props) {
    super();
    const { dispatch } = props;
    const vendor_id = authorize.auth.vendorId;
    const city_code = dot.get(authorize.vendor, 'city.code');
    // 取当前日期的前一天
    const start_date = 0;
    const end_date = 0;
    let yes_date = 0
    yes_date = new Date(new Date() - 24 * 60 * 60 * 1000);
    yes_date = utcToDate(yes_date);
    yes_date = yes_date.date.join('');

    Object.assign(this, {
      dispatch,
      page: 1,
      querys: { vendor_id },
      start_date: yes_date,
      end_date: yes_date,
    });
  }

  onSearch = (values) => {
    if (values.date_range) {
      values.start_date = values.date_range[0].replace(/-/g, '');
      values.end_date = values.date_range[1].replace(/-/g, '');
      this.start_date = values.start_date;
      this.end_date = values.end_date;
      delete values.date_range;
    }
    this.page = 1;
    const { dispatch, page } = this;
    Object.assign(this.querys, values);
    dispatch({ type: DETAIL.queryList, payload: { ...this.querys, page } });
  }
  onFileDownUrl = (values) => {
    const { dispatch, page } = this;
    dispatch({ type: DETAIL.downUrl, payload: { filename: values } });
  }

  onPageChange = (page) => {
    const { dispatch, querys } = this;
    querys.start_date = this.start_date
    querys.end_date = this.end_date
    console.log('onPageChangequerys', querys)
    this.page = page;
    dispatch({ type: DETAIL.queryList, payload: { ...querys, page } });
  }

  render() {
    const { staticticsShipmentsDetailDown, businessPublic } = this.props;
    const { areas, couriers, sellers } = businessPublic;
    const { list_tables } = staticticsShipmentsDetailDown;
    const { page, onSearch, onPageChange, onFileDownUrl } = this;
    const searchProps = {
      areas,
      couriers,
      sellers,
      onSearch,
    };
    const tableProps = {
      ...list_tables,
      onPageChange,
      page,
      onFileDownUrl,
    };

    return (
      <div className="con-body main-list">
        <div className="bd-header">
          <Search {...searchProps} />
        </div>
        <div className="bd-content">
          <List {...tableProps} />
        </div>
      </div>
    );
  }

}


function mapStateToProps({ staticticsShipmentsDetailDown, businessPublic }) {
  return { staticticsShipmentsDetailDown, businessPublic };
}

module.exports = connect(mapStateToProps)(View);
