import dot from 'dot-prop';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Button, Modal, Form, Select, Radio, InputNumber, message, Tag, Tooltip, Icon } from 'antd';
import { SendOrderRules, BusinessStock } from '../../../../actions';
import { geography, authorize } from '../../../../../application';
import Storage from '../../../../../application/library/storage';
import style from '../../style.less';

const [FormItem, Option, confirm] = [Form.Item, Select.Option, Modal.confirm];
const { getAreaList } = SendOrderRules;
const { updateStockDispatchRuleByDirect, createStockDispatchRuleByDirect } = BusinessStock;

class ConcatDelivery extends Component {
  constructor(props) {
    super(props);
    const { dispatch, SendOrderRules } = props;
    this.state = {
      visible: false,                   //配送站面板显示状态
      activeAreaRecord: [],             //当前区域信息
      stockList: props.stockList,       //配送站列表
    }
    this.private = {
      dispatch,
      vendor_id: authorize.auth.vendorId,
      storage: new Storage('direct', { useSession: true }),              //缓存实例
    }
    // 展示弹出框
    this.showModal = this.showModal.bind(this);
    // 弹出框确认
    this.handleOk = this.handleOk.bind(this);
    // 弹出框取消
    this.handleCancel = this.handleCancel.bind(this);
    // 删除配送站
    this.onClose = this.onClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { activeAreaRecord, stockList } = nextProps;
    this.setState({
      activeAreaRecord,
      stockList,
    })
  }

  // 删除配送站请求
  deleteDelivery() {
    // dispatch({})
  }

  // 显示关联配送站面板
  showModal() {
    const { activeAreaName } = this.props;
    if (activeAreaName !== '') {
      this.setState({
        visible: true,
      })
    } else {
      message.error('请选择左侧的服务区域')
    }
  }

  // 删除配送站
  onClose(e, value, activeAreaName) {
    e.preventDefault();
    console.log(value)

    if (activeAreaName === '') {
      message.error('请选择左侧的服务区域')
      return;
    }
    const { dispatch, stockDispatchRuleByArea } = this.props;

    // 删除操作是把当前选择的仓库Id 在 列表 中删除
    const stocks = dot.get(stockDispatchRuleByArea, 'data.0.delivery_stocks', []);
    const newStockList = [];
    stocks.forEach((item, index) => {
      if (item.id !== value) {
        newStockList.push(item.id);
      }
    })

    //规则id
    const ruleId = stockDispatchRuleByArea.data[0].id;

    confirm({
      title: '是否确认删除该配送站',
      onOk() {
        // 调编辑接口
        const params = {
          ruleId,
          stockList: newStockList,
          state: 100,
        }
        dispatch({ type: updateStockDispatchRuleByDirect, payload: params })
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  // 配送站提交
  handleOk(e) {
    const { form, dispatch, stockDispatchRuleByArea } = this.props;
    const { vendor_id, storage } = this.private;
    const { activeAreaRecord } = this.state;
    const { resetFields } = form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(values);
      const stockList = values.stock_list
      //规则id
      const ruleId = dot.get(stockDispatchRuleByArea, 'data.0.id', '');

      //判断规则是否存在，存在则调用更新接口，不存在，则调用创建接口
      if (ruleId !== '') {
        // 调编辑接口
        const params = {
          ruleId,
          stockList,
          state: 100,
        }
        dispatch({ type: updateStockDispatchRuleByDirect, payload: params })
      } else {
        // 调添加接口
        const params = {
          vendorId: vendor_id,
          areaId: activeAreaRecord.id,
          sellerId: storage.get('seller_id'),
          contractId: storage.get('contract_id'),
          state: 100,         // 仓库状态（100：启用 -100：禁用）
          ruleType: 10,        // 规则类型（10：配送站 20：库房 30：中转仓）
          stockList,
        }
        dispatch({ type: createStockDispatchRuleByDirect, payload: params })
      }

      this.setState({
        visible: false,
      });
      resetFields();
    });
  }

  // 配送站取消
  handleCancel() {
    const { resetFields } = this.props.form;
    resetFields();
    this.setState({
      visible: false,
    });
  }

  render() {
    const { showModal, handleOk, handleCancel, onClose } = this;
    const { visible, stockList, activeAreaRecord } = this.state;
    const { storage } = this.private;
    const { form, activeAreaName, directStockListByArea, stockDispatchRuleByArea } = this.props
    // 从Form 组件中获取相应的方法
    const { getFieldDecorator, getFieldsValue } = form;

    const children = [];
    if (stockList !== undefined && stockList.length > 0) {
      stockList.forEach((item, index) => {
        children.push(<Option value={item.id} key={item.id}>{item.name}</Option>);
      })
    }

    const tags = [];
    const stocks = dot.get(stockDispatchRuleByArea, 'data.0.delivery_stocks', []);
    stocks.forEach((item, index) => {
      const key = `${item.name + index}stockKey`;
      tags.push(<Tag key={key} value={item.name} closable onClose={e => onClose(e, item.id, activeAreaName)}>{item.name}</Tag>);
    })
    const popContent = (
      <span>说明：<br />
      1.当一个区域同时关联多个配送站时，优先按近距离优先分配 <br />
      2.调整配送站配置后进入系统的订单将按新的配置规则分单<br />
      3.只能添加区域规则中关联的配送站<br />
      </span>
    )
    return (
      <Col sm={24}>
        <div className="content-title">
          配送站设置{`(${!activeAreaName ? '请选择左侧服务区域' : activeAreaName})`}
          <Tooltip placement="rightTop" title={popContent} arrowPointAtCenter>
            <Icon type="info-circle" />
          </Tooltip>
        </div>
        <div className={style.deliveryStandBox}>
          <div className={style.deliveryStandColumns}>
            关联配送站
            <Tooltip title="配送站：即有“配送站能力”的仓库" arrowPointAtCenter>
              <Icon type="info-circle" />
            </Tooltip>
          </div>
          <div className={style.deliveryStandContent} >
            {tags}
            <Button size="small" type="dashed" onClick={showModal}>+</Button>
          </div>
          <Modal title="关联配送站" visible={visible} onOk={handleOk} onCancel={handleCancel} style={{ top: '35%' }}>
            <Form>
              <Row>
                <Col sm={24}>
                  <FormItem label="区域:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                    <span>{activeAreaName}</span>
                  </FormItem>
                </Col>
                <Col sm={24}>
                  <FormItem label="选择仓库:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                    {
                      getFieldDecorator('stock_list', {
                        initialValue: dot.get(stockDispatchRuleByArea, 'data.0.stock_list', []),
                        validate: [
                          {
                            rules: [{ type: 'array', required: true, message: '请选择仓库' }],
                            trigger: 'onBlur',
                          },
                        ],
                      })(
                        <Select showSearch mode="multiple" style={{ width: '100%' }} placeholder="请选择仓库" optionFilterProp="children">
                          {children}
                        </Select>,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
      </Col>
    )
  }
}

function mapStateToProps({ SendOrderRules, BusinessStock }) {
  return { SendOrderRules, BusinessStock };
}

export default connect(mapStateToProps)(Form.create()(ConcatDelivery));
