import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { hashHistory } from 'dva/router';
import { Row, Col, Form, Button } from 'antd';
import { ServiceDetailComponent } from './detail';
import { BusinessServiceActions } from '../../../actions';

class IndexComponent extends React.Component {
  constructor(props) {
    super();
    //产品服务设置的id
    const { id } = props.location.query;
    this.state = {
      detail: props.BusinessService.detail,
    }

    //获取产品服务设置的详细数据
    props.dispatch({ type: BusinessServiceActions.fetchServiceDetail, payload: { serviceId: id } });
  }

  componentWillReceiveProps = (nextProps) => {
    const { BusinessService } = nextProps
    this.setState({
      detail: BusinessService.detail,
    });
  }

  onCancle = () => {
    hashHistory.goBack();
  }

  //渲染页面
  render() {
    const { detail } = this.state;
    return (
      <div className="con-body">

        {/* 产品服务设置详情模块 */}
        <ServiceDetailComponent detail={detail} />

        {/* 返回按钮 */}
        <div className="bd-content">
          <div className="content">
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button onClick={this.onCancle}>返回</Button>
              </Col>
            </Row>
          </div>
        </div>

      </div>
    )
  }
}
function mapStateToProps({ BusinessService }) {
  return { BusinessService };
}

module.exports = connect(mapStateToProps)(IndexComponent);
