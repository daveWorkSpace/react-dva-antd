import React, { Component, PropTypes } from 'react';
import { Form, Table, Button, Row, Col } from 'antd';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { COURIER } from '../../../ActionsName';
import style from '../style/courier.less';
import { stateTransform, dateFormatNew, utcToDate, utctoMinute } from '../../../../../../utils/newUtils';
import { geography } from '../../../../../../application';

const [FormItem,
] = [Form.Item];
const columns = [
  {
    title: '操作',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '操作时间',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: '操作人',
    dataIndex: 'field',
    key: 'field3',
  }, {
    title: '操作结果',
    dataIndex: 'work_state',
    key: 'work_state',
  }, {
    title: '备注',
    dataIndex: 'verify_state',
    key: 'verify_state',
  },
];
const View = ({ businessCourier, dispatch }) => {
  const { list_details } = businessCourier;

  //account_detail 账户先关详情 courier_detail 骑士相关详情
  const { account_detail, courier_detail } = list_details;
  //所属团队列表
  const { teams_info, created_by_info } = courier_detail;
  let hired_date = account_detail.hired_date ? (`${account_detail.hired_date}`) : '1900-09-09';
  const images = { 1: {}, 2: {}, 3: {} };
  const apply_info = {};
  if (account_detail.hired_date) {
    hired_date = `${hired_date.slice(0, 4)}-${hired_date.slice(4, 6)}-${hired_date.slice(6, 8)}`;
  }

  if (courier_detail.apply_info) {
    Object.assign(images, courier_detail.apply_info.images);
    Object.assign(apply_info, courier_detail.apply_info);
  }

  const area_name = courier_detail.area_info ? courier_detail.area_info.name : '';
  const work_state_name = account_detail.state ? window.tempAppTool.stateTransform('work_state', account_detail.state) : '';
  //为了避免 当数据为取到而渲染时  map 数据类型报错
  const underTeamList = teams_info || [];
  const created_by_info_name = created_by_info ? created_by_info.name : '';

  /*const _date = utcToDate(courier_detail.created_at);*/
  const _date = utcToDate(courier_detail.created_at);
  const date2 = utcToDate(courier_detail.last_accepted_at);
  const date3 = utcToDate(courier_detail.last_workon_at);
  _date.time.length = 2;
  date2.time.length = 2;
  date3.time.length = 2;
  const created_at = `${_date.date.join('-')}  ${_date.time.join(':')}`;
  const last_accepted_at = `${date2.date.join('-')}  ${date2.time.join(':')}`;
  const last_workon_at = `${date3.date.join('-')}  ${date3.time.join(':')}`;
  return (
    <div className="con-body">

      <Form layout="horizontal">
        <div className="bd-header">
          <div className={style.courierAll}>
            <h4 className={style.navLeftBorder}>基本信息</h4>
            <div className={style.navBottomBorder} />

            <Row>
              <Col sm={12}>
                <FormItem label="城市" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {geography.cityName(account_detail.city_code)}
                </FormItem>

                <FormItem label="骑士姓名" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {courier_detail.name}
                </FormItem>

                <FormItem label="手机号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {courier_detail.mobile}
                </FormItem>

                <FormItem label="员工类型" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {stateTransform('work_type', courier_detail.work_type)}
                </FormItem>

                <FormItem label="创建时间" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  { created_at }
                </FormItem>

              </Col>
              <Col sm={12}>
                <FormItem label="所属团队" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                  {
                    underTeamList.map((item, index) => {
                      return (
                        <span key={index}>
                          <span>{item.name}{underTeamList.length > 1 ? '、' : ''}</span>
                        </span>
                      )
                    })
                  }
                </FormItem>

                <FormItem label="性别" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                  {stateTransform('sex', account_detail.sex)}
                </FormItem>

                <FormItem label="入职时间" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {hired_date}
                </FormItem>

                <FormItem label="在职状态" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                  {work_state_name}
                </FormItem>

                <FormItem label="创建人" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                  {created_by_info_name || ''}
                </FormItem>


              </Col>
            </Row>
          </div>
        </div>
        <div className="bd-content">
          <div className={style.courierAll}>
            <h4 className={style.navLeftBorder}>身份信息</h4>
            <div className={style.navBottomBorder} />
            <Row>
              <Col sm={12}>
                <FormItem label="法人身份证号" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  {account_detail.id_card_sn}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col sm={12}>
                <FormItem label="身份证正面照" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  <img src={images[1].thumb_medium} {...{ style: { width: '400px', height: '300px' }, alt: '无上传图片' }} />
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="示例图片" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  <img
                    src="./images/example_id_card2.jpg" {...{
                      style: { width: '400px', height: '300px' },
                      alt: '无上传图片',
                    }}
                  />
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="身份证反面照" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  <img src={images[2].thumb_medium} {...{ style: { width: '400px', height: '300px' }, alt: '无上传图片' }} />
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="示例图片" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  <img
                    src="./images/reverse_id_card.jpg" {...{
                      style: { width: '400px', height: '300px' },
                      alt: '无上传图片',
                    }}
                  />
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="手持身份证照" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  <img src={images[3].thumb_medium} {...{ style: { width: '400px', height: '300px' }, alt: '无上传图片' }} />
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="示例图片" {...{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}>
                  <img
                    src="./images/example_id_card1.jpg" {...{
                      style: { width: '400px', height: '300px' },
                      alt: '无上传图片',
                    }}
                  />
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>
        <div className="bd-content">
          <div className={style.courierAll}>
            <h4 className={style.navLeftBorder}>工作信息</h4>
            <div className={style.navBottomBorder} />
            <Row>
              <Col sm={12}>
                <FormItem label="工作状态" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                  {stateTransform('duty_state', courier_detail.work_state)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <FormItem label="最后一次上线时间" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                  {last_workon_at.indexOf('NaN') > -1 ? '-- --' : last_workon_at}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="最后一次接单时间" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                  {last_accepted_at.indexOf('NaN') > -1 ? '-- --' : last_accepted_at}
                </FormItem>
              </Col>
            </Row>

            {/*<h3 className="form-divider-header">操作日志</h3>*/}

            {/*<Row type="flex" justify="center">*/}
            {/*<Col sm={18}>*/}
            {/*<Table columns={columns} dataSource={list_details.logs}/>*/}
            {/*</Col>*/}
            {/*</Row>*/}
          </div>
        </div>
        <Row type="flex" justify="center" align="top">
          <Col sm={5}>
            <Button ><Link to="/team/courier/list">返回</Link></Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

function mapStateToProps({ businessCourier }) {
  return { businessCourier };
}

module.exports = connect(mapStateToProps)(View);
