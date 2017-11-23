import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Input, Button, Icon, Table, Select, Pagination, Popconfirm } from 'antd';

import MapMultiComponent from './components/map/multi';
import { BusinessAreaActions } from '../../actions';
import { authorize } from '../../../application'
import { BusinessType, AreaState } from '../../../application/define'
import style from './components/style.less';

class ViewComponent extends Component {

  constructor(props) {
    super(props);

    //初始化状态
    this.state = {
      cityCode: dot.get(authorize.vendor, 'city.code'),
      cityName: dot.get(authorize.vendor, 'city.name'),
      areas: props.BusinessArea.directAreaList,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    //设置state
    this.setState({
      areas: nextProps.BusinessArea.directAreaList,
    });
  }

  //渲染地图详情
  renderMapDetailComponent = () => {
    const { areas, cityCode, cityName } = this.state;

    const { listComponentStatus } = this.state;

    const props = {
      cityCode,
      cityName,
      areas,
    }
    return (<MapMultiComponent {...props} />);
  }

  render() {
    const { renderMapDetailComponent } = this;
    const { areas } = this.state;
    console.log('areas', areas);
    return (
      <div className="con-body" style={{ height: '100%' }}>
        {/* 无标题模块 */}
        <div className="bd-content" style={{ height: '100%' }}>
          <div className="content" style={{ height: '100%' }}>
            {renderMapDetailComponent()}
          </div>
        </div>
        <br />
      </div>
    );
  }
}

function mapStateToProps({ BusinessArea }) {
  return { BusinessArea };
}

module.exports = connect(mapStateToProps)(ViewComponent);
