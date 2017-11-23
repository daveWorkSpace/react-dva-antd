import React, { Component, PropTypes } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Row, Col, Form, Button } from 'antd';
import { ServiceState, BusinessMode, DeliveryMode, PriceMode } from '../../../../application/define';
import { CoreForm, CoreContent } from '../../../core';
import { PriceDetailComponent } from './price';

class ServiceDetailComponent extends React.Component {
  constructor(props) {
    super();
    const { detail, isShowContract, isShowRegionRule } = props;
    this.state = {
      detail,           //产品服务信息
      isShowContract,   //是否显示签约信息
      isShowRegionRule, //是否显示判区规则
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { detail, isShowContract, isShowRegionRule } = nextProps
    this.setState({ detail, isShowContract, isShowRegionRule });
  }

  //渲染签约信息
  renderContractInfo = () => {
    const { detail, isShowContract } = this.state;

    //判断是否显示签约信息
    if (isShowContract !== true) {
      return <div />
    }

    let signedTime = dot.get(detail, 'contract.createTime.name', '-- --');
    let cancleTime = dot.get(detail, 'contract.cancleTime.name', '-- --');
    if (cancleTime === '') {
      cancleTime = '-- --'
    }

    // 签约状态
    const serviceState = dot.get(detail, 'serviceState.value');
    if (serviceState === ServiceState.off) {
      signedTime = '-- --'
    }

    const title = '签约信息';
    const formItems = [
      {
        label: '签约ID',
        form: <span>{dot.get(detail, 'contract.id')}</span>,
      },
      {
        label: '签约状态',
        form: <span>{dot.get(detail, 'serviceState.name')}</span>,
      },
      {
        label: '签约时间',
        form: <span>{signedTime}</span>,
      },
      {
        label: '解约时间',
        form: <span>{cancleTime}</span>,
      },
      {
        label: '修改时间',
        form: <span>{dot.get(detail, 'contract.updateTime.name')}</span>,
      },
    ];

    return (
      <CoreContent title={title}>
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  //渲染基本信息
  renderBaseInfo = () => {
    const { detail } = this.state;

    const title = '产品基本信息';
    const formItems = [
      {
        label: '产品名称',
        form: <span>{detail.name}</span>,
      },
      {
        label: '营业时间',
        form: <span>{dot.get(detail, 'businessTime.start')} ~ {dot.get(detail, 'businessTime.finish')}</span>,
      },
      {
        label: '产品状态',
        form: <span>{dot.get(detail, 'serviceState.name')}</span>,
      },
      {
        label: '业务模式',
        form: <span>{dot.get(detail, 'businessMode.name')}</span>,
      },
      {
        label: '配送模式',
        form: <span>{dot.get(detail, 'deliveryMode.name')}</span>,
      },
      {
        label: '发货方式',
        form: <span>{dot.get(detail, 'deliveryType.name')}</span>,
      },
    ];

    //判断，如果是即使达模式，显示配送时间选项
    if (dot.get(detail, 'deliveryMode.value') === DeliveryMode.immediateMode) {
      formItems.push({
        label: '配送时间',
        form: <div>{detail.deliveryTime}分钟</div>,
      })
    }
    return (
      <CoreContent title={title}>
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  //渲染规则信息
  renderOptionRules = () => {
    const { detail, isShowRegionRule } = this.state;
    const title = '接单规则限制（选填）';
    const formItems = [{
      label: '距离限制',
      form: <span>{detail.deliveryDistanceMax || 0}km</span>,
    }];
    if (isShowRegionRule === true) {
      formItems.push({
        label: '判区规则',
        form: <span>{dot.get(detail, 'regionRule.name')}</span>,
      })
    }
    return (
      <CoreContent title={title}>
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  //显然价格
  renderPrice = () => {
    const { renderLevelPrice, renderStandPrice } = this;
    const { detail } = this.state;

    console.log('renderPrice', dot.get(detail, 'priceMode'), PriceMode.standPriceMode);

    //显示一口价
    if (dot.get(detail, 'priceMode.value') === PriceMode.standPriceMode) {
      return renderStandPrice();
    }

    //显示阶梯定价
    if (dot.get(detail, 'priceMode.value') === PriceMode.levelPriceMode) {
      return renderLevelPrice();
    }

    return <div />
  }

  //一口价
  renderStandPrice = () => {
    const { detail } = this.state;
    const title = '产品定价';
    const formItems = [
      {
        label: '定价方案',
        form: <span>{dot.get(detail, 'pricePlan.0.priceBase')}元／单</span>,
      },
      {
        label: '说明',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: (
          <div>一口价，一律按订单计价，所有订单配送费不分距离、时间如：设置费用5元/单，1单配送费为5元</div>
        ),
      },
    ];
    return (
      <CoreContent title={title}>
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  //阶梯定价
  renderLevelPrice = () => {
    const { detail } = this.state;
    const priceComponentProps = {
      pricePlan: detail.pricePlan,
    };

    const title = '产品定价';
    const formItems = [
      {
        label: '定价方案',
        form: <span>距离加时间阶梯价</span>,
      },
      {
        label: '',
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: (
          <PriceDetailComponent params={priceComponentProps} />
        ),
      },
    ];

    return (
      <CoreContent title={title}>
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  //渲染页面
  render() {
    const { renderContractInfo, renderBaseInfo, renderOptionRules, renderPrice } = this;

    return (
      <div>
        {/* 渲染签约信息 */}
        {renderContractInfo()}

        {/* 产品基本信息 */}
        {renderBaseInfo()}

        {/* 接单规则限制 */}
        {renderOptionRules()}

        {/* 产品定价，阶梯定价 */}
        {renderPrice()}
      </div>
    )
  }
}

module.exports.ServiceDetailComponent = ServiceDetailComponent;
