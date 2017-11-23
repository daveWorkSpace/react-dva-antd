import dot from 'dot-prop';
import React from 'react';
import { Tooltip, Icon } from 'antd';
const { stateTransform, utcToDate } = window.tempAppTool;
import { geography } from '../../../../application';

//订单明细下载 -> 日订单明细
export const DOWNLOAD_DAY_DETAIL = 'DOWNLOAD_DAY_DETAIL';

//订单明细下载 -> 月订单明细
export const DOWNLOAD_MONTH_DETAIL = 'DOWNLOAD_MONTH_DETAIL';

//直营
export const DERECT = 'DERECT';

//加盟
export const AFFILIATE = 'AFFILIATE';

// 添加新项目
export const ADD_NEW_PROJECT = 'ADD_NEW_PROJECT';

// 项目管理 -> 直营 columns
export const DIRECT_PROJECT_COLUMNS = (sellerIdCallback, signStatus, operateCallback) => [
  {
    title: '商户号',
    dataIndex: 'seller_no',
    key: 'seller_no',
    render: (text, record) => {
            // return sellerIdCallback(record)
      return text;
    },
  }, {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record, index) => {
      return text;
    },
  }, {
    title: '签约产品',
    dataIndex: 'service.name',
    key: 'service.name',
  }, {
    title: '签约服务商',
    dataIndex: 'vendor.name',
    key: 'vendor.name',
    render: (text, record, index) => { return text; },
  }, {
    title: '业务模式',
    dataIndex: 'biz_mode',
    key: 'biz_mode',
    render: (text, record, index) => {
      let word = '';
          //业务模式
      switch (text) {
        case 10:
          word = '本地生活圈';
          break;
        case 20:
          word = '落地配（无存储）';
          break;
        case 25:
          word = '落地配（有存储)';
          break;
        case 30:
          word = '同城快递';
          break;
        default:
      }
      return word;
    },
  }, {
    title: '法人姓名',
    dataIndex: 'biz_profile.legal_name',
    key: 'biz_profile.legal_name',
    render: (text, record, index) => { return text; },
  }, {
    title: '联系电话',
    dataIndex: 'mobile',
    key: 'mobile',
    render: (text, record, index) => { return text; },
  }, {
    title: '商户状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record, index) => {
      return stateTransform('seller_state', text);
    },
  }, {
    title: '签约状态',
    dataIndex: 'sign_status',
    key: 'sign_status',
    width: '10%',
    render: (text, record, index) => {
      return signStatus !== '' ? signStatus(record) : text
    },
  }, {
    title: '签约时间',
    dataIndex: 'contract_at',
    key: 'contract_at',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: '15%',
    render: (text, record, index) => {
      return operateCallback(record)
    },
  },
];

// 项目管理 -> 加盟 columns
export const AFFILIATE_PROJECT_COLUMNS = (sellerIdCallback, signStatus, operateCallback) => [
  {
    title: '商户号',
    dataIndex: 'seller_no',
    key: 'seller_no',
    render: (text, record) => {
            // return sellerIdCallback(record)
      return text;
    },
  }, {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record, index) => {
      return text;
    },
  }, {
    title: '签约产品',
    dataIndex: 'service.name',
    key: 'service.name',
  }, {
    title: '签约服务商',
    dataIndex: 'vendor.name',
    key: 'vendor.name',
    render: (text, record, index) => { return text; },
  }, {
    title: '业务模式',
    dataIndex: 'biz_mode',
    key: 'biz_mode',
    render: (text, record, index) => {
      let word = '';
          //业务模式
      switch (text) {
        case 10:
          word = '本地生活圈';
          break;
        case 20:
          word = '落地配（无存储）';
          break;
        case 25:
          word = '落地配（有存储)';
          break;
        case 30:
          word = '同城快递';
          break;
        default:
      }
      return word;
    },
  }, {
    title: '法人姓名',
    dataIndex: 'biz_profile.legal_name',
    key: 'biz_profile.legal_name',
    render: (text, record, index) => { return text; },
  }, {
    title: '联系电话',
    dataIndex: 'mobile',
    key: 'mobile',
    render: (text, record, index) => { return text; },
  }, {
    title: '商户状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record, index) => {
      return stateTransform('seller_state', text);
    },
  }, {
    title: '签约时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: '15%',
    render: (text, record, index) => {
      return operateCallback(record)
    },
  },
];

// 新添加项目
export const ADD_NEW_PROJECT_COLUMNS = operateCallback => [
  {
    title: '商户号',
    dataIndex: 'seller.seller_no',
    key: 'seller.seller_no',
    render: (text, record) => { return text; },
  }, {
    title: '项目名称',
    dataIndex: 'seller.name',
    key: 'seller.name',
    render: (text, record, index) => { return text; },
  }, {
    title: '签约产品',
    dataIndex: 'service.name',
    key: 'service.name',
    render: (text, record, index) => { return text; },
  }, {
    title: '法人姓名',
    dataIndex: 'seller.biz_profile.legal_name',
    key: 'seller.biz_profile.legal_name',
    render: (text, record, index) => { return text; },
  }, {
    title: '注册城市',
    dataIndex: 'city_code',
    key: 'city_code',
    render: (text, record, index) => { return geography.cityName(text); },
  }, {
    title: '申请时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text, record, index) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => {
      return operateCallback(record)
    },
  },
]


// 直营项目 -> 历史合作项目(前7个配置项目)
const derectHistoryColumnsFirst = operateCallback => AFFILIATE_HISTORY_PROJECT_COLUMNS(operateCallback).slice(0, 7);

// 直营项目 -> 历史合作项目(后2个配置项目)
const derectHistoryColumnsLast = operateCallback => AFFILIATE_HISTORY_PROJECT_COLUMNS(operateCallback).slice(-2);

// 直营项目 -> 项目合作项目
export const DERECT_HISTORY_PROJECT_COLUMNS = operateCallback => derectHistoryColumnsFirst(operateCallback).concat(derectHistoryColumnsLast(operateCallback));

// 加盟项目 -> 历史合作项目
export const AFFILIATE_HISTORY_PROJECT_COLUMNS = operateCallback => [
  {
    title: '商户号',
    dataIndex: 'seller.seller_no',
    key: 'seller.seller_no',
    render: (text, record) => {
      return text
    },
  }, {
    title: '项目名称',
    dataIndex: 'service.name',
    key: 'service.name',
    render: (text, record, index) => {
      return text;
    },
  }, {
    title: '签约服务商',
    dataIndex: 'vendor.name',
    key: 'vendor.name',
    render: (text, record, index) => { return text; },
  }, {
    title: '业务模式',
    dataIndex: 'biz_mode',
    key: 'biz_mode',
    render: (text, record, index) => {
      if (text === 10) {
        return '本地生活圈即时送'
      }
    },
  }, {
    title: '法人姓名',
    dataIndex: 'seller.biz_profile.legal_name',
    key: 'seller.biz_profile.legal_name',
    render: (text, record, index) => { return text; },
  }, {
    title: '商户状态',
    dataIndex: 'seller.state',
    key: 'seller.state',
    render: (text, record, index) => { return stateTransform('seller_state', text); },
  }, {
    title: '签约状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record, index) => {
      return stateTransform('sign_state', text);
    },
  }, {
    title: '解约时间',
    dataIndex: 'unsigned_at',
    key: 'unsigned_at',
    render: (text, record, index) => {
      const _date = utcToDate(text);
      _date.time.length = 2;
      return `${_date.date.join('-')}  ${_date.time.join(':')}`;
    },
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => {
      return operateCallback(record)
    },
  },
]

// 订单分单规则表格头部信息
export const ORDER_RULES_COLUMNS = operateCallback => [
  {
    title: '优先级',
    dataIndex: 'priority',
  }, {
    title: '规则类型',
    dataIndex: 'rule_class',
    render: (text, record) => {
      return (
        <span>{text == 'VendorAppointRule' ? '指定服务商' : '--'}</span>
      )
    },
  }, {
    title: '适用区域',
    dataIndex: 'region',
    render(text, record) {
      return (
        <span>{record.sub_area_list.length > 0 ? record.sub_area_list.map((item, index) => {
          return (
            <span key={index}>{item.name}、</span>
          )
        }) : record.area_info.name}</span>
      )
    },
  }, {
    title: '规则有效期',
    dataIndex: 'expired_at',
    render: (text, record) => {
      return (
        <span>{'永久' || text}</span>
      )
    },
  }, {
    title: '规则参数',
    dataIndex: 'supply_vendor_list',
    render: (text, record) => {
      return (
        <span>服务商({record.supply_vendor_list.length})</span>
      )
    },
  }, {
    title: '操作',
    dataIndex: '',
    render: (text, record, index) => {
      return operateCallback(record)
    },
  },
]

// 骑士分单规则表格头部信息
export const KNIGHT_RULES_COLUMNS = operateCallback => [
  {
    title: '优先级',
    dataIndex: 'priority',
  }, {
    title: '规则类型',
    dataIndex: 'rule_class',
    render: (text, record) => {
      return (
        <span>{text == 'CourierAppointRule' ? '指定骑士' : '--'}</span>
      )
    },
  }, {
    title: '适用区域',
    dataIndex: 'region',
    render(text, record) {
      return (
        <span>{record.sub_area_list.length > 0 ? record.sub_area_list.map((item, index) => {
          return (
            <span key={index}>{item.name}、</span>
          )
        }) : record.area_info.name}</span>
      )
    },
  }, {
    title: '规则有效期',
    dataIndex: 'expired_at',
    render: (text, record) => {
      return (
        <span>{'永久' || text}</span>
      )
    },
  }, {
    title: '规则参数',
    dataIndex: 'supply_vendor_list',
    render: (text, record) => {
      let team = '团队: ';
      record.team_list.forEach((item, array) => {
        team += ` ${dot.get(item, 'name')},`;
      })

      let courier = ' 骑士: ';
      record.courier_list.forEach((item, array) => {
        courier += `${dot.get(item, 'name')}(${dot.get(item, 'mobile')}), `;
      })

      return (
        <div>
          <span>
            {`${record.team_list.length > 0 ? `团队(${record.team_list.length}) ` : ''} ${record.courier_list.length > 0 ? `  骑士(${record.courier_list.length})` : ''}`}&nbsp;
          </span>
          <span>
            <Tooltip title={`${team} ${courier}`} arrowPointAtCenter>
              <Icon type="exclamation-circle-o" />
            </Tooltip>
          </span>
        </div>
      )
    },
  }, {
    title: '操作',
    dataIndex: '',
    render: (text, record, index) => {
      return operateCallback(record)
    },
  },
]
