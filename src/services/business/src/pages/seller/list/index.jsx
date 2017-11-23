import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { SELLER } from '../../../ActionsName';
import { authorize } from '../../../../../../application'
import Search from './Search';
import List from './List';


class View extends Component {
  constructor(props) {
    super();
    const { dispatch } = props;
    // 将全局获取的服务商ID
    const vendor_id = authorize.auth.vendorId;
    Object.assign(this, {
      code: '', //商户号
      name: '', //商户名称
      dispatch,
      page: 1, //当前的页数
      querys: { history_vendor_id: vendor_id }, //基础参数 查询用
    });
  }


  componentDidMount=() => {
    const state = document.getElementById('selectId')
  }
  // 查询函数
  onSearch = (values) => {
    // 从this里面获取信息
    const { querys, page, dispatch } = this;
    this.code = values.code;
    this.name = values.name;
    this.state = values.state;
    this.verify_state = values.verify_state;
    this.page = 1;
    Object.assign(querys, values);
    // 触发action
    dispatch({ type: SELLER.find, payload: { ...querys, page } });
  }
// 分页
  onPageChange = (page) => {
    const { dispatch, querys } = this;
    querys.name = this.name;
    querys.code = this.code;
    querys.state = this.state;
    querys.verify_state = this.verify_state
    // 如果没有商户状态默认是100
    if (querys.state == null) {
      querys.state = 100;
    }
    this.page = page;
    // 触发action
    dispatch({ type: SELLER.find, payload: { ...querys, page } });
  }

  render() {
    // 从props里面获取信息
    const { businessSeller, businessPublic } = this.props;
    // 从model获取details信息
    const { list_searchs, list_tables, serviceCityList } = businessSeller;
    // 从this里面获取信息
    const { page, onSearch, onPageChange } = this;
   // 搜索组件的参数 要通过props传递到子组件中
    const searchProps = {
      onSearch,
      serviceCityList,  //城市列表
      areas: businessPublic.areas, //从公共model中获取到区域列表
    };
    // 列表组件的参数 要通过props传递到子组件中
    const tableProps = {
      ...list_tables,
      onPageChange, //分页函数
      page, //页数
    };
    //console.log(searchProps)
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


// 链接model
function mapStateToProps({ businessSeller, businessPublic }) {
  return { businessSeller, businessPublic };
}

module.exports = connect(mapStateToProps)(View);
