/**
 * Created by dave on 16/12/31.
 * 待审核骑士搜索模块
 */
import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { Link } from 'dva/router';
import style from '../style/courier.less';
const FormItem = Form.Item;

const Authstr = Form.create()(({ form, searchs, onSearch, onShowItem, areas, data, readyListTables, delayCheckNum }) => {

  const { getFieldDecorator, getFieldsValue } = form;
  const itemLayout = { "labelCol": { "span": 5 }, "wrapperCol": { "span": 14 } };

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(getFieldsValue())
  };
  return (
    <div className="bd-header">
      <Form layout="horizontal" className="ant-advanced-search-form" onSubmit={handleSubmit} key="authstr">
        {
          getFieldDecorator("team_id", {
            initialValue: '',
          })(
            <Input style={{display:'none'}}/>
          )
        }

        <div className={style.courierOverFlow}>
          <div className={`${style.navLeftBorder} ${style.courierRightTitle}`}>
            待审核骑士&nbsp;({delayCheckNum})
          </div>
          <FormItem label="" {...itemLayout} className={style.courierRightTitleBt}>
            <Button type="primary"><Link to="/team/courier/list/add">添加成员</Link></Button>
          </FormItem>
        </div>
        <div className={style.navBottomBorder} style={{ marginBottom: '16px' }}></div>
        <Row gutter={24}>
          <Col sm={8}>
            <FormItem label="姓名" {...itemLayout} >
              {
                getFieldDecorator("name")(
                  <Input {...{ "placeholder": "骑士姓名" }}/>
                )
              }
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="手机号" {...itemLayout} >
              {
                getFieldDecorator("mobile")(
                  <Input {...{ "placeholder": "骑士手机号" }}/>
                )
              }
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="" {...itemLayout}>
              <Button htmlType="submit">查询</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )

});
module.exports = Authstr;
