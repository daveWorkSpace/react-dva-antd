import is from 'is_js';
import dot from 'dot-prop';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button, Radio, TimePicker, InputNumber, Select, message } from 'antd';
import { ServiceState } from '../../../../application/define';
import { CoreForm, CoreContent } from '../../../core';
import { authorize } from '../../../../application';
import { MapComponent } from './map';
import { Stock } from '../../../../application/object/';

const ComponentMode = {
  update: 'update',    //编辑表单模式
  create: 'create',    //创建表单模式
}

class StockFormComponent extends React.Component {
  constructor(props) {
    super();

    //获取参数
    const { detail, suppliers, onSubmit, onCancle, mode } = props;

    this.state = {
      cityName: dot.get(authorize.vendor, 'city.name'), //城市名称
      cityCode: dot.get(authorize.vendor, 'city.code'), //城市编号
      vendorId: authorize.vendor.id,        //服务商id
      vendorName: authorize.vendor.name,    //服务商名称

      address: dot.get(detail, 'address', ''),          //地址
      longitude: dot.get(detail, 'poi.longitude', 0),   //经度
      latitude: dot.get(detail, 'poi.latitude', 0),     //纬度

      isUpdateAddressFromMap: false,  //是否从地图控件更新过地址
      isShowErrorNotice: false,       //是否显示错误的备注提示
      componentMode: mode,            //模块模式

      suppliers,    //承运商
      detail,       //信息详情
      onSubmit,     //提价回调函数
      onCancle,     //取消提交函数
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { detail, suppliers, onSubmit, onCancle, mode } = nextProps;
    const { isUpdateAddressFromMap } = this.state;
    const state = {
      suppliers,
      detail,
      onSubmit,
      onCancle,
    };

    //判断，如果是编辑模式，则获取地址，坐标的数据
    if (mode === ComponentMode.update && isUpdateAddressFromMap === false) {
      state.address = dot.get(detail, 'address', '');          //地址
      state.longitude = dot.get(detail, 'poi.longitude', 0);   //经度
      state.latitude = dot.get(detail, 'poi.latitude', 0);     //纬度

      state.isShowErrorNotice = false; //是否显示错误的备注提示
    }

    this.setState(state)
  }

  onCancle = () => {
    const { onCancle } = this.state;
    if (onCancle) {
      onCancle()
    }
  }

  onSubmit = (e) => {
    const { address, vendorId, vendorName, cityCode, cityName, longitude, latitude, onSubmit, detail } = this.state;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //判断规则，库房存储能力和配送站能力，必须二选一
        if (values.isDelivery !== true && values.isInventory !== true) {
          message.error('存储能力与配送站能力必须要有一种能力');
          this.setState({ isShowErrorNotice: true });
          return;
        }
        if (!address) {
          message.error('请设置仓库地址');
          return;
        }
        if (!longitude || !latitude) {
          message.error('请选择仓库坐标');
          return;
        }

        const stock = new Stock();
        stock.id = dot.get(detail, 'id', null);
        stock.name = dot.get(values, 'name');
        stock.admin = dot.get(values, 'admin');
        stock.mobile = dot.get(values, 'mobile');
        stock.addressDetail = dot.get(values, 'addressDetail');
        stock.isDelivery = {
          name: dot.get(values, 'isDelivery') ? '有' : '无',
          value: dot.get(values, 'isDelivery'),
        };
        stock.isInventory = {
          name: dot.get(values, 'isInventory') ? '有' : '无',
          value: dot.get(values, 'isInventory'),
        };
        stock.serviceState = {
          name: ServiceState.description(dot.get(values, 'serviceState')),
          value: dot.get(values, 'serviceState'),
        };
        stock.address = address;
        stock.vendorId = vendorId;
        stock.vendorName = vendorName;
        stock.city = {
          name: cityName,
          code: cityCode,
        };
        stock.poi = {
          longitude,
          latitude,
        };

        //判断，如果详情数据存在，则直接从详情数据中获取承运商id
        if (dot.get(detail, 'supplyVendorId')) {
          //承运商数据，没有则默认返回null
          stock.supplyVendorId = dot.get(detail, 'supplyVendorId', null);
          stock.supplyVendorName = dot.get(detail, 'supplyVendorName', null);
        } else {
          stock.supplyVendorId = dot.get(values, 'supplyVendorId', null);
        }

        console.log('form onSubmit', values, stock);

        if (onSubmit) {
          onSubmit(stock);
        }
      }
    });
  }

  onSearch = (address, poi) => {
    //设置显示数据
    this.setState({
      address,
      longitude: poi.lng,
      latitude: poi.lat,
      isUpdateAddressFromMap: true,
    });
  }

  //渲染下拉列表
  renderSelectSuppliers = () => {
    const { getFieldDecorator } = this.props.form;
    const { onSelectCreateAreas } = this;
    const { suppliers, detail } = this.state;

    //判断，如果是编辑详情页面，则直接显示供应商名称
    if (is.existy(detail, 'id') && is.not.empty(detail, 'id')) {
      //获取承运商名称
      let supplierName = dot.get(detail, 'supplyVendorName');
      if (is.empty(supplierName) || is.not.existy(supplierName)) {
        supplierName = '无承运商'
      }
      return (<span>{supplierName}</span>)
    }

    const children = [];
    const data = dot.get(suppliers, 'data');
    if (data) {
      data.forEach((supplier, index, array) => {
        //过滤当前服务商自己
        if (supplier.id !== authorize.vendor.id) {
          const key = `${supplier.id + supplier.name + index}notNone`;
          children.push(<Select.Option key={key} value={supplier.id}>{supplier.name}</Select.Option>);
        }
      })
    }
    return (
      getFieldDecorator('supplyVendorId')(
        <Select style={{ width: '100%' }} placeholder="请选择承运商" onChange={onSelectCreateAreas}>
          <Select.OptGroup label="直营选项">
            <Select.Option key="defaultNone" value="">无承运商</Select.Option>
          </Select.OptGroup>
          <Select.OptGroup label="加盟选项">
            {children}
          </Select.OptGroup>
        </Select>,
      )
    )
  }

  renderBaseInfo = () => {
    const { detail, isShowErrorNotice } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { renderSelectSuppliers } = this;

    const formItems = [{
      label: '承运商',
      form: renderSelectSuppliers(),
    }, {
      label: '备注',
      form: <span style={{ color: '#FF9900' }}>选择承运商表示当前仓库的服务由对应选择的承运商负责</span>,
      layout: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
    }, {
      label: '仓库名称',
      form: (
        getFieldDecorator('name', {
          initialValue: dot.get(detail, 'name'),
          rules: [{ required: true, message: '请填写内容', whitespace: true }],
        })(
          <Input placeholder="仓库名称" />,
        )
      ),
    }, {
      label: '联系人',
      form: (
        getFieldDecorator('admin', {
          initialValue: dot.get(detail, 'admin'),
          rules: [{ required: true, message: '请填写内容', whitespace: true }],
        })(
          <Input placeholder="联系人" />,
        )
      ),
    }, {
      label: '联系人电话',
      form: (
        getFieldDecorator('mobile', {
          initialValue: dot.get(detail, 'mobile'),
          rules: [{
            required: true,
            trigger: 'onBlur',
            validator: (rule, value, callback) => {
              if (!value) { callback('请填写手机号'); return; }
              if (!(/^1[34578]\d{9}$/.test(value))) { callback('手机格式不对'); return; }
              callback();
            },
          }],
        })(
          <Input placeholder="联系人电话" />,
        )
      ),
    }, {
      label: '状态',
      form: (
        getFieldDecorator('serviceState', {
          initialValue: dot.get(detail, 'serviceState.value', ServiceState.off),
          rules: [{ required: true, message: '请选择状态' }],
        })(
          <Radio.Group>
            <Radio value={ServiceState.on}>{ServiceState.description(ServiceState.on)}</Radio>
            <Radio value={ServiceState.off}>{ServiceState.description(ServiceState.off)}</Radio>
          </Radio.Group>,
        )
      ),
    }, {
      label: '库房存储能力',
      form: (
        getFieldDecorator('isInventory', {
          initialValue: dot.get(detail, 'isInventory.value', false),
          rules: [{ required: true, message: '请选择内容' }],
        })(
          <Radio.Group>
            <Radio value>有</Radio>
            <Radio value={false}>无</Radio>
          </Radio.Group>,
        )
      ),
    }, {
      label: '配送站能力',
      form: (
        getFieldDecorator('isDelivery', {
          initialValue: dot.get(detail, 'isDelivery.value', true),
          rules: [{ required: true, message: '请选择内容' }],
        })(
          <Radio.Group>
            <Radio value>有</Radio>
            <Radio value={false}>无</Radio>
          </Radio.Group>,
        )
      ),
    }];
    //判断是否显示错误备注信息
    if (isShowErrorNotice) {
      formItems.push({
        label: '备注',
        form: (<span style={{ color: '#FF9900' }}>存储能力与配送站能力必须要有一种能力</span>),
      });
    }

    return (
      <CoreContent>
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  renderMap = () => {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { cityName, cityCode, longitude, latitude, address, detail } = this.state;
    const { onSearch } = this;

    const formItems = [{
      label: '城市',
      form: (<span>{cityName}</span>),
    }, {
      label: '地址',
      form: (<span>{address || '请在地图中搜索地址'}</span>),
    }, {
      label: '详细地址',
      form: (
        getFieldDecorator('addressDetail', {
          initialValue: dot.get(detail, 'addressDetail', ''),
        })(
          <Input placeholder="详细地址" />,
        )
      ),
    }, {
      label: '经度',
      form: (<span>{longitude || 0}</span>),
    }, {
      label: '纬度',
      form: (<span>{latitude || 0}</span>),
    }, {
      label: '地图',
      layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
      form: <MapComponent onSearchCallback={onSearch} longitude={longitude} latitude={latitude} isEditMode />,
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
        <Form className="ant-advanced-search-form" onSubmit={this.onSubmit}>

          {/* 基本信息 */}
          {renderBaseInfo()}

          {/* 渲染地图模块 */}
          {renderMap()}

          <div className="bd-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0)!important' }}>
            <div className="content">
              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Button size="large" onClick={this.onCancle}>返回</Button>
                  <Button size="large" type="primary" htmlType="submit">保存</Button>
                </Col>
              </Row>
            </div>
          </div>

        </Form>
      </div>
    )
  }
}

const WrappedComponent = Form.create()(StockFormComponent);
module.exports.StockFormComponent = WrappedComponent;
