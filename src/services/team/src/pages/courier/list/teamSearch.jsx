/**
 * Created by dave on 16/12/31.
 */
import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Row, Col, Select, Modal } from 'antd';
import { Link } from 'dva/router';
import { connect } from 'dva';
import style from '../style/courier.less';
import { geography, authorize } from '../../../../../../application';

const [FormItem, Option] = [Form.Item, Select.Option];
const TeamSearch = Form.create()(({ form, searchs, onSearch, onShowItem, data, tabs, visibleCourier, dispatch, businessCourier, outsideCourier }) => {
  const { city, teamListDetail } = businessCourier;
  const datas = outsideCourier.outsideCourier || [];                // 可添加的骑士列表
  const vendor_id = authorize.auth.vendorId;
  const { getFieldDecorator, getFieldsValue, resetFields } = form;
  const itemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };
  const searchValue = {
    tabs: '',
  };
  if (searchValue.tabs !== tabs) {

  }
  const selectProps = {
    getFieldDecorator,
    getFieldsValue,
    datas,
  };

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(getFieldsValue())
  }

  /*确认框展示*/
  function showModal() {
    const visibleCouriers = true;
    const city_code = city;
    dispatch({ type: 'businessCourier/checkBox', payload: { visibleCouriers } });
    const team_id = tabs;
    dispatch({ type: 'businessCourier/teamAddMember', payload: { vendor_id, team_id, city_code } });
  }

  /*确认框Ok事件*/
  function handleOk() {
    const visibleCouriers = false;
    const courier_ids = addMember.courier_ids;
    const team_id = sessionStorage.getItem('tabs');
    const outsideCourier = [];
    dispatch({ type: 'businessCourier/checkBox', payload: { visibleCouriers } });
    dispatch({ type: 'businessCourier/addTeamMemeber', payload: { team_id, courier_ids } });
  }

  const addMember = {
    courier_ids: '',
  }

  function optionChange(value) {
    addMember.courier_ids = value;
  }

  /*确认框cancel事件*/
  function handleCancel(e) {
    const visibleCouriers = false;
    dispatch({ type: 'businessCourier/checkBox', payload: { visibleCouriers } });
  }

  return (
    <div className="bd-header">
      <Form layout="horizontal" className="ant-advanced-search-form" onSubmit={handleSubmit} key="authstr">
        {
          getFieldDecorator('team_id', {
            initialValue: '',
          })(
            <Input style={{ display: 'none' }} />,
          )
        }
        <div className={style.courierOverFlow}>
          <div className={`${style.navLeftBorder} ${style.courierRightTitle}`} key={teamListDetail.name}>
            {teamListDetail.name || '请选择团队或者骑士'}            &nbsp;({teamListDetail.courier_count || 0}            )
          </div>
          <FormItem label="" {...itemLayout} className={style.courierRightTitleBt}>
            <Button type="primary" onClick={showModal}>添加成员</Button>
            <Modal
              title="添加新成员" visible={visibleCourier}
              onOk={handleOk} onCancel={handleCancel}
              style={{ top: '35%' }}
            >
              <Row>
                <Col sm={24}>
                  <FormItem label="城市" {...itemLayout}>
                    <div>{geography.cityName(city)}</div>
                  </FormItem>
                  <FormItem label="选择成员" {...itemLayout}>
                    <Selected data={datas} onChanges={optionChange} />
                  </FormItem>
                </Col>
              </Row>
            </Modal>
          </FormItem>
        </div>
        <div className={style.navBottomBorder} style={{ marginBottom: '16px' }} />
        <Row >
          <Col sm={8}>
            <FormItem label="姓名" {...itemLayout} >
              {
                getFieldDecorator('name')(
                  <Input {...{ placeholder: '骑士姓名' }} />,
                )
              }
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="手机号" {...itemLayout} >
              {
                getFieldDecorator('mobile')(
                  <Input {...{ placeholder: '骑士手机号' }} />,
                )
              }
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="审核状态" {...itemLayout} >
              {
                getFieldDecorator('verify_state', { initialValue: '' })(
                  <Select
                    showSearch
                    optionFilterProp="children" {...{ placeholder: '审核状态' }}
                  >
                    <Option value="">全部</Option>
                    <Option value="0">待提交</Option>
                    <Option value="1">待审核</Option>
                    <Option value="100">通过</Option>
                  </Select>,
                )
              }
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="在岗状态" {...itemLayout} >
              {
                getFieldDecorator('work_state', { initialValue: '' })(
                  <Select
                    showSearch
                    optionFilterProp="children" {...{ placeholder: '在岗状态' }}
                  >
                    <Option value="">全部</Option>
                    <Option value="100">在岗</Option>
                    <Option value="-100">离岗</Option>
                  </Select>,
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
class Selected extends Component {
  render() {
    const datas = this.props.data;
    const team_id = sessionStorage.getItem('tabs');
    return (
      <div key={`${team_id}---`}>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="请选择骑士"
          optionFilterProp="children"
          onChange={this.props.onChanges}
          key={team_id}
        >{
          datas.map((item, index) => {
            return (
              <Option value={item.id} key={`${item.id}${team_id}${index}`}>{item.name}</Option>
            )
          })
        }
        </Select>
      </div>
    )
  }
}
function mapStateToProps({ businessCourier }) {
  return { businessCourier };
}

module.exports = connect(mapStateToProps)(TeamSearch);
