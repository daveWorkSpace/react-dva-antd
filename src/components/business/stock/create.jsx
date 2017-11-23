import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { hashHistory } from 'dva/router';
import { message } from 'antd';
import { StockFormComponent } from './core/form';
import { BusinessStock } from '../../actions';
import { Modules } from '../../../application/define'

class IndexComponent extends React.Component {
  constructor(props) {
    super();

    //获取默认值
    const { detail } = props.BusinessStock;
    const { allSuppliers } = props.BusinessSupplierService;

    this.state = {
      allSuppliers,
      detail,
    }
    this.private = {
      dispatch: props.dispatch,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { detail, isCreatStockCallback } = nextProps.BusinessStock;
    const { allSuppliers } = nextProps.BusinessSupplierService;

    this.setState({
      allSuppliers,
      detail,
    })

    //创建成功
    if (isCreatStockCallback === true) {
      //重置创建成功的回调状态
      this.private.dispatch({ type: BusinessStock.resetCreateStock });

      //跳转到列表页
      const path = Modules.getPathURI(Modules.businessStockDriect);
      hashHistory.push(path)
    }
  }

  onCancle = () => {
    hashHistory.goBack();
  }

  onSubmit = (stock) => {
    this.private.dispatch({ type: BusinessStock.createStock, payload: stock });
  }

  render() {
    const { onSubmit, onCancle } = this;
    const { detail, allSuppliers } = this.state;
    return (
      <div className="con-body">
        <StockFormComponent detial={detail} suppliers={allSuppliers} onSubmit={onSubmit} onCancle={onCancle} mode={'create'} />
      </div>
    )
  }
}
function mapStateToProps({ BusinessStock, BusinessSupplierService }) {
  return { BusinessStock, BusinessSupplierService };
}
module.exports = connect(mapStateToProps)(IndexComponent);
