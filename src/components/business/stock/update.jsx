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
    this.state = {
      detail,
    }
    this.private = {
      dispatch: props.dispatch,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { detail, isUpdateStockCallback } = nextProps.BusinessStock;

    this.setState({
      detail,
    })

    //创建成功
    if (isUpdateStockCallback === true) {
      //重置更新成功的回调状态
      this.private.dispatch({ type: BusinessStock.resetUpdateStock });

      //跳转到列表页
      const path = Modules.getPathURI(Modules.businessStockDriect);
      hashHistory.push(path)
    }
  }

  onCancle = () => {
    hashHistory.goBack();
  }

  onSubmit = (stock) => {
    console.log(stock);
    this.private.dispatch({ type: BusinessStock.updateStock, payload: stock });
  }

  render() {
    const { onSubmit, onCancle } = this;
    const { detail } = this.state;
    return (
      <div className="con-body">
        <StockFormComponent detail={detail} onSubmit={onSubmit} onCancle={onCancle} mode={'update'} />
      </div>
    )
  }
}
function mapStateToProps({ BusinessStock }) {
  return { BusinessStock };
}

module.exports = connect(mapStateToProps)(IndexComponent);
