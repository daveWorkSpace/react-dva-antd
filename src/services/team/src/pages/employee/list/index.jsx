import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { EMPLOYEE } from '../../../ActionsName';
import Search from './Search';
import List from './List';
import { authorize } from '../../../../../../application';

class View extends Component {
  constructor(props) {
    super();
    const { dispatch } = props;
    Object.assign(this, {
      dispatch,
      page: 1,
      querys: { org_id: authorize.auth.vendorId },
    });
  }

  onSearch = (values) => {
    this.code = values.code;
    this.mobile = values.mobile;
    this.name = values.name;
    this.state = values.state;
    this.page = 1;
    /*this.type=values.type;*/
    const { dispatch, page } = this;
    Object.assign(this.querys, values);
    dispatch({ type: EMPLOYEE.find, payload: { ...this.querys, page } });
  }

  onPageChange = (page) => {
    const { dispatch, querys } = this;
    querys.code = this.code
    querys.mobile = this.mobile
    querys.name = this.name
    querys.state = this.state
    if (querys.state == null) {
      querys.state = 100;
    }
    this.page = page;
    dispatch({ type: EMPLOYEE.find, payload: { ...querys, page } });
  }

  render() {
    const { businessEmployee } = this.props;
    const { list_searchs, list_tables } = businessEmployee;
    const { page, onSearch, onPageChange } = this;
    const searchProps = {
      onSearch,
    };
    const tableProps = {
      ...list_tables,
      onPageChange,
      page,
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


function mapStateToProps({ businessEmployee }) {
  return { businessEmployee };
}

module.exports = connect(mapStateToProps)(View);
