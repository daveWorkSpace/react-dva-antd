// 新项目及历史合作项目搜索模块
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { hashHistory, Link } from 'dva/router';
import { Form, Input, Button, Row, Col, Select } from 'antd';
import { CoreContent, CoreSearch } from '../../../core';
//初始化变量
const [FormItem, Option] = [Form.Item, Select.Option];

//引入枚举值
import { JOIN, DIRECT, ADD_NEW_PROJECT } from './enumerate.js'

import style from './style.less';

// 添加新项目 及 历史合作项目
class SubSearch extends Component {
  constructor(props) {
    super(props);
    this.private = {
      itemLayout: { labelCol: { span: 7 }, wrapperCol: { span: 14 } },
      search: {
        sellerNo: '',       //商户号
        sellerName: '',     //商户名称
      },
    }
  }

  componentWillMount() {

  }

  //
  onSearch = (e) => {
    this.private.search.sellerNo = e.sellerNo;
    this.private.search.sellerName = e.sellerName;
    //
    this.props.searchHandle(this.private.search);
  };

  //重置搜索查询
  onReset = () => {
    this.private.search = {
      sellerNo: '',
      sellerName: '',
    };
    //重新刷新列表
    this.props.searchHandle(this.private.search);
  };

  //渲染搜索
  renderSearch = () => {
    const { sellerNo, sellerName } = this.private.search;
    const items = [
      {
        label: '商户号',
        form: form => (form.getFieldDecorator('sellerNo', { initialValue: sellerNo })(<Input placeholder="请输入商户号" />)),
      },
      {
        label: '项目名称',
        form: form => (form.getFieldDecorator('sellerName', { initialValue: sellerName })(<Input placeholder="请输入商户名称" />)),
      },
    ];
    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
    };

    return (
      <CoreContent>
        <CoreSearch {...props} />
      </CoreContent>
    )
  };

  render() {
    const { renderSearch } = this;
    return (
      <div className="content-operation">
        {renderSearch()}
      </div>
    );
  }
}

module.exports = Form.create()(SubSearch);
