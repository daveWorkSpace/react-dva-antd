import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { hashHistory } from 'dva/router';
import { Form, Row, Col, Input, Button, Radio, TimePicker, InputNumber, message } from 'antd';
import { ServiceFormComponent } from './core/form';
import { BusinessServiceActions } from '../../actions';
import { Modules } from '../../../application/define'

class IndexComponent extends React.Component {
  constructor(props) {
    super();

    //产品服务设置的id
    const { id } = props.location.query;
    this.state = {
      detail: props.BusinessService.detail,
    }
    this.private = {
      dispatch: props.dispatch,
    }

    //获取产品服务设置的详细数据
    props.dispatch({ type: BusinessServiceActions.fetchServiceDetail, payload: { serviceId: id } });
  }

  componentWillReceiveProps = (nextProps) => {
    const { BusinessService } = nextProps
    this.setState({
      detail: BusinessService.detail,
    });

    //如果更新成功
    if (BusinessService.isUpdateServiceCallback === true) {
      //重置创建成功的回调状态
      this.private.dispatch({ type: BusinessServiceActions.resetUpdateService });

      //跳转到列表页
      const path = Modules.getPathURI(Modules.businessServiceList);
      hashHistory.push(path)
    }
  }

  onSubmit = (values) => {
    this.private.dispatch({ type: BusinessServiceActions.updateService, payload: values });
  }

  onCancle = () => {
    hashHistory.goBack();
  }

  //渲染页面
  render() {
    const { onSubmit, onCancle } = this;
    const { detail } = this.state;
    return (
      <div className="con-body">
        <ServiceFormComponent detail={detail} onSubmit={onSubmit} onCancle={onCancle} componentMode={'update'} />
      </div>
    )
  }
}

function mapStateToProps({ BusinessService }) {
  return { BusinessService };
}

module.exports = connect(mapStateToProps)(IndexComponent);
