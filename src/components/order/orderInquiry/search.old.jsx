import React, { Component, PropTypes } from 'react';
import dot from 'dot-prop';
import { Form, Row, Col, Input, Button, Checkbox, Icon, Select, DatePicker, Popover, Modal } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';

const [FormItem, Option, RangePicker, CheckboxGroup] = [Form.Item, Select.Option, DatePicker.RangePicker, Checkbox.Group];

import style from './style.less';

class Search extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sellersList: props.sellersList,
      visible: false,
      options: [
        {
          label: '配送区域',
          value: '配送区域',
          checked: false,
        },
        {
          label: '订单编号',
          value: '订单编号',
          checked: true,
        },
        {
          label: '订单类型',
          value: '订单类型',
          checked: false,
        },
        {
          label: '订单状态',
          value: '订单状态',
          checked: true,
        },
        {
          label: '期望送达时间',
          value: '期望送达时间',
          checked: true,
        },
        {
          label: '商家类型',
          value: '商家类型',
          checked: true,
        },
        {
          label: '商家名称',
          value: '商家名称',
          checked: true,
        },
        {
          label: '顾客电话',
          value: '顾客电话',
          checked: false,
        },
        {
          label: '下单时间',
          value: '下单时间',
          checked: false,
        },
        {
          label: '条形编码',
          value: '条形编码',
          checked: false,
        },
        {
          label: '业务模式',
          value: '业务模式',
          checked: false,
        },
        {
          label: '结算方式',
          value: '结算方式',
          checked: false,
        },
        {
          label: '配送站',
          value: '配送站',
          checked: false,
        },
        {
          label: '取件区域',
          value: '取件区域',
          checked: false,
        },
      ],
    }

    this.private = {
      checkedList: [],
      itemLayout: { labelCol: { span: 7 }, wrapperCol: { span: 14 } },
      dispatch: props.dispatch,
      fetchSellersList: props.fetchSellersList,
      clearSellersList: props.clearSellersList,
    }
    //更多搜索条件框确认按钮
    this.handleOk = this.handleOk.bind(this);
    //更多搜索条件框取消按钮
    this.handleCancel = this.handleCancel.bind(this);
    //显示更多搜索条件框
    this.showModal = this.showModal.bind(this);
    //更多搜索条件
    this.renderMoreSearch = this.renderMoreSearch.bind(this);
    // 多选框状态改变函数
    this.onChange = this.onChange.bind(this);
    // 提交方法
    this.handleSubmit = this.handleSubmit.bind(this);
    //商家类型选择
    this.handleSelectSellerType = this.handleSelectSellerType.bind(this);
    //商家名称
    this.handleSelectSeller = this.handleSelectSeller.bind(this);
    this.handleChangeSeller =this.handleChangeSeller.bind(this);

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
    this.renderScan = this.renderScan.bind(this);
    this.renderClientPhone = this.renderClientPhone.bind(this);
    this.renderCloseWay = this.renderCloseWay.bind(this);
    this.renderDeliveryStand = this.renderDeliveryStand.bind(this);
    this.renderGetArea = this.renderGetArea.bind(this);
    // 返回对应的模块
    this.renderCallBack = this.renderCallBack.bind(this);
  }

  // 
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      sellersList: nextProps.sellersList
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('表单值', e);
    const { onSearch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = values;
        //判断时间
        if (values.expect_delivery_time && values.expect_delivery_time.length === 2) {
          params.startDate = moment(values.expect_delivery_time[0]).format('YYYYMMDD');
          params.endDate = moment(values.expect_delivery_time[1]).format('YYYYMMDD');
        }

        console.log('Received values of form: ', params);
        onSearch(params)
      }
    });
  }

  //商家類型
  handleSelectSellerType(type) {
    const { resetFields } = this.props.form;
    const { dispatch, fetchSellersList, clearSellersList } = this.private;
    //重置商家
    resetFields(['seller_id'])
    dispatch({
      type: clearSellersList
    });
    dispatch({
      type: fetchSellersList,
      payload: { type: type }
    });
  }
  // 商家类型 onChange 
  handleChangeSellerType(){

  }
  // 选择商家名称
  handleSelectSeller(value){
    console.log('选择商家名称', value);
  }
  // 商家名称
  handleChangeSeller = () => {

  }
  //获取日期选择器组件值
  getRangePickerValue(date, dateString) {
    return dateString
  }

  //控制日期时间，超过今天不可选
  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }

  //显示更多搜索条件框
  showModal() {
    this.setState({
      visible: true,
    });
  }

  //更多搜索条件框确认按钮
  handleOk(e) {
    console.log(e);
    const { checkedList } = this.private;
    const { options } = this.state;
    // 取消所有显示项
    for (let x = 0, y = options.length; x < y; x++) {
      options[x].checked = false;
    }
    // 显示当前选中的选项
    for (let i = 0, j = checkedList.length; i < j; i++) {
      for (let x = 0, y = options.length; x < y; x++) {
        if (checkedList[i] === options[x].value) {
          options[x].checked = true;
          break;
        }
      }
    }

    this.setState({
      visible: false,
      options,
    });
  }

  //更多搜索条件框取消按钮
  handleCancel(e) {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  // 多选框状态改变函数
  onChange(checkedValues) {
    this.private.checkedList = checkedValues
    console.log('checked = ', this.private.checkedList)
  }

  //更多搜索条件
  renderMoreSearch() {
    const { options } = this.state
    const checkedList = [];
    for (let i = 0, j = options.length; i < j; i++) {
      if (options[i].checked) {
        checkedList.push(options[i].value)
      }
    }
    return (
      <Modal
        title="选择搜索条件"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <CheckboxGroup
          onChange={this.onChange}
          defaultValue={checkedList}
        >
          <Row>
            {
              options.map((item, index) => {
                return <Col key={index} span={8}> <Checkbox value={item.value}>{item.label}</Checkbox> </Col>
              })
            }
          </Row>
        </CheckboxGroup>
      </Modal>
    )
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
          <Option key="delivery_state_1" value="1">已创建</Option>
          <Option key="delivery_state_2" value="25">已确认</Option>
          <Option key="delivery_state_3" value="50">配送中</Option>
          <Option key="delivery_state_4" value="100">已完成</Option>
          <Option key="delivery_state_5" value="-100">已关闭</Option>
          <Option key="delivery_state_6" value="-50">异常</Option>
          <Option key="delivery_state_8" value="1|25|50|-50">未完成</Option>
        </Select>,
      )
    )
  }

  // 商家类型
  renderSellType() {
    const { getFieldDecorator } = this.props.form;
    const { sellerTypeCB } = this.props;
    const { handleChangeSellerType,handleSelectSellerType } = this;
    return (
      getFieldDecorator('seller_type', {
        initialValue: '10'
      })(
        <Select className="seller_type" placeholder="请选择商家类型" onChange={handleSelectSellerType}>
          <Option key="delivery_state_1" value="10">直营商家</Option>
          <Option key="delivery_state_2" value="20">加盟商家</Option>
        </Select>,
      )
    )
  }

  // 商家名称
  renderSellName() {
    const { getFieldDecorator } = this.props.form;
    const { sellersList } = this.state;
    const { handleSelectSeller, handleChangeSeller } = this;

    let selectSellersChildren = [];
    if (dot.has(sellersList, 'data') && sellersList.data.length > 0) {
      selectSellersChildren = sellersList.data.map((item, index) => {
        return <Option key={`${item.id}${index}`} value={item.id}> {item.name} </Option>
      })
    }
    // 切换商户函数  onChange={onSelectSeller} 
    return (
      getFieldDecorator('seller_id')(
        <Select className="seller_type" onSelect={handleSelectSeller} showSearch optionFilterProp="children" placeholder="请选择商家名称">
          {
            selectSellersChildren
          }
        </Select>,
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
        <RangePicker disabledDate={disabledDate} />,
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
      renderExpectDeliveryTime,
      renderScan,
      renderClientPhone,
      renderCloseWay,
      renderDeliveryStand,
      renderGetArea,
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
      case '订单状态':
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
      default:
        break;
    }
    return callback && callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
            handleSubmit,
      renderMoreSearch,
      showModal,
      renderCallBack,
        } = this;
    const { options } = this.state
    const { itemLayout } = this.private;
    const { renderCloseOrder } = this.props;
    return (
      <Form layout="horizontal" className="ant-advanced-search-form" onSubmit={handleSubmit}>
        {
          renderMoreSearch()
        }
        <Row gutter={24}>
          {
            options.map((item, index) => {
              if (item.checked) {
                return <Col key={`${index}-${new Date()}`} sm={8}><FormItem label={item.label} {...itemLayout}>{renderCallBack(item.label)}</FormItem></Col>
              }
            })
          }
          <Col sm={24}>
            <FormItem label="" {...itemLayout} >
              <Button className={style.searchButton} type="primary" htmlType="submit" >查询</Button>
              {/* <Button className={style.searchButton} onClick={showModal}>自定义条件</Button> */}
              <Button className={style.cancelButton} onClick={renderCloseOrder}>批量取消</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

module.exports = Form.create()(Search);
