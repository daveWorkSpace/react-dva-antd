import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button, Radio, TimePicker, InputNumber, Modal } from 'antd';

import { authorize } from '../../../../application';
import { ServiceState, BusinessMode, DeliveryMode, DeliveryType, PriceMode, PriceType, Unit, RegionRule } from '../../../../application/define';
import { Service, PricePlan } from '../../../../application/object/';
import Helper from '../../../../application/service/helper'
import { PriceFormComponent } from './price';
import { CoreForm, CoreContent } from '../../../core';

const ComponentMode = {
  update: 'update',    //编辑表单模式
  create: 'create',    //创建表单模式
  rule: 'rule',        //签约信息模式
}

const radioStyle = {
  display: 'block'
}

class ServiceFormComponent extends React.Component {
  constructor(props) {
    super();
    const { detail, onSubmit, onCancle, componentMode } = props;

    this.state = {
      businessTimeStart: dot.get(detail, 'businessTime.start', '8:00'),     //开始营业时间（默认8:00）
      businessTimeFinish: dot.get(detail, 'businessTime.finish', '22:00'),  //结束营业时间（默认22:00）
      deliveryDistanceMin: dot.get(detail, 'deliveryDistanceMin', 0),       //距离限制，最小3km
      deliveryDistanceMax: dot.get(detail, 'deliveryDistanceMax', 10),      //距离限制，最大10km

      serviceState: dot.get(detail, 'serviceState.value', ServiceState.off),            //服务状态
      businessMode: dot.get(detail, 'businessMode.value', BusinessMode.localLife),      //本地生活圈
      deliveryMode: dot.get(detail, 'deliveryMode.value', DeliveryMode.immediateMode),  //即时达
      priceMode: dot.get(detail, 'priceMode.value', PriceMode.standPriceMode),          //定价模式

      newPriceMode: '', //控件内部的价格设置
      componentMode,    //模块的模式

      detail,   //信息详情
      onSubmit, //提价回调函数
      onCancle, //取消提交函数
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const { detail, onSubmit, onCancle } = nextProps;
    const { componentMode } = this.state;
    const state = {
      detail,
      onSubmit,
      onCancle,
    }
    //如果是加载详情，则从详情中获取数据
    if (componentMode === ComponentMode.update && (is.empty(dot.get(this.state, 'detail.id')) || is.not.existy(dot.get(this.state, 'detail.id')))) {
      state.businessTimeStart = dot.get(detail, 'businessTime.start', '8:00');     //开始营业时间（默认8:00）
      state.businessTimeFinish = dot.get(detail, 'businessTime.finish', '22:00');  //结束营业时间（默认22:00）
      state.deliveryDistanceMin = dot.get(detail, 'deliveryDistanceMin', 0);       //距离限制，最小3km
      state.deliveryDistanceMax = dot.get(detail, 'deliveryDistanceMax', 10);      //距离限制，最大10km

      state.serviceState = dot.get(detail, 'serviceState.value', ServiceState.off);            //服务状态
      state.businessMode = dot.get(detail, 'businessMode.value', BusinessMode.localLife);      //本地生活圈
      state.deliveryMode = dot.get(detail, 'deliveryMode.value', DeliveryMode.immediateMode);  //即时达
      state.priceMode = dot.get(detail, 'priceMode.value', PriceMode.standPriceMode);          //定价模式
    }
    this.setState(state);
  }

  onConfirm = (e) => {
    const { componentMode } = this.state;
    const { onSubmit } = this;

    e.preventDefault();

    //判断是否是创建，如果是创建，直接调用submit，不进行二次确认
    if (componentMode === ComponentMode.create) {
      onSubmit(e);
      return;
    }

    //二次确认
    Modal.confirm({
      title: '本次签约记录修改保存后立即生效，确认保存?',
      onOk() {
        onSubmit(e);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  //提交表单
  onSubmit = (e) => {
    const { detail, onSubmit } = this.state;

    const transform = (value, type) => {
      return { name: type.description(value), value };
    }

    this.props.form.validateFields((err, values) => {
      if (!err) {
        //获取业务时间
        const businessTimeStart = dot.get(values, 'businessTimeStart');
        const businessTimeFinish = dot.get(values, 'businessTimeFinish');

        //本地表单数据
        const service = new Service();
        service.name = dot.get(values, 'name');
        service.serviceState = transform(dot.get(values, 'serviceState'), ServiceState);
        service.businessMode = transform(dot.get(values, 'businessMode'), BusinessMode);
        service.businessTime = {
          start: moment(businessTimeStart).format('HH:mm'),
          finish: moment(businessTimeFinish).format('HH:mm'),
        };
        service.deliveryTime = dot.get(values, 'deliveryTime');
        service.deliveryMode = transform(dot.get(values, 'deliveryMode'), DeliveryMode);
        service.deliveryDistanceMax = Unit.exchangeDistanceToMetre(dot.get(values, 'deliveryDistanceMax', 0));
        service.priceMode = transform(dot.get(values, 'priceMode'), PriceMode);
        service.regionRule = transform(dot.get(values, 'regionRule'), RegionRule);

        //判断是否是一口价模式
        if (service.priceMode.value === PriceMode.standPriceMode) {
          const pricePlan = new PricePlan();
          pricePlan.priceBase = dot.get(values, 'standPrice');
          service.pricePlan.push(pricePlan);
        } else {
          console.log(values.pricePlan);
          service.priceType = transform(dot.get(values, 'priceType'), PriceType);
          service.pricePlan = values.pricePlan;
        }

        //如果详情数据不存在，则不返回id和vendorId
        if (is.existy(detail) && is.not.empty(detail)) {
          service.id = dot.get(detail, 'id');
          service.vendorId = dot.get(detail, 'vendorId');
        } else {
          //默认的vendor id 为当前账户的vendorid
          service.vendorId = authorize.vendor.id;
        }

        //从原始配置中获取
        service.deliveryType = dot.get(detail, 'deliveryType', DeliveryType.deliveryBySeller);
        service.deliveryDistanceMin = dot.get(detail, 'deliveryDistanceMin', 0);

        onSubmit(service);
      }
    });
  }

  //取消，返回上一页面
  onCancle = () => {
    this.state.onCancle();
  }

  //修改业务开始时间
  onChangebusinessTimeStart = (time, timeString) => { this.setState({ businessTimeStart: timeString }) }

  //修改业务完成时间
  onChangebusinessTimeFinish = (time, timeString) => { this.setState({ businessTimeFinish: timeString }) }

  //修改服务状态
  onChangeServiceState = (e) => { this.setState({ serviceState: e.target.value }) };

  //修改业务模式
  onChangeBusinessMode = (e) => { this.setState({ businessMode: e.target.value }) };

  //修改定价模式
  onChangeDeliveryMode = (e) => { this.setState({ deliveryMode: e.target.value }) };

  //修改判区规则
  onChangeRegionRule = (e) => { this.setState({ regionRule: e.target.value }) };

  //渲染基本信息
  renderBaseInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { businessTimeStart, businessTimeFinish, serviceState, businessMode, detail, componentMode } = this.state;
    const { onChangebusinessTimeStart, onChangebusinessTimeFinish, onChangeServiceState, onChangeBusinessMode, onChangeDeliveryMode } = this;
    let { deliveryMode } = this.state;

    //判断如果不是本地生活圈，不能使用即使达
    const isDisableImmediateMode = businessMode !== BusinessMode.localLife;

    //判断配送模式，如果不能使用即使达，默认使用预约达
    deliveryMode = isDisableImmediateMode === true ? DeliveryMode.scheduleMode : deliveryMode;

    //时间选择器参数
    const timePickerProps = {
      disabledMinutes: () => {
        return Helper.range(0, 60).filter((value) => {
          if ([0, 30, 59].includes(value)) {
            return false;
          }
          return true;
        })
      },
      hideDisabledOptions: true,
      format: 'HH:mm',
    }

    const title = '产品基本信息';
    const titleTip = (
      <div>
        <p>基本信息说明：</p>
        <p>1.业务模式：</p>
        <p>1】本地生活圈：适合只涉及到末端配送类业务</p>
        <p>2】落地配不带存储：适合过仓类，商家自己发货的业务；</p>
        <p>3】落地配带存储：暂不支持</p>
        <p>4】同城快递：适合快递揽收类业务</p>
        <p>2.营业时间：请根据物流服务时间定；系统或根据营业时间（即时达业务：营业时间外下单系统拒单；预约达业务：要求营业时间外送达业务系统拒单）；</p>
        <p>3.即时达：指下单即送的业务，需设置配送时间（服务商与商家定义会在配送时间内送达），商家指定送达时间不能小于配送时间；</p>
        <p>4.预约达：指商家预约送达的业务，由商家指定日期时间送达（商家不指定默认为营业时间内送达均可），包括当日或次日</p>
      </div>
    )

    const formItems = [
      {
        label: '产品名称',
        form: (
          getFieldDecorator('name', {
            rules: [{ required: true, max: 10, message: '请输入产品名称，长度10个字之内', whitespace: true }],
            initialValue: dot.get(detail, 'name', ''),
          })(
            <Input placeholder="产品名称" disabled={componentMode === ComponentMode.rule} />,
          )
        ),
      },
      {
        label: '营业时间 开始时间',
        form: (
          getFieldDecorator('businessTimeStart', {
            rules: [{ required: true, message: '请选择营业开始时间' }],
            initialValue: moment(businessTimeStart, 'HH:mm'),
          })(
            <TimePicker {...timePickerProps} onChange={onChangebusinessTimeStart} />,
          )
        ),
      },
      {
        label: '结束时间',
        form: (
          getFieldDecorator('businessTimeFinish', {
            rules: [{ required: true, message: '请选择营业结束时间' }],
            initialValue: moment(businessTimeFinish, 'HH:mm'),
          })(
            <TimePicker {...timePickerProps} onChange={onChangebusinessTimeFinish} />,
          )
        ),
      },
    ];

    //如果是编辑规则模式，不显示产品状态
    if (componentMode !== ComponentMode.rule) {
      formItems.push({
        label: '产品状态',
        form: (
          getFieldDecorator('serviceState', {
            initialValue: serviceState,
            rules: [{ required: true, message: '请选择产品状态' }],
          })(
            <Radio.Group onChange={onChangeServiceState}>
              <Radio value={ServiceState.on}>{ServiceState.description(ServiceState.on)}</Radio>
              <Radio value={ServiceState.off}>{ServiceState.description(ServiceState.off)}</Radio>
            </Radio.Group>,
          )
        ),
      })
    }

    formItems.push({
      label: '业务模式',
      form: (
        getFieldDecorator('businessMode', {
          initialValue: businessMode,
          rules: [{ required: true, message: '请选择业务模式' }],
        })(
          //只有创建的模式下，该模块才能进行编辑
          <Radio.Group onChange={onChangeBusinessMode} disabled={componentMode !== ComponentMode.create}>
            <Radio value={BusinessMode.localLife}>{BusinessMode.description(BusinessMode.localLife)}</Radio>
            <Radio value={BusinessMode.noStorage}>{BusinessMode.description(BusinessMode.noStorage)}</Radio>
            <Radio value={BusinessMode.localCity}>{BusinessMode.description(BusinessMode.localCity)}</Radio>
          </Radio.Group>,
        )
      ),
    })

    //判断，如果不是本地生活圈，默认选择预约达模式。
    if (isDisableImmediateMode === false) {
      formItems.push({
        label: '配送模式',
        form: (
          getFieldDecorator('deliveryMode', {
            initialValue: deliveryMode,
            rules: [{ required: true, message: '请选择配送模式' }],
          })(
            <Radio.Group onChange={onChangeDeliveryMode}>
              <Radio value={DeliveryMode.immediateMode}>{DeliveryMode.description(DeliveryMode.immediateMode)}</Radio>
              <Radio value={DeliveryMode.scheduleMode}>{DeliveryMode.description(DeliveryMode.scheduleMode)}</Radio>
            </Radio.Group>,
          )
        ),
      });
    } else {
      formItems.push({
        label: '配送模式',
        form: (
          getFieldDecorator('deliveryMode', {
            //判断，如果不是本地生活圈，默认选择预约达模式。
            initialValue: deliveryMode || DeliveryMode.scheduleMode,
          })(
            <Radio.Group onChange={onChangeDeliveryMode}>
              <Radio value={DeliveryMode.scheduleMode}>{DeliveryMode.description(DeliveryMode.scheduleMode)}</Radio>
            </Radio.Group>,
          )
        ),
      });
    }

    //判断，如果是即使达模式，显示配送时间选项
    if (deliveryMode === DeliveryMode.immediateMode) {
      formItems.push({
        label: '配送时间',
        form: (
          <div>
            {getFieldDecorator('deliveryTime', {
              initialValue: dot.get(detail, 'deliveryTime', 120),
            })(<InputNumber min={1} />)
            } 分钟
          </div>
        ),
      })
    }

    return (
      <CoreContent title={title} titleTip={titleTip} >
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  //渲染接单规则限制
  renderOptionRules = () => {
    const { getFieldDecorator } = this.props.form;
    const { detail, deliveryDistanceMin, deliveryDistanceMax, componentMode, businessMode } = this.state;
    const { onChangeRegionRule } = this;

    //设置距离限制
    const onChangedeliveryDistanceMax = (value) => {
      this.setState({
        deliveryDistanceMax: value,
      })
    }

    const title = '接单规则限制（选填）';
    const titleTip = (
      <div>
        <p>接单规则限制说明：</p>
        <p>1.若设置最大配送距离，订单配送距离及定价设置按距离定价不能大于最大限制数；</p>
        <p>2.配送距离：指末端取货地址与送货地址之间骑行距离；</p>
      </div>
    )
    const formItems = [{
      label: '距离限制',
      layout: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
      form: (
        <div>
          请输入距离&nbsp;
          {getFieldDecorator('deliveryDistanceMax', {
            initialValue: deliveryDistanceMax,
          })(
            <InputNumber step={1} min={deliveryDistanceMin} onChange={onChangedeliveryDistanceMax} />,
          )}
          km &nbsp; (默认10km限制; 0km表示没有距离限制)
        </div>
      ),
    }, {
      label: '判区规则',
      form: (
        getFieldDecorator('areaRules', {
          initialValue: '0',
        })(
          <Radio.Group>
            <Radio style={radioStyle} value={'0'}>{'收货地在配送区域内'}</Radio>
            <Radio style={radioStyle} value={'1'}>{'取货地与收货地均在配送区域内'}</Radio>
            <Radio style={radioStyle} value={'2'}>{'取货地与收货地在同一配送区域内'}</Radio>
          </Radio.Group>,
        )
      ),
    }];

    // 判断是否显示判区规则
    if (componentMode === ComponentMode.rule) {
      // 判区规则模块
      //本地生活圈：1】发货地在配送区域内；2】发货地与收货地均在配送区域内；3】发货地与收货地在同一配送区域内；
      //落地配（无存储）：1】发货地与收货地均在配送区域内；2】发货地与收货地在同一配送区域内；3】收货地在配送区域内；
      //同城快递：1】发货地与收货地均在配送区域内；2】发货地与收货地在同一配送区域内
      let regionRules = [];
      if (businessMode === BusinessMode.localLife) {
        regionRules = [
          RegionRule.A,
          RegionRule.B,
          RegionRule.D,
        ]
      } else if (businessMode === BusinessMode.noStorage) {
        regionRules = [
          RegionRule.A,
          RegionRule.C,
          RegionRule.D,
        ]
      } else if (businessMode === BusinessMode.localCity) {
        regionRules = [
          RegionRule.A,
          RegionRule.D,
        ]
      }
      formItems.push({
        label: '判区规则',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
        form: (
          <div>
            {getFieldDecorator('regionRule', {
              initialValue: dot.get(detail, 'regionRule.value'),
            })(
              <Radio.Group onChange={onChangeRegionRule}>
                {regionRules.map((rule) => {
                  return <Radio key={rule} value={rule}>{RegionRule.description(rule)}</Radio>
                })}
              </Radio.Group>,
            )}
          </div>
          ),
      })
    }
    return (
      <CoreContent title={title} titleTip={titleTip} >
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  //修改定价模式
  onChangePirceMode = (e) => {
    this.setState({ newPriceMode: e.target.value })
  }

  //渲染阶梯定价模块
  renderPrice = () => {
    const { getFieldDecorator } = this.props.form;
    const { getStandPriceFormItems, getLevelPriceFormItems, onChangePirceMode } = this;
    const { detail, priceMode, newPriceMode } = this.state;

    //判断是否设置定价数据
    let mode = priceMode;
    if (is.existy(newPriceMode) && is.not.empty(newPriceMode) && newPriceMode !== '') {
      mode = newPriceMode;
    }

    const title = '产品定价';
    const titleTip = (
      <div>
        <p>定价规则说明：</p>
        <p>1.产品启用后立即生效，该产品为标准产品，商家签约后可根据不同的商家需求进行自定义修改；</p>
        <p>2.时间分段：</p>
        <p>1】不能设置营业时间之外的时间；</p>
        <p>2】时间分段必须覆盖所有营业时间段；</p>
        <p>3.距离分段：</p>
        <p>1】距离是配送距离：指配送端取货地址与送货地址之间的行驶距离</p>
        <p>2】若有距离限制，距离设置不能大于最大距离</p>
        <p>3】后面的距离设置不能小于前面的距离；</p>
        <p>4.价格计算：基准费＋附加费（基准费距离跟随距离分段输入值变化）</p>
        <p>5.分成方案：设置骑士提成百分比（配送费分成百分比+小费分成百分比）;</p>
        <p>6.该定价方案为商家配送费计算规则：</p>
        <p>1】时间取值为订单预计送达时间；</p>
        <p>2】距离取值为配送距离：指配送端取货地址与顾客地址之间行驶距离。</p>
      </div>
    );

    let formItems = [
      {
        label: '定价模式',
        form: (
          getFieldDecorator('priceMode', {
            initialValue: mode,
            rules: [{ required: true, message: '请选择定价模式' }],
          })(
            <Radio.Group onChange={onChangePirceMode}>
              <Radio value={PriceMode.levelPriceMode}>{PriceMode.description(PriceMode.levelPriceMode)}</Radio>
              <Radio value={PriceMode.standPriceMode}>{PriceMode.description(PriceMode.standPriceMode)}</Radio>
            </Radio.Group>,
          )
        ),
      },
    ];

    //判断如果是一口价，渲染一口价模块
    if (mode === PriceMode.standPriceMode) {
      const items = getStandPriceFormItems()
      formItems = formItems.concat(items);
    }

    //判断如果是阶梯定价，渲染阶梯定价模块
    if (mode === PriceMode.levelPriceMode) {
      const items = getLevelPriceFormItems()
      formItems = formItems.concat(items);
    }

    return (
      <CoreContent title={title} titleTip={titleTip} >
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  //一口价
  getStandPriceFormItems = () => {
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.state;

    const formItems = [
      {
        label: '定价方案',
        form: (
          <div>
            {getFieldDecorator('standPrice', {
              initialValue: dot.get(detail, 'pricePlan.0.priceBase', '3'),
            })(
              <InputNumber min={1} max={5000} />,
            )}元／单
          </div>
        ),
      },
      {
        label: '说明',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
        form: (
          <div>一口价，一律按订单计价，所有订单配送费不分距离、时间如：设置费用5元/单，1单配送费为5元</div>
        ),
      },
    ];
    return formItems;
  }

  //阶梯定价
  getLevelPriceFormItems = () => {
    const { getFieldDecorator } = this.props.form;
    const { deliveryDistanceMin, deliveryDistanceMax, businessTimeStart, businessTimeFinish, detail } = this.state;

    const props = {
      deliveryDistanceMin,
      deliveryDistanceMax,
      businessTimeStart,
      businessTimeFinish,
    };
    let pricePlan;
    if (dot.get(detail, 'priceMode.value') === PriceMode.levelPriceMode) {
      pricePlan = dot.get(detail, 'pricePlan');
    }

    const formItems = [
      {
        label: '定价方案',
        form: (
          <div>
            {getFieldDecorator('priceType', {
              initialValue: 21,
              rules: [{ required: true, message: '定价方案不能为空' }],
            })(
              <Radio.Group>
                <Radio value={21}>距离加时间阶梯价</Radio>
              </Radio.Group>,
            )}
          </div>
        ),
      },
      {
        label: '',
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: (
          getFieldDecorator('pricePlan', {
            initialValue: pricePlan,
            rules: [{ required: true, message: '阶梯定价数据不能为空' }],
          })(
            <PriceFormComponent {...props} />,
          )
        ),
      },
    ];

    return formItems;
  }

  //渲染页面
  render() {
    const { getFieldDecorator } = this.props.form;
    const { renderBaseInfo, renderOptionRules, renderPrice } = this;

    return (
      <Form className="ant-advanced-search-form" onSubmit={this.onConfirm} hideRequiredMark={false}>

        {/* 产品基本信息 */}
        {renderBaseInfo()}

        {/* 接单规则限制 */}
        {renderOptionRules()}

        {/* 产品定价，阶梯定价 */}
        {renderPrice()}

        <div className="bd-content">
          <div className="content" style={{ backgroundColor: 'rgba(255, 255, 255, 0)!important' }}>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button size="large" onClick={this.onCancle}>返回</Button>
                <Button size="large" type="primary" htmlType="submit">保存</Button>
              </Col>
            </Row>
          </div>
        </div>

      </Form>
    )
  }
}

function mapStateToProps() {
  return { };
}

const WrappedComponent = Form.create()(ServiceFormComponent);
module.exports.ServiceFormComponent = WrappedComponent;
