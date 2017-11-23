import dot from 'dot-prop'
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Button, Modal, Form, Select, Radio, InputNumber, message, Tag, Tooltip, Icon } from 'antd';
import OrderRulesList from './orderRulesList';
import ConcatDelivery from './concatDelivery';
import { SendOrderRules, BusinessStock } from '../../../../actions';
import Storage from '../../../../../application/library/storage';
import { geography, authorize } from '../../../../../application';
import { ORDER_RULES_COLUMNS } from '../../core/enumerate';
import style from '../../style.less';

const [FormItem, Option, confirm] = [Form.Item, Select.Option, Modal.confirm];
const {
  getAreaList,
  addOrderRule,
  getServiceProviders,
  updataStateFunc,
  deleteOrderRules,
  editOrderRule,
} = SendOrderRules;

const { updataStockStateFunc } = BusinessStock;

class RulesContent extends Component {
  constructor(props) {
    super(props);
    const { dispatch, SendOrderRules } = props;
    this.state = {
      stockList: props.stockList,         //仓库列表
      areaList: SendOrderRules.areaList,      //区域列表
      serviceProviderList: SendOrderRules.serviceProviderList,
      visible: false,                                         //分单规则弹出框显示状态
      editState: false,                                       //编辑状态
      activeEditRecord: [],                                   //当前编辑规则
      activeAreaName: '',                                     //当前区域名称
      activeAreaRecord: [],                                   //当前区域信息
      dataSource: [],
    }
    this.private = {
      dispatch,
      columns: '',
      storage: new Storage('direct', { useSession: true }),              //缓存实例

    }
    // 展示弹出框
    this.showModal = this.showModal.bind(this);
    // 弹出框确认
    this.handleOk = this.handleOk.bind(this);
    // 弹出框取消
    this.handleCancel = this.handleCancel.bind(this);
    // 删除订单规则数据
    this.deleteRules = this.deleteRules.bind(this);
    // 编辑弹出框切换
    this.showEditModal = this.showEditModal.bind(this);
    // 删除配送站
    this.onClose = this.onClose.bind(this);
  }

  componentWillMount() {
    const { deleteRules, showEditModal } = this;
    const operateCallBack = (record) => {
      return (
        <p>
          <span style={{ color: '#00CFA1', cursor: 'pointer' }} onClick={() => showEditModal(record)}>
            {'编辑   '}
          </span>

          <span
            style={{ color: '#00CFA1', cursor: 'pointer' }}
            onClick={() => deleteRules(record)}
          >
            {'   删除'}
          </span>
        </p>
      )
    }
    this.private.columns = ORDER_RULES_COLUMNS(operateCallBack)
    // const { storage } = this.private;
    // const contract_id = storage.get('contract_id')

    // dispatch({ type: getAreaList, payload: params })
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.private;
    const { SendOrderRules, BusinessStock, activeAreaName, activeAreaRecord, getAreaListFunc, getOrderRuleDetailsFunc, getStockDispatchRuleByArea } = nextProps;

    console.log(SendOrderRules)
    const {
      areaList,
      upDataState,
      serviceProviderList,
    } = SendOrderRules;

    const { isStockRuleOperationSuccess } = BusinessStock

    this.setState({
      stockList: nextProps.stockList,
      areaList,
      activeAreaName,
      activeAreaRecord,
      serviceProviderList,
    })

    if (isStockRuleOperationSuccess) {
      // 允许区域刷新
      this.props.reflush(false);
      // 更新区域列表
      getAreaListFunc()
      // 根据区域获取配送站设置
      getStockDispatchRuleByArea(activeAreaRecord)
      // 关闭更新开关
      const state = false;
      dispatch({ type: updataStockStateFunc, payload: { state } })
    }

    // 当添加， 编辑， 删除规则时，都应重新请求最新的数据，包括侧边区域数据，规则数据
    if (upDataState) {
      // 允许区域刷新
      this.props.reflush(false);
      // 通知model 层 通过区域id 获取此区域的分单规则详情信息
      getOrderRuleDetailsFunc(activeAreaRecord);
      // 更新区域列表
      getAreaListFunc()
      // 关闭更新开关
      const state = false;
      dispatch({ type: updataStateFunc, payload: { state } })
    }
  }

  //删除订单规则数据
  deleteRules(record) {
    const { dispatch } = this.private;
    confirm({
      title: '是否确认删除该规则',
      onOk() {
        console.log('OK');
        const rule_id = record.id;
        dispatch({ type: deleteOrderRules, payload: { rule_id } })
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  // 编辑弹出框切换
  showEditModal(record) {
    // 禁止区域刷新
    this.props.reflush(true);
    this.setState({
      editState: true,
      activeEditRecord: record,
    })
    this.showModal();
  }

  // 展示弹出框
  showModal = () => {
    // 禁止区域刷新
    this.props.reflush(true);
    const { dispatch } = this.props;
    const { activeAreaName, activeAreaRecord } = this.state;
    if (activeAreaName !== '') {
      const params = {
        vendor_id: authorize.auth.vendorId,
        city_code: dot.get(authorize.vendor, 'city.code'),
        area_id: activeAreaRecord.id,
      }
      // 获取当前区域下服务商列表
      dispatch({ type: getServiceProviders, payload: params });

      this.setState({
        visible: true,
      });
    } else {
      message.error('请选择左侧的服务区域')
    }
  };

  // 弹出框确认
  handleOk = (e, value) => {
    const { storage } = this.private;
    const { activeAreaName, activeAreaRecord, editState, activeEditRecord } = this.state;
    console.log('--------------editState----', editState)
    const self = this;
    const { form, dispatch } = this.props;
    const { resetFields } = form;
    form.validateFields((err, value) => {
      if (err) {
        return;
      }
      const values = form.getFieldsValue();

      values.seller_id = storage.get('seller_id');
      values.contract_id = storage.get('contract_id');
      if (editState === false) {
        values.vendor_id = authorize.auth.vendorId;
      }
      values.rule_class = 10;

      // 多选区域设置规则
      if (values.area_id.length > 0) {
        const numbers = values.area_id.indexOf(activeAreaRecord.id);
        const sub_areas_values = [];
        for (let i = 0; i < values.area_id.length; i++) {
          if (values.area_id[i].indexOf(activeAreaRecord.id) == -1) {
            sub_areas_values.push(values.area_id[i]);
          }
        }

        values.sub_area_list = sub_areas_values;
        values.area_id = activeAreaRecord.id;
      }
      if (editState === true) {
        const rule_id = activeEditRecord.id;
        dispatch({ type: editOrderRule, payload: { values, rule_id } })
      } else {
        dispatch({ type: addOrderRule, payload: { values } })
      }
      self.setState({
        visible: false,
        editState: false,
        activeEditRecord: [],
      });
      resetFields();
    });
  };

  // 弹框取消
  handleCancel = (e) => {
    const { resetFields } = this.props.form;
    resetFields();
    this.setState({
      visible: false,
      editState: false,
      activeEditRecord: [],
    });
  };

  // 删除配送站
  onClose(e, value, activeAreaName) {
    e.preventDefault();
    console.log(value)
    if (activeAreaName === '') {
      message.error('请选择左侧的服务区域')
      return;
    }
    confirm({
      title: '是否确认删除该配送站',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  render() {
    const { showModal, handleOk, handleCancel, onClose } = this;
    const { dataSource, activeAreaName, visible, serviceProviderList, editState, activeEditRecord, activeAreaRecord, stockList } = this.state;
    const { storage, columns } = this.private;
    const { treeList, orderRuleListDetail, directStockListByArea, stockDispatchRuleByArea } = this.props;
    const seller_name = storage.get('seller_name')
    // 业务模式
    const bizMode = storage.get('biz_mode')
    // 从Form 组件中获取相应的方法
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const rulesListProps = {
      columns,
      dataSource,
      activeAreaName,
      orderRuleListDetail,
    }

    const deliveryProps = {
      stockList,
      activeAreaName,
      activeAreaRecord,
      directStockListByArea,
      stockDispatchRuleByArea,
      onClose,
    }

    const supply_vendor_list_value = [];
    const sub_area_list_value = [];
    const sub_area_list_value_init = [];
    const editOrderRule = activeEditRecord;
    if (editState === true) {
      // 将区域数据整合 父级及子集放如同一数组
      sub_area_list_value.push({ id: editOrderRule.area_info.id, name: editOrderRule.area_info.name });
      for (var i = 0; i < editOrderRule.sub_area_list.length; i++) {
        sub_area_list_value.push(editOrderRule.sub_area_list[i].id);
        sub_area_list_value_init.push(editOrderRule.sub_area_list[i].id);
      }

      if (editOrderRule.supply_vendor_list.length > -1) {
        for (var i = 0; i < editOrderRule.supply_vendor_list.length; i++) {
          supply_vendor_list_value.push(editOrderRule.supply_vendor_list[i].id);
        }
      }
    }
    const popContent = (
      <span>说明：<br />
      1.不设规则默认分单给服务商自己 <br />
      2.分单规则优先级数越大优先级越高<br />
      </span>
    )
    return (
      <Col sm={19} style={{ paddingLeft: '10px' }}>
        <div className="bd-content">
          <Row>
            {/* 配送站设置模块，  必须单独抽出一个模块， 一个页面中不能有两个form表单 */}
            {
              bizMode !== 10 ? <ConcatDelivery {...deliveryProps} /> : ''
            }
            <Col sm={12}>
              <div className="content-title">
                运力分单规则设置{` (${activeAreaName === '' ? '请选择左侧服务区域' : activeAreaName})`}
                <Tooltip title={popContent} arrowPointAtCenter>
                  <Icon type="info-circle" />
                </Tooltip>
              </div>
            </Col>
            <Col sm={12} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={showModal}>添加分单规则</Button>
              <Modal
                title="添加分单规则"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                style={{ top: '35%' }}
              >
                <Form>
                  <Row>
                    <Col sm={24}>
                      <FormItem label="规则类型:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                        <span>指定服务商</span>
                      </FormItem>
                    </Col>
                    <Col sm={24}>
                      <FormItem label="适用区域:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                        {
                          getFieldDecorator('area_id', {
                            initialValue: editState === true ? sub_area_list_value_init.length > 0 ? sub_area_list_value_init : [`${editOrderRule.area_info.id}`] : [],
                            validate: [
                              {
                                rules: [{ type: 'array', required: true, message: '请选择服务区域' }],
                                trigger: 'onBlur',
                              },
                            ],
                          })(
                            <Select
                              showSearch
                              mode="multiple"
                              style={{ width: '100%' }}
                              placeholder="请选择服务区域"
                              optionFilterProp="children"
                            >
                              {
                                treeList.map((item, index) => {
                                  const key = `area${item.id}${item.name}${index}${Math.random()}`
                                  return (
                                    <Option value={item.id} key={key}>{item.name}</Option>
                                  )
                                })
                              }
                            </Select>,
                          )
                        }
                      </FormItem>
                    </Col>
                    <Col sm={24}>
                      <FormItem label="有效期:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                        {
                          getFieldDecorator('expired_at', {
                            initialValue: '2027-12-31 00:00:00',
                          })(
                            <Radio defaultChecked >永久</Radio>,
                          )
                        }

                      </FormItem>
                    </Col>
                    <Col sm={24}>
                      <FormItem label="规则参数:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                        {
                          getFieldDecorator('supply_vendor_id', {
                            initialValue: editState === true ? supply_vendor_list_value[0] : '',
                            validate: [
                              { rules: [{ required: true, message: '请选择服务商' }], trigger: 'onBlur' },
                            ],
                          })(
                            <Select
                              showSearch
                              style={{ width: '100%' }}
                              placeholder="请选择服务商"
                              optionFilterProp="children"
                            >
                              {
                                serviceProviderList.data.map((item, index) => {
                                  const key = `vendor${item.id}${item.name}${index}${Math.random()}`
                                  return (
                                    <Option key={key} value={item.id}>{item.name}</Option>
                                  )
                                })
                              }
                            </Select>,
                          )
                        }
                      </FormItem>
                    </Col>
                    <Col sm={24}>
                      <FormItem label="优先级:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                        {
                          getFieldDecorator('priority', {
                            initialValue: editState === true ? editOrderRule.priority : 1,
                            validate: [
                              { rules: [{ required: true, message: '请选择优先级' }], trigger: 'onBlur' },
                            ],
                          })(<InputNumber size="large" min={1} max={100} />)
                        }
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            </Col>
            <Col sm={24}>
              <OrderRulesList {...rulesListProps} />
            </Col>
          </Row>
        </div>
      </Col>
    )
  }
}

function mapStateToProps({ SendOrderRules, BusinessStock }) {
  return { SendOrderRules, BusinessStock };
}

export default connect(mapStateToProps)(Form.create()(RulesContent));
