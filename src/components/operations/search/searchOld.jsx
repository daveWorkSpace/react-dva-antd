import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Input, Button, Checkbox, Icon, Select, DatePicker, Popover, Modal } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';

const [FormItem, Option, RangePicker, CheckboxGroup] = [Form.Item, Select.Option, DatePicker.RangePicker, Checkbox.Group];

class Search extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      options: [
        {
          label: '配送站',
          value: '配送站',
          checked: false,
        },
        {
          label: '区域名称',
          value: '区域名称',
          checked: false,
        },
        {
          label: '订单编号',
          value: '订单编号',
          checked: true,
        },
        {
          label: '状态',
          value: '状态',
          checked: true,
        },
        {
          label: '商家类型',
          value: '商家类型',
          checked: false,
        },
        {
          label: '商家名称',
          value: '商家名称',
          checked: false,
        },
        {
          label: '日期',
          value: '日期',
          checked: false,
        },
        {
          label: '期望送达时间',
          value: '期望送达时间',
          checked: true,
        },
        {
          label: '骑士手机',
          value: '骑士手机',
          checked: true,
        },

      ],
    }

    this.private = {
      checkedList: [],
      itemLayout: { labelCol: { span: 7 }, wrapperCol: { span: 14 } },
    }

    // 提交方法
    this.handleSubmit = this.handleSubmit.bind(this);
    //商家类型选择
    this.handleSelect = this.handleSelect.bind(this);

    // 搜索条件模块
    this.renderAreaName = this.renderAreaName.bind(this);
    this.renderOrderNum = this.renderOrderNum.bind(this);
    this.renderBusinessPattern = this.renderBusinessPattern.bind(this);
    this.renderOrderType = this.renderOrderType.bind(this);
    this.renderOrderStatus = this.renderOrderStatus.bind(this);
    this.renderSellType = this.renderSellType.bind(this);
    this.renderSellName = this.renderSellName.bind(this);
    this.renderOrdersTime = this.renderOrdersTime.bind(this);
    this.renderExpectDeliveryTime = this.renderExpectDeliveryTime.bind(this);
    this.renderDeliveryTime = this.renderDeliveryTime.bind(this);
    this.renderScan = this.renderScan.bind(this);
    this.renderClientPhone = this.renderClientPhone.bind(this);
    this.renderCloseWay = this.renderCloseWay.bind(this);
    this.renderDeliveryStand = this.renderDeliveryStand.bind(this);
    this.renderGetArea = this.renderGetArea.bind(this);
    this.renderCourierMobile = this.renderCourierMobile.bind(this);

    // 返回对应的模块
    this.renderCallBack = this.renderCallBack.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { onSearch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = values;
        //判断时间
        if (values.expect_delivery_time && values.expect_delivery_time.length === 2) {
          params.startDate = moment(values.expect_delivery_time[0]).format('YYYYMMDD');
          params.endDate = moment(values.expect_delivery_time[1]).format('YYYYMMDD');
        }

        console.log('Received values of form: ', values);
        onSearch(params)
      }
    });
  }

  handleSelect() {
    const { resetFields } = this.props.form;
    //重置商家
    resetFields(['seller_id'])
  }

  //获取日期选择器组件值
  getRangePickerValue(date, dateString) {
    return dateString
  }

  //控制日期时间，超过今天不可选
  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }

  // 区域名称
  renderAreaName() {
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('area_id')(
        <Select
          showSearch
          placeholder="请选择区域名称"
          optionFilterProp="children"
        >
          <Option value="AB">全部</Option>
          <Option value="A">A</Option>
          <Option value="B">B</Option>
        </Select>,
      )
    )
  }

  // 订单编号
  renderOrderNum() {
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('org_order_id')(
        <Input {...{ placeholder: '请输入订单编号' }} />,
      )
    )
  }

  // 订单类型
  renderOrderType() {
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('order_type', { initialValue: '' })(
        <Select showSearch optionFilterProp="children" placeholder="请选择订单类型" >
          <Option key="delivery_state_0" value="">全部</Option>
          <Option key="delivery_state_1" value="5">已创建</Option>
          <Option key="delivery_state_2" value="10">待分配</Option>
          <Option key="delivery_state_3" value="15">已分配</Option>
          <Option key="delivery_state_4" value="20">已接单</Option>
          <Option key="delivery_state_5" value="22">已到店</Option>
          <Option key="delivery_state_6" value="24">已取货</Option>
          <Option key="delivery_state_8" value="-50">异常</Option>
          <Option key="delivery_state_9" value="100">已送达</Option>
          <Option key="delivery_state_10" value="-100">已取消</Option>
        </Select>,
      )
    )
  }

  // 业务模式
  renderBusinessPattern() {
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('business_pattern', { initialValue: '' })(
        <Select showSearch optionFilterProp="children" placeholder="请选择业务模式" >
          <Option key="delivery_state_0" value="">全部</Option>
          <Option key="delivery_state_1" value="5">已创建</Option>
          <Option key="delivery_state_2" value="10">待分配</Option>
          <Option key="delivery_state_3" value="15">已分配</Option>
          <Option key="delivery_state_4" value="20">已接单</Option>
          <Option key="delivery_state_5" value="22">已到店</Option>
          <Option key="delivery_state_6" value="24">已取货</Option>
          <Option key="delivery_state_8" value="-50">异常</Option>
          <Option key="delivery_state_9" value="100">已送达</Option>
          <Option key="delivery_state_10" value="-100">已取消</Option>
        </Select>,
      )
    )
  }

  // 订单状态
  renderOrderStatus() {
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('state', { initialValue: '' })(
        <Select showSearch optionFilterProp="children" placeholder="请选择订单状态" >
          <Option key="delivery_state_0" value="">全部</Option>
          <Option key="delivery_state_1" value="5">已创建</Option>
          <Option key="delivery_state_2" value="10">待分配</Option>
          <Option key="delivery_state_3" value="15">已分配</Option>
          <Option key="delivery_state_4" value="15|16">待接单</Option>
          <Option key="delivery_state_4" value="20">已接单</Option>
          <Option key="delivery_state_5" value="22">已到店</Option>
          <Option key="delivery_state_6" value="24">已取货</Option>
          <Option key="delivery_state_9" value="100">已送达</Option>
          <Option key="delivery_state_8" value="-50">异常</Option>
          <Option key="delivery_state_10" value="-100">已取消</Option>
          <Option key="delivery_state_10" value="5|10|15|16|20|22|24|-50">未完成</Option>
        </Select>,
      )
    )
  }

  // 商家类型
  renderSellType() {
    const { getFieldDecorator } = this.props.form;
    const { sellerTypeCB } = this.props;
    const { handleSelect } = this;
    return (
      getFieldDecorator('seller_type')(
        <Select className="seller_type" showSearch optionFilterProp="children" placeholder="请选择商家类型" onChange={sellerTypeCB} onSelect={handleSelect}>
          <Option value="">全部</Option>
          <Option key="delivery_state_1" value="10">直营商家</Option>
          <Option key="delivery_state_2" value="20">加盟商家</Option>
        </Select>,
      )
    )
  }

  // 商家名称
  renderSellName() {
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('seller_id')(
        <Input {...{ placeholder: '请输入商家名称' }} />,
      )
    )
  }

  // 骑士手机
  renderCourierMobile() {
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('courier_mobile')(
        <Input {...{ placeholder: '请输入骑士手机' }} />,
      )
    )
  }

  // 下单时间
  renderOrdersTime() {
    const { getFieldDecorator } = this.props.form;
    const { disabledDate } = this;
    return (
      getFieldDecorator('orders_time', {
        format: 'YYYY-MM-DD HH:mm',
      })(
        <RangePicker
          disabledDate={disabledDate}
        />,
        )
    )
  }

  // 期望送达时间
  renderExpectDeliveryTime() {
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('expect_delivery_time', {
        format: 'YYYY-MM-DD HH:mm',
      })(
        <RangePicker />,
        )
    )
  }

  // 送达时间
  renderDeliveryTime() {
    const { getFieldDecorator } = this.props.form;
    const { disabledDate } = this;
    return (
      getFieldDecorator('delivery_time', {
        format: 'YYYY-MM-DD HH:mm',
      })(
        <RangePicker
          disabledDate={disabledDate}
        />,
        )
    )
  }

  // 条形编码
  renderScan() {
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('scan')(
        <Input {...{ placeholder: '请输入条形编码' }} />,
      )
    )
  }

  // 顾客电话
  renderClientPhone() {
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('client_phone')(
        <Input {...{ placeholder: '请输入顾客电话' }} />,
      )
    )
  }

  // 结算方式
  renderCloseWay() {
    const { getFieldDecorator } = this.props.form;
    const { sellerTypeCB } = this.props;
    return (
      getFieldDecorator('close_way')(
        <Select className="close_way" showSearch optionFilterProp="children" placeholder="请选择结算方式" onChange={sellerTypeCB}>
          <Option value="">全部</Option>
          <Option key="delivery_state_1" value="10">直营商家</Option>
          <Option key="delivery_state_2" value="20">加盟商家</Option>
        </Select>,
      )
    )
  }

  // 配送站
  renderDeliveryStand() {
    const { getFieldDecorator } = this.props.form;
    const { sellerTypeCB } = this.props;
    return (
      getFieldDecorator('delivery_stand')(
        <Select className="delivery_stand" showSearch optionFilterProp="children" placeholder="请选择配送站" onChange={sellerTypeCB}>
          <Option value="">全部</Option>
          <Option key="delivery_state_1" value="10">直营商家</Option>
          <Option key="delivery_state_2" value="20">加盟商家</Option>
        </Select>,
      )
    )
  }

  // 取件区域
  renderGetArea() {
    const { getFieldDecorator } = this.props.form;
    const { sellerTypeCB } = this.props;
    return (
      getFieldDecorator('get_area')(
        <Select className="get_area" showSearch optionFilterProp="children" placeholder="请选择取件区域" onChange={sellerTypeCB}>
          <Option value="">全部</Option>
          <Option key="delivery_state_1" value="10">直营商家</Option>
          <Option key="delivery_state_2" value="20">加盟商家</Option>
        </Select>,
      )
    )
  }

  // 返回对应的模块
  renderCallBack(label) {
    const {
      renderAreaName,
      renderOrderNum,
      renderBusinessPattern,
      renderOrderType,
      renderOrderStatus,
      renderSellType,
      renderSellName,
      renderOrdersTime,
      renderDeliveryTime,
      renderExpectDeliveryTime,
      renderScan,
      renderClientPhone,
      renderCloseWay,
      renderDeliveryStand,
      renderGetArea,
      renderCourierMobile,
        } = this;
    let callback = ''
    switch (label) {
      case '配送区域':
        callback = renderAreaName
        break;
      case '订单编号':
        callback = renderOrderNum
        break;
      case '订单类型':
        callback = renderOrderType
        break;
      case '状态':
        callback = renderOrderStatus
        break;
      case '商家类型':
        callback = renderSellType
        break;
      case '商家名称':
        callback = renderSellName
        break;
      case '顾客电话':
        callback = renderClientPhone
        break;
      case '下单时间':
        callback = renderOrdersTime
        break;
      case '期望送达时间':
        callback = renderExpectDeliveryTime
        break;
      case '送达时间':
        callback = renderDeliveryTime
        break;
      case '条形编码':
        callback = renderScan
        break;
      case '业务模式':
        callback = renderBusinessPattern
        break;
      case '结算方式':
        callback = renderCloseWay
        break;
      case '配送站':
        callback = renderDeliveryStand
        break;
      case '取件区域':
        callback = renderGetArea
        break;
      case '骑士手机':
        callback = renderCourierMobile
        break;
      default:
        break;
    }
    return callback && callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      handleSubmit,
      renderCallBack,
        } = this;
    const { options } = this.state
    const { itemLayout } = this.private;
    return (
      <div className="bd-header">
        <Form layout="horizontal" className="ant-advanced-search-form" onSubmit={handleSubmit}>
          <Row gutter={24}>
            {
              options.map((item, index) => {
                if (item.checked) {
                  return <Col key={index} sm={8}><FormItem label={item.label} {...itemLayout} >{renderCallBack(item.label)}</FormItem></Col>
                }
              })
            }
            <Col sm={8}>
              <FormItem label="" {...itemLayout} >
                <Button type="primary" htmlType="submit" >查询</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

module.exports = Form.create()(Search);
