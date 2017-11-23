import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { message, Button } from 'antd';
import { DETAIL } from '../../../ActionsName';
import Search from './Search';
import List from './List';
import { utcToDate } from '../../../../../../utils/newUtils';
import { authorize } from '../../../../../../application';


class View extends Component {
  constructor(props) {
    super();
    const { dispatch } = props;
    const vendor_id = authorize.auth.vendorId;
    const city_code = dot.get(authorize.vendor, 'city.code');
    Object.assign(this, {
      dispatch,
      page: 1,
      querys: { vendor_id },
    });
    this.state = {
      sellers: [],
    }
  }

  componentWillMount() {
    const { businessPublic } = this.props;
    const { sellers } = businessPublic;
    this.setState({
      sellers,
    })
  }
  componentWillReceiveProps(nextProps, nextState) {
    const { businessPublic } = nextProps;
    const { sellers } = businessPublic;
    this.setState({
      sellers,
    })
  }
  trim(str) {
    return str ? str.replace(/(^\s*)|(\s*$)/g, '') : ''
  }
  onSearch = (values) => {
    if (values.date_range) {
      let time1 = '';
      let time2 = '';
      // 计算得来的31天数据相差的毫秒数用来判断的 之后还要转回具体的时间
      let dayCount = '';
      time1 = Date.parse(values.date_range[0]);
      time2 = Date.parse(values.date_range[1]);
      dayCount = (Math.abs(time2 - time1)) / 1000 / 60 / 60 / 24;
      if (dayCount > 31) {
        message.error('日期区间错误，只能查31天的数据')
        return;
      }
        //2017-03-29 added by alihanniba
      const start_date = utcToDate(values.date_range[0])
      const end_date = utcToDate(values.date_range[1])
      values.start_date = `${start_date.date.join('')}`;
      values.end_date = `${end_date.date.join('')}`;

        // failed code ， antd升级之前的代码不能用
        // const reg = /\-/g;
        // values.start_date = values.date_range[0].replace(reg, '');
        // values.end_date = values.date_range[1].replace(reg, '');
      delete values.date_range;
    }

    const sellerTypeClass = document.getElementsByClassName('seller_type')
    const seller_type = sellerTypeClass[0].childNodes[0].innerText
    // 当选中商家类型但没有选中商家时触发，需枚举
    if ((this.trim(seller_type) === '直营商家' || this.trim(seller_type) === '加盟商家') && !values.seller_id) {
      message.error('请选择商家')
      return;
    }
    this.page = 1;
    const { dispatch, page } = this;
    // 聪明的做法
    Object.assign(this.querys, values);
    dispatch({ type: DETAIL.find, payload: { ...this.querys, page } });
  }

  onPageChange = (page) => {
    const { dispatch, querys } = this;
    this.page = page;
    dispatch({ type: DETAIL.find, payload: { ...querys, page } });
  }
  //获取商家类型的值
  sellerTypeCB = (value) => {
    const { dispatch, querys } = this;
    //清空商家
    !value && dispatch({ type: DETAIL.clearSeller, payload: {} })
    //商家查询
    value && dispatch({ type: DETAIL.sellerList, payload: { contract_type: Number(value) } })
  }
  render() {
    const { staticticsShipmentsDetail, businessPublic } = this.props;
    const { couriers } = businessPublic;
    const { list_tables, areas, sellers } = staticticsShipmentsDetail;
    const { page, onSearch, onPageChange, sellerTypeCB } = this;
    // const sellers = this.state.sellers;
    const searchProps = {
      areas,
      couriers,
      sellers,
      onSearch,
      sellerTypeCB,
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


function mapStateToProps({ staticticsShipmentsDetail, businessPublic }) {
  return { staticticsShipmentsDetail, businessPublic };
}

module.exports = connect(mapStateToProps)(View);
