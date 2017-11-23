// 商家信息基本信息模块
import React, { Component } from 'react';
import { Form, Row, Col } from 'antd';
const FormItem = Form.Item;
const itemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 8 } };

const basic = (params) => {
  const { basicTitle, basicInfoData } = params;
  return (
    <div className="bd-content">
      <div className="content-title">{basicTitle}</div>
      <Form>
        <Row>
          {
            basicInfoData.map((item, index) => {
              return (
                <Col sm={12} key={index}>
                  <FormItem
                    label={`${item.noun}:`}
                    key={index}
                    {...itemLayout}
                  >
                    <span>{item.value}</span>
                  </FormItem>
                </Col>
              )
            })
          }
        </Row>
      </Form>
    </div>
  )
}

export default basic;
