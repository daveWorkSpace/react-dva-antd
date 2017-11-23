import React, { Component, PropTypes } from 'react';
import { Row, Col, Icon } from 'antd';

class IntroduceComponent extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={'con-body main-list'}>
        <Row gutter={16}>
          <Col sm={24}>
            <img style={{ width: '100%', height: '100%' }} src="images/zhinan .png" alt="新手指南" />
          </Col>
        </Row>
      </div>
    );
  }
}

module.exports = IntroduceComponent;
