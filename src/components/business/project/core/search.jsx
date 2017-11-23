// 商户搜索
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { hashHistory, Link } from 'dva/router';
import { Form, Input, Button, Row, Col, Select } from 'antd';
import { CoreContent, CoreSearch } from '../../../core';
import style from './style.less';
//引入枚举值
import { JOIN, DIRECT } from './enumerate.js';

//初始化变量
const [FormItem, Option] = [Form.Item, Select.Option];

class Search extends Component {
  constructor(props) {
    super(props);
    this.private = {
      itemLayout: { labelCol: { span: 7 }, wrapperCol: { span: 14 } },
      search: {
        sellerNo: '',         //商户号
        sellerName: '',       //商户名称
      },
    }
  }

  onReset = () => {
    this.private.search = {
      sellerNo: '',
      sellerName: '',
    };
    // 刷新列表
    this.props.searchHandle();
  };

  onSearch = () => {
    const { sellerNo, sellerName } = this.private.search;
    const searchParams = {
      sellerNo,
      sellerName,
    };
    this.props.searchHandle(searchParams)
  };

  //搜索功能
  renderSearch= () => {
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
    const { handleSubmit, onHandleSearch, renderSearch } = this;
    const { itemLayout } = this.private;
    const { getFieldDecorator } = this.props.form;
    const { renderButtons, historyLink } = this.props;
    return (
      <div className="content-operation">
        {
          renderButtons ?
            <div>
              <div className="content-operation">
                <Form layout="horizontal" onSubmit={handleSubmit}>
                  <Row gutter={40} type="flex" justify="space-around" align="middle">
                    <Col span={12} className="left">检索功能（完善中）
                    </Col>
                    <Col span={12} className="right">
                      <Button type="primary" htmlType="submit">查询</Button>
                      { renderButtons() }
                    </Col>
                  </Row>
                </Form>
              </div>
              {/*{ renderSearch() }*/}
              {/* 查看申请合作商家与历史项目 */}
              {/*<Row type="flex" justify="end">
                { renderButtons() }
              </Row>*/}
            </div> :
            <div>
              <div className="content-operation">
                <Form layout="horizontal" onSubmit={handleSubmit}>
                  <Row gutter={40} type="flex" justify="space-around" align="middle">
                    <Col span={12} className="left">检索功能（完善中）
                    </Col>
                    <Col span={12} className="right">
                      <Button type="primary" htmlType="submit">查询</Button>
                    </Col>
                  </Row>
                </Form>
              </div>
              {/*{ renderSearch() }*/}
            </div>
        }
      </div>
    );
  }
}

module.exports = Form.create()(Search);
