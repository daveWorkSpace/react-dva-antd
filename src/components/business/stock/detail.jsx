import dot from 'dot-prop';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { hashHistory } from 'dva/router';
import { Form, Row, Col, Input, Button, Radio, TimePicker, InputNumber, message } from 'antd';
import { ServiceState } from '../../../application/define';
import { CoreForm, CoreContent } from '../../core';
import { authorize } from '../../../application';
import { MapComponent } from './core/map';

class IndexComponent extends React.Component {
  constructor(props) {
    super();

    //获取默认值
    const { detail } = props.BusinessStock;
    this.state = {
      detail,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { detail } = nextProps.BusinessStock;
    this.setState({
      detail,
    })
  }

  onCancle = () => {
    hashHistory.goBack();
  }

  renderBaseInfo = () => {
    const { detail } = this.state;
    const formItems = [{
      label: '承运商',
      form: <span>{dot.get(detail, 'supplyVendorName') ? dot.get(detail, 'supplyVendorName') : '无承运商'}</span>,
    }, {
      label: '仓库id',
      form: <span>{dot.get(detail, 'id')}</span>,
    }, {
      label: '仓库名称',
      form: <span>{dot.get(detail, 'name')}</span>,
    }, {
      label: '联系人',
      form: <span>{dot.get(detail, 'admin')}</span>,
    }, {
      label: '联系人电话',
      form: <span>{dot.get(detail, 'mobile')}</span>,
    }, {
      label: '库房存储能力',
      form: <span>{dot.get(detail, 'isInventory.name')}</span>,
    }, {
      label: '配送站能力',
      form: <span>{dot.get(detail, 'isDelivery.name')}</span>,
    }, {
      label: '状态',
      form: <span>{dot.get(detail, 'serviceState.name')}</span>,
    }, {
      label: '创建时间',
      form: <span>{dot.get(detail, 'createTime.name')}</span>,
    }, {
      label: '更新时间',
      form: <span>{dot.get(detail, 'updateTime.name')}</span>,
    }, {
      label: '最新操作人',
      form: <span>{dot.get(detail, 'operatorName')}</span>,
    }];
    return (
      <CoreContent>
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  renderMap = () => {
    const { detail } = this.state;

    const formItems = [{
      label: '城市',
      form: <span>{dot.get(detail, 'city.name')}</span>,
    }, {
      label: '地址',
      form: <span>{dot.get(detail, 'address')} {dot.get(detail, 'addressDetail')}</span>,
    }, {
      label: '经度',
      form: <span>{dot.get(detail, 'poi.longitude')}</span>,
    }, {
      label: '纬度',
      form: <span>{dot.get(detail, 'poi.latitude')}</span>,
    }, {
      label: '地图',
      layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
      form: <MapComponent isEditMode={false} longitude={dot.get(detail, 'poi.longitude')} latitude={dot.get(detail, 'poi.latitude')} />,
    }];
    return (
      <CoreContent>
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  render() {
    const { renderBaseInfo, renderMap } = this;
    return (
      <div className="con-body">
        {/* 基本信息 */}
        {renderBaseInfo()}

        {/* 渲染地图模块 */}
        {renderMap()}

        <div className="bd-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0)!important' }}>
          <div className="content">
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button size="large" onClick={this.onCancle}>返回</Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps({ BusinessStock }) {
  return { BusinessStock };
}

const WrappedComponent = Form.create()(IndexComponent);
module.exports = connect(mapStateToProps)(WrappedComponent);
