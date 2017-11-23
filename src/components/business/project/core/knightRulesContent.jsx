// 骑士分单规则主体
import dot from 'dot-prop'
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Button, Modal, Form, Select, Radio, InputNumber, message, TreeSelect, Tooltip, Icon } from 'antd';
import KnightRulesList from './knightRulesList';
import { SendOrderRules } from '../../../actions';
import Storage from '../../../../application/library/storage';
import { geography, authorize } from '../../../../application';
import { KNIGHT_RULES_COLUMNS } from './enumerate';
import style from '../style.less';

const [FormItem, Option] = [Form.Item, Select.Option];
const TreeNode = TreeSelect.TreeNode;
const {
  getAreaList,        //获取区域列表
  addKnightRule,      //添加骑士规则
  getServiceProviders,
  updataStateFunc,    //更新状态函数
  deleteKnightRules,  //删除骑士规则
  editKnightRule,     //更新骑士规则
  getCanSelectTeams,  //获取可选择团队列表
} = SendOrderRules;

class RulesContent extends Component {
  constructor(props) {
    super(props);
    const { dispatch, SendOrderRules, type } = props;
    // console.log(type);
    this.state = {
      areaList: SendOrderRules.areaList,  //区域列表
      teamList: SendOrderRules.teamList, //可选团队列表
      visible: false, //分单规则弹出框显示状态
      editState: false, //编辑状态
      activeEditRecord: [], //当前编辑规则
      activeAreaName: '',   //当前区域名称
      activeAreaRecord: [], //当前区域信息
      dataSource: [],
      courierInitValue: [], //默认骑士列表
      teamInitValue: [], //默认团队列表
    };
    this.private = {
      dispatch,
      columns: '',
      storage: new Storage(`${type}`, { useSession: true }), //缓存实例
    };
    // 展示弹出框
    this.showModal = this.showModal.bind(this);
    // 弹出框确认
    this.handleOk = this.handleOk.bind(this);
    // 弹出框取消
    this.handleCancel = this.handleCancel.bind(this);
    // 删除订单规则数据
    this.deleteRules = this.deleteRules.bind(this);
    // 编辑弹出框切换
    this.showEditModal = this.showEditModal.bind(this);
  }

  componentWillMount() {
    const { deleteRules, showEditModal } = this;
    const operateCallBack = (record) => {
      return (
        <p>
          <span style={{ color: '#00CFA1', cursor: 'pointer' }} onClick={() => showEditModal(record)}>
            {'编辑   '}
          </span>

          <span style={{ color: '#00CFA1', cursor: 'pointer' }} onClick={() => deleteRules(record)}>
            {'   删除'}
          </span>
        </p>
      );
    };
    this.private.columns = KNIGHT_RULES_COLUMNS(operateCallBack);
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.private;
    const {
      SendOrderRules,
      activeAreaName,
      activeAreaRecord,
      getAreaListFunc,
      getKnightRuleDetailsFunc,
    } = nextProps;
    // console.log(SendOrderRules);
    const { areaList, upDataState, teamList } = SendOrderRules;
    this.setState({
      areaList,
      activeAreaName,
      activeAreaRecord,
      teamList,
    });
    // 当添加， 编辑， 删除规则时，都应重新请求最新的数据，包括侧边区域数据，规则数据
    if (upDataState) {
      // 通知model 层 通过区域id 获取此区域的分单规则详情信息
      getKnightRuleDetailsFunc(activeAreaRecord);
      // 允许区域刷新
      this.props.reflush(false);
      // 更新区域列表
      getAreaListFunc();
      // 关闭更新开关
      const state = false;
      dispatch({ type: updataStateFunc, payload: { state } });
    }
  }

  //删除订单规则数据
  deleteRules(record) {
    const { dispatch } = this.private;
    const rule_id = record.id;
    dispatch({ type: deleteKnightRules, payload: { rule_id } });
  }

  // 编辑弹出框切换
  showEditModal(record) {
    // 禁止区域刷新
    this.props.reflush(true);
    // 编辑骑士规则时的默认骑士
    const courierInitValue = [];
    const teamInitValue = [];
    for (let k = 0; k < record.courier_list.length; k++) {
      if (dot.has(record, `courier_list.${k}.id`)) {
        courierInitValue.push(dot.get(record, `courier_list.${k}.id`));
      }
    }
    for (let l = 0; l < record.team_list.length; l++) {
      if (dot.has(record, `team_list.${l}.id`)) {
        teamInitValue.push(dot.get(record, `team_list.${l}.id`));
      }
    }

    this.setState({
      courierInitValue,
      teamInitValue,
      editState: true,
      activeEditRecord: record,
    });
    this.showModal();
  }

  // 展示弹出框
  showModal = () => {
    // 禁止区域刷新
    this.props.reflush(true);
    const { dispatch } = this.props;
    const { activeAreaName, activeAreaRecord } = this.state;
    if (activeAreaName !== '') {
      const is_return_courier_list = true;
      const params = {
        vendor_id: authorize.auth.vendorId,
        city_code: dot.get(authorize.vendor, 'city.code'),
        is_return_courier_list,
      };
      // 获取当前区域下可选择团队
      dispatch({ type: getCanSelectTeams, payload: params });

      this.setState({
        visible: true,
      });
    } else {
      message.error('请选择左侧的服务区域');
    }
  };

  // 弹出框确认
  handleOk = (e, value) => {
    const { storage } = this.private;
    const { activeAreaName, activeAreaRecord, editState, activeEditRecord, teamList } = this.state;
    // console.log('--------------editState----', editState);
    const self = this;
    const { form, dispatch } = this.props;
    const { resetFields } = form;
    form.validateFields((err, value) => {
      if (err) {
        return;
      }
      const values = form.getFieldsValue();

      if (values.team_list == undefined && values.teams_id == undefined) {
        message.error('请选择团队或者骑士中的一项');
        return;
      }
      if (values.team_list == undefined) {
        values.team_list = [];
      }
      if (values.teams_id == undefined) {
        values.teams_id = [];
      }

      const { vendorId } = authorize.auth;

      if (editState === false) {
        values.seller_id = storage.get('seller_id');
        values.contract_id = storage.get('contract_id');
        values.vendor_id = vendorId;
      }
      values.rule_class = 10;

      const sub_areas_values = [];

      // 判断区域是父区域 还是子区域
      if (values.area_id.length > 0) {
        const numbers = values.area_id.indexOf(activeAreaRecord.id);
        for (var i = 0; i < values.area_id.length; i++) {
          if (values.area_id[i].indexOf(activeAreaRecord.id) == -1) {
            sub_areas_values.push(values.area_id[i]);
          }
        }
      }

      //筛选团队数据
      const teamValue = [];
      const courierValue = [];
      for (var i = 0; i < teamList.data.length; i++) {
        if (values.team_list.indexOf(teamList.data[i].id) > -1) {
          teamValue.push(teamList.data[i].id);
        }
      }

      //筛选骑士数据
      for (var i = 0; i < teamList.data.length; i++) {
        for (let k = 0; k < teamList.data[i].courier_list.length; k++) {
          if (values.team_list.indexOf(teamList.data[i].courier_list[k].id) > -1) {
            courierValue.push(teamList.data[i].courier_list[k].id);
          }
        }
      }

      values.team_list = values.teams_id;
      delete values.teams_id;
      values.courier_list = courierValue;
      values.area_id = activeAreaRecord.id;
      values.sub_area_list = sub_areas_values;

      if (editState === true) {
        const rule_id = activeEditRecord.id;
        dispatch({ type: editKnightRule, payload: { values, rule_id } });
      } else {
        dispatch({ type: addKnightRule, payload: { values } });
      }
      self.setState({
        visible: false,
        editState: false,
        activeEditRecord: [],
      });
      resetFields();
    });
  };

  // 弹框取消
  handleCancel = (e) => {
    const { resetFields } = this.props.form;
    resetFields();
    this.setState({
      visible: false,
      editState: false,
      activeEditRecord: [],
    });
  };

  render() {
    const { showModal } = this;
    const {
      dataSource,
      activeAreaName,
      visible,
      teamList,
      editState,
      activeEditRecord,
      teamInitValue,
      courierInitValue,
    } = this.state;
    const { storage, columns } = this.private;
    const { treeList, knightRuleListDetail } = this.props;
    const seller_name = storage.get('seller_name');
    // 从Form 组件中获取相应的方法
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const rulesListProps = {
      columns,
      dataSource,
      activeAreaName,
      knightRuleListDetail,
    };
    const supply_vendor_list_value = [];
    const sub_area_list_value = [];
    const sub_area_list_value_init = [];
    const editKnightRule = activeEditRecord;
    if (editState === true) {
      // 将区域数据整合 父级及子集放如同一数组
      sub_area_list_value.push({ id: editKnightRule.area_info.id, name: editKnightRule.area_info.name });
      for (let i = 0; i < editKnightRule.sub_area_list.length; i++) {
        sub_area_list_value.push(editKnightRule.sub_area_list[i].id);
        sub_area_list_value_init.push(editKnightRule.sub_area_list[i].id);
      }
    }
    const popContent = (
      <span>
        说明：<br />
        1.区域未设置对应团队或骑士，骑士端将看不到订单 <br />
        2.设置团队或骑士后，系统将按规则推单给骑士，骑士可进行抢单<br />
        3.骑士离职后，系统自动将对应骑士从规则中移除<br />
      </span>
    );

    let areaId = [];  //区域id
    let teamId = [];  //团队id

    //判断是否是编辑模式，如果是编辑模式，则将数据赋值到表单默认值中
    if (editState === true) {
      teamId = teamInitValue;

      if (sub_area_list_value_init.length > 0) {
        areaId = sub_area_list_value_init;
      } else {
        areaId = [`${editKnightRule.area_info.id}`]
      }
    }

    return (
      <Col sm={19} style={{ paddingLeft: '10px' }}>
        <div className="bd-content">
          <Row>
            <Col sm={12}>
              <div className="content-title">
                分单规则设置{` (${activeAreaName === '' ? '请选择左侧服务区域' : activeAreaName})`}
                <Tooltip placement="rightTop" title={popContent} arrowPointAtCenter>
                  <Icon type="info-circle" />
                </Tooltip>
              </div>
            </Col>
            <Col sm={12} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={showModal}>
                添加分单规则
              </Button>
              <Modal title="分单规则" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} style={{ top: '35%' }}>
                <Form>
                  <Row>
                    <Col sm={24}>
                      <FormItem label="规则类型:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                        <span>指定服务骑士</span>
                      </FormItem>
                    </Col>
                    <Col sm={24}>
                      <FormItem label="适用区域:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }} >
                        {getFieldDecorator('area_id', {
                          initialValue: areaId,
                          validate: [
                            {
                              rules: [
                                { type: 'array', required: true, message: '请选择服务区域' },
                              ],
                              trigger: 'onBlur',
                            },
                          ],
                        })(
                          <Select showSearch mode="multiple" style={{ width: '100%' }} placeholder="请选择服务区域" optionFilterProp="children">
                            {treeList.map((item, index) => {
                              const key = `area${item.id}${item.name}${index}${Math.random()}`
                              return (
                                <Option value={item.id} key={key}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                    <Col sm={24}>
                      <FormItem label="有效期:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                        {getFieldDecorator('expired_at', {
                          initialValue: '2027-12-31 00:00:00',
                        })(<Radio defaultChecked>永久</Radio>)}
                      </FormItem>
                    </Col>
                    <Col sm={24}>
                      <FormItem label="规则参数:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 12 } }}>
                        <span style={{ color: 'orange' }}>以下选项至少选择一项（团队／骑士)</span>
                      </FormItem>
                    </Col>
                    <Col sm={24}>
                      <FormItem label="分配给团队:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                        {getFieldDecorator('teams_id', {
                          initialValue: teamId,
                          validate: [
                            {
                              rules: [{ type: 'array', message: '请选择团队' }],
                            },
                          ],
                        })(
                          <Select showSearch mode="multiple" style={{ width: '100%' }} placeholder="请选择团队" optionFilterProp="children">
                            {teamList.data.map((item, index) => {
                              const key = `team${item.id}${item.name}${index}${Math.random()}`
                              return (
                                <Option value={item.id} key={key}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                    <Col sm={24}>
                      <FormItem label="分配给骑士:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                        {getFieldDecorator('team_list', {
                          initialValue: editState === true ? courierInitValue : [],
                          validate: [
                            {
                              rules: [
                                {
                                  message: '请选择骑士',
                                  type: 'array',
                                },
                              ],
                            },
                          ],
                        })(
                          <TreeSelect
                            multiple
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择骑士"
                            allowClear
                            treeDefaultExpandAll
                            treeCheckable
                          >
                            {teamList.data.map((item, index) => {
                              const tkey = `teamList${item.id}${item.name}${index}${Math.random()}`;
                              return (
                                <TreeNode value={item.id} title={item.name} key={tkey}>
                                  {item.courier_list.map((item, index) => {
                                    const ckey = `${tkey}courierList${item.id}${item.name}${index}${Math.random()}`
                                    return (
                                      <TreeNode value={item.id} title={item.name} key={ckey} />
                                    );
                                  })}
                                </TreeNode>
                              );
                            })}
                          </TreeSelect>,
                        )}
                      </FormItem>
                    </Col>
                    <Col sm={24}>
                      <FormItem label="优先级:" {...{ labelCol: { span: 8 }, wrapperCol: { span: 9 } }}>
                        {getFieldDecorator('priority', {
                          initialValue: editState === true ? editKnightRule.priority : 1,
                          validate: [
                            {
                              rules: [
                                {
                                  required: true,
                                },
                              ],
                            },
                          ],
                        })(<InputNumber size="large" min={1} max={100} />)}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            </Col>
            <Col sm={24}>
              <KnightRulesList {...rulesListProps} />
            </Col>
          </Row>
        </div>
      </Col>
    );
  }
}

function mapStateToProps({ SendOrderRules }) {
  return { SendOrderRules };
}

export default connect(mapStateToProps)(Form.create()(RulesContent));
