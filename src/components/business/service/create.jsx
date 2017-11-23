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

    this.state = {}
    this.private = {
      dispatch: props.dispatch,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { BusinessService } = nextProps

    //如果创建成功
    if (BusinessService.isCreateServiceCallback === true) {
      //重置创建成功的回调状态
      this.private.dispatch({ type: BusinessServiceActions.resetCreateService });

      //跳转到列表页
      const path = Modules.getPathURI(Modules.businessServiceList);
      hashHistory.push(path)
    }
  }

  onSubmit = (service) => {
    this.private.dispatch({ type: BusinessServiceActions.createService, payload: service });
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
        <ServiceFormComponent onSubmit={onSubmit} onCancle={onCancle} componentMode={'create'} />
      </div>
    )
  }
}

function mapStateToProps({ BusinessService }) {
  return { BusinessService };
}

module.exports = connect(mapStateToProps)(IndexComponent);
