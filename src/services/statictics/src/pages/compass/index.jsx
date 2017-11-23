import React from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Radio, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { COMPASS } from '../../ActionsName';
import Charts from './charts';
import Stats from './stats';
const [FormItem] = [Form.Item];
import Search from './Search';

const View = (topProps) => {
  const { statictics_compass, dispatch, history, router } = topProps;
  const { areas, income, stats_data } = statictics_compass;
  const ChartsProps = {
    income,
  }

  const searchProps = {
    areas,
    onSearch(fieldsValue) {
      dispatch({ type: '', payload: fieldsValue });
    },
  };

  const statsProps = {
    stats_data,
  };

  return (
    <div className="con-body">
      <div className="bd-header" />
      <div className="bd-content">
        <Row className="main-form">
          <Col sm={18}>
            <Search {...searchProps} />
            <Charts {...ChartsProps} />
          </Col>
          <Stats {...statsProps} />
        </Row>
      </div>
    </div>
  );
};

function mapStateToProps(props) {
  const { statictics_compass } = props;
  return { statictics_compass };
}

module.exports = connect(mapStateToProps)(View);
