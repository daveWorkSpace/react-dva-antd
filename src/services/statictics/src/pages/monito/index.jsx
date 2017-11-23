import React from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Radio, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { COMPASS } from '../../ActionsName';
import Charts from './charts';
import Stats from './stats';
import Search from './Search';

const [FormItem,
  ] = [Form.Item];

const View = (topProps) => {
  const { staticticsMonitor, dispatch } = topProps;
  const { areas, stats_data, couriers_data, shipments_data, imports_data } = staticticsMonitor
  const searchProps = {
    areas,
    onSearch(fieldsValue) {
      dispatch({ type: '', payload: fieldsValue });
    },
  };

  const statsProps = {
    stats_data,
  };
  const chartsProps = {
    couriers_data, shipments_data, imports_data,
  };
  return (
    <div className="con-body">
      <div className="bd-header" />
      <div className="bd-content">
        <Row>
          <Search {...searchProps} />
          <Stats {...statsProps} />
          <Charts {...chartsProps} />
        </Row>
      </div>
    </div>
  );
};

function mapStateToProps({ staticticsMonitor }) {
  return { staticticsMonitor };
}

module.exports = connect(mapStateToProps)(View);
