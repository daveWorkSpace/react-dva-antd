import React from 'react';

//承运商列表头文件
export const SUPPLIER_LIST_COLUMNS = operateCallback => [
  {
    title: '商户号',
    dataIndex: 'expresses_paper_no',
    render: (text, record) => {
      return (
        <span>{record.supply_vendor ? record.supply_vendor.org_no : ''}</span>
      )
    },
  }, {
    title: '承运商ID',
    dataIndex: 'supply_vendor_id',
    key: 'supply_vendor_id',
  }, {
    title: '承运商名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '合作状态',
    dataIndex: 'state',
    render: (text, record) => {
      return (
        <span>{text == 100 ? '合作' : '未合作'}</span>
      )
    },
  }, {
    title: '是否开始业务',
    dataIndex: 'business_state',
    key: 'business_state',
    render: (text) => {
      return (
        <span>{text == 100 ? '开启' : '关闭'}</span>
      );
    },
  }, {
    title: '法人姓名',
    dataIndex: 'legal_name',
    render: (text, record) => {
      return (
        <span>{record.supply_vendor ? record.supply_vendor.account_name : ''}</span>
      )
    },
  },
  {
    title: '联系电话',
    dataIndex: 'company_contact_mobile',
    key: 'company_contact_mobile',
    render: (text, record) => {
      return (
        <span>{record.supply_vendor ? record.supply_vendor.mobile : ''}</span>
      )
    },
  }, {
    title: '合作区域数',
    dataIndex: 'biz_area_count',
    key: 'biz_area_count',
    render: (text, record) => {
      return text;
    },
  }, {
    title: '合作仓库数',
    dataIndex: 'biz_stock_count',
    key: 'biz_stock_count',
    render: (text, record) => {
      return text;
    },
  },
    // {
    //     title: '服务项目数',
    //     dataIndex: 'biz_project_count',
    //     key: 'biz_project_count',
    //     render: (text, record) => {
    //         return text;
    //     },
    // },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => {
      return operateCallback(record);
    },
  },
];

// 合作区域
export const SUPPLIER_AREA_COLUMNS = (switchCallback, operateCallback) => [
  {
    title: '合作状态',
    dataIndex: 'service_city_code',
    key: 'service_city_code',

    render: (text, record, index) => {
      return switchCallback(record)
    },
  }, {
    title: '区域名称',
    dataIndex: 'area_name',
    key: 'area_name',
  }, {
    title: '区域状态',
    dataIndex: 'state',
    render: (text, record) => {
      return (
        <span>{record.area.state == 100 ? '启用' : '禁用'}</span>
      )
    },
  }, {
    title: '操作',
    dataIndex: 'operate',
    render: (text, record) => {
      return operateCallback(record)
    },
  },
]

// 合作仓库
export const SUPPLIER_STOCK_COLUMNS = operateCallback => [
  {
    title: '仓库名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record, index) => {
      return text
    },
  }, {
    title: '库房存储能力',
    dataIndex: 'is_inventory',
    key: 'is_inventory',
    render: (text, record) => {
      return text === true ? '是' : '否';
    },
  }, {
    title: '配送站能力',
    dataIndex: 'is_dispatch',
    key: 'is_dispatch',
    render: (text, record) => {
      return text === true ? '是' : '否';
    },
  }, {
    title: '仓库状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record) => {
      return text === 100 ? '启用' : '禁用';
    },
  }, {
    title: '操作',
    dataIndex: 'operate',
    render: (text, record) => {
      return operateCallback(record)
    },
  },
]

// 服务项目
export const SUPPLIER_PROJECT_COLUMNS = operateCallback => [
  {
    title: '商家名称',
    dataIndex: 'name',
    key: 'name',

    render: (text, record, index) => {
      return text
    },
  }, {
    title: '业务模式',
    dataIndex: 'save',
    key: 'save',
  }, {
    title: '负责人',
    dataIndex: 'person',
    render: (text, record) => {
      return text
    },
  }, {
    title: '联系电话',
    dataIndex: 'phone',
    render: (text, record) => {
      return phone
    },
  }, {
    title: '签约时间',
    dataIndex: 'time',
    render: (text, record) => {
      return text
    },
  }, {
    title: '操作',
    dataIndex: 'operate',
    render: (text, record) => {
      return operateCallback(record)
    },
  },
]
