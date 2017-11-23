import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Row, Col, Tree, Icon, Modal, Form, Select, Input, message } from 'antd';
import { COURIER } from '../../../ActionsName';
import Search from './Search';
import List from './List';
import TeamCity from './teamCity';
import { Courier } from './courierModel';
import Authstr from './authstrSearch';
import TeamSearch from './teamSearch';
import style from '../style/courier.less';
import { geography, authorize } from '../../../../../../application';

const [FormItem, Option, TreeNode] = [Form.Item, Select.Option, Tree.TreeNode];

class View extends Component {
  constructor(props) {
    super();
    const { dispatch, businessCourier } = props;
    const vendor_id = authorize.auth.vendorId;
    const city_code = dot.get(authorize.vendor, 'city.code');

    this.state = {
      selectedKeys: [],
      teamSearchValues: '',
      courierSearchValues: '',
      authstrSearchValues: '',
      page: 1,
      pageFlage: true,
      currentCityCode: city_code,   //businessCourier.city, module层获取数据的逻辑有问题
    };

    Object.assign(this, {
      dispatch,
      page: 1,
      querys: { vendor_id },
      info: [],
    });
  }

  //搜索查询通过form表单拿到所有查询数据
  onSearch = (values) => {
    this.page = 1;
    const verify_state = 1;
    const tabs = sessionStorage.getItem('tabs');
    switch (tabs) {
      case '所有骑士':
        this.setState({
          courierSearchValues: values,
        });
        break;
      case '待审核骑士':
        this.setState({
          authstrSearchValues: values,
        });
        break;
      default:
        values.team_id = tabs;
        this.setState({
          teamSearchValues: values,
        });
        break;
    }
    const { currentCityCode } = this.state;
    const { dispatch, page } = this;
    Object.assign(this.querys, values);
    if (tabs === '待审核骑士') {
      dispatch({ type: COURIER.find, payload: { ...this.querys, page, city_code: currentCityCode, verify_state } });
    } else {
      dispatch({ type: COURIER.find, payload: { ...this.querys, page, city_code: currentCityCode } });
    }
  };

  //分页切换
  onPageChange = (page) => {
    const { dispatch, querys } = this;
    const { currentCityCode } = this.state;

    const verify_state = 1;
    this.page = page;
    const tabs = sessionStorage.getItem('tabs');

    this.setState({
      pageFlage: true,
    });

    switch (tabs) {
      case '所有骑士':
        Object.assign(querys, this.state.courierSearchValues);
        dispatch({ type: 'businessCourier/fetchCourierList', payload: { ...querys, city_code: currentCityCode, page } });
        break;
      case '待审核骑士':
        Object.assign(querys, this.state.authstrSearchValues);
        dispatch({ type: 'businessCourier/fetchCourierList', payload: { ...querys, city_code: currentCityCode, page, verify_state } });
        break;
      default:
        const team_id = tabs;
        Object.assign(querys, this.state.teamSearchValues);
        dispatch({ type: 'businessCourier/fetchCourierList', payload: { ...querys, city_code: currentCityCode, page, team_id } });
        break;
    }
  };

  //选中左侧树形导航(骑士导航)从而加载不同数据及组件
  onSelect = (info) => {
    const menuTitle = info[0];
    const vendor_id = authorize.auth.vendorId;
    const { dispatch } = this.props;
    const { currentCityCode } = this.state;

    //待审核骑士状态枚举值 为 1
    const verify_state = 1;
    if (menuTitle === '所有骑士') {
      const listType = '所有骑士';
      this.setState({
        authstrSearchValues: '',
        teamSearchValues: '',
        pageFlage: false,
      });
      this.querys = { vendor_id };
      sessionStorage.setItem('tabs', listType);
      dispatch({ type: 'businessCourier/tabChange', payload: { info } });
      dispatch({ type: 'businessCourier/fetchCourierList', payload: { vendor_id, city_code: currentCityCode } });
      dispatch({ type: 'businessCourier/changeListType', payload: { listType } });
    } else if (menuTitle === '待审核骑士') {
      //枚举值 为了区分是否页面初始化是请求的 待审核骑士 (为了复用table数据模板 所以 以此为区分)
      const typeState = 'unInit';
      const listType = '待审核骑士';//待审核
      this.setState({
        courierSearchValues: '',
        teamSearchValues: '',
        pageFlage: false,
      });
      this.querys = { vendor_id };
      sessionStorage.setItem('tabs', listType);
      dispatch({ type: 'businessCourier/tabChange', payload: { info } });
      dispatch({ type: 'businessCourier/fetchCourierList', payload: { vendor_id, verify_state, city_code: currentCityCode } });
      dispatch({ type: 'businessCourier/changeListType', payload: { listType } });
    } else if (menuTitle === '所有团队') {
      message.info('请选择左侧团队或者骑士中的一项', 4);
    } else if (info === undefined || info.length < 1) {
      //暂不处理
      console.log('菜单重复点击，暂不处理');
    } else {
      //获取team id
      const teamId = info[0];
      const listType = info[0];
      if (info.length != 0) {
        this.setState({
          courierSearchValues: '',
          authstrSearchValues: '',
          pageFlage: false,
        });
        this.querys = { vendor_id };
        sessionStorage.setItem('tabs', listType);
        if (this.state.teamSearchValues !== '') {
          Object.assign(this.querys, this.state.teamSearchValues);
          dispatch({ type: 'businessCourier/fetchCourierList', payload: { ...this.querys, team_id: teamId, city_code: currentCityCode } });
        } else {
          dispatch({ type: 'businessCourier/fetchCourierList', payload: { vendor_id, team_id: teamId, city_code: currentCityCode } });
        }
        dispatch({ type: 'businessCourier/teamChange', payload: { info, listType } });
        dispatch({ type: 'businessCourier/changeListType', payload: { listType } });
      }
    }
  };

  //城市更改回调
  cityChange = (value) => {
    // 重置默认选中是所有骑士
    const info = '所有骑士';
    sessionStorage.setItem('tabs', info);
    /*this.onSelect(selectedKeys);*/

    this.setState({
      pageFlage: false,
      currentCityCode: value,
    });
    const { dispatch } = this;
    const city_code = value;
    const vendor_id = authorize.auth.vendorId;
    dispatch({ type: 'businessCourier/cityChange', payload: { city_code } });
    dispatch({ type: 'businessCourier/tabChange', payload: { info } });
    // 根据城市的不同 获取不同团队数据
    dispatch({ type: 'businessCourier/getTeam', payload: { vendor_id, city_code } });

    // 根据城市的不同 获取不同待审核骑士数据
    const verify_state = 1;
    dispatch({
      type: 'businessCourier/readyCourier',
      payload: {
        vendor_id,
        verify_state,
        city_code,
      },
    });

    // 根据城市的不同获取所有骑士的数量
    dispatch({
      type: 'businessCourier/getAllCourierNUmber',
      payload: {
        vendor_id,
        city_code,
      },
    });

    // 根据城市的不同获取待审核骑士的数量
    dispatch({
      type: 'businessCourier/getReadyCourierNumber',
      payload: {
        vendor_id,
        verify_state,
        city_code,
      },
    });

    // 城市更改后默认获取所有的骑士的数据
    dispatch({
      type: 'businessCourier/fetchCourierList',
      payload: { vendor_id, city_code },
    });
  };

  //确认框展示
  showModal = () => {
    const { dispatch } = this;
    const visibles = true;
    dispatch({ type: 'businessCourier/checkBox', payload: { visibles } });
  };

  //确认框Ok事件
  handleOk = () => {
    const { dispatch } = this;
    const { currentCityCode } = this.state;
    const { getFieldsValue } = this.props.form;
    const vendor_id = authorize.auth.vendorId;
    const values = getFieldsValue();
    const name = values.name;
    if (name !== '') {
      const visibles = false;
      dispatch({ type: 'businessCourier/checkBox', payload: { visibles } });
      dispatch({ type: 'businessCourier/addTeam', payload: { vendor_id, name, city_code: currentCityCode } })
    }
  };

  //确认框cancel事件
  handleCancel = (e) => {
    const { dispatch } = this;
    const visibles = false;
    dispatch({ type: 'businessCourier/checkBox', payload: { visibles } });
  };

  render() {
    const { getFieldDecorator, validateFields, getFieldsValue } = this.props.form;

    // 搜索模块容器  通过不同的状态 加载不同的搜索模块
    const content = [];

    // 数据列表类型(团队、骑士)
    const listType = this.props.businessCourier.listType;

    // form 表单样式
    const itemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };

    // 从父级prop 获取action中的值
    const { businessCourier, dispatch } = this.props;

    // 解构一层数据
    const {
      list_searchs, list_tables, tabs, visible, teamListDetail,
      readyListTables, courierNumber, visibleCourier, outsideCourier,
      serviceCityList, delayCheckNum,
    } = businessCourier;
    const { currentCityCode } = this.state;
    //当前页为待审核页则直接取待审核数，否则从返回数据中取
    const delayCheckNumShow = delayCheckNum || (readyListTables._meta && readyListTables._meta.result_count) ? readyListTables._meta.result_count : 0

    //分页 函数及数据
    const { page, onSearch, onPageChange } = this;
    const pageFlage = this.state.pageFlage;
    //传给搜索子组件的数据
    const searchProps = {
      teamListDetail,
      tabs,
      city: currentCityCode,
      visible,
      delayCheckNum: delayCheckNumShow,
      visibleCourier,
      onSearch,
      ...list_tables,
      readyListTables,
      outsideCourier,
    };

    // 传给列表的数据
    const tableProps = {
      ...list_tables,
      onPageChange,
      page,
      listType,
      dispatch,
      tabs,
      city: currentCityCode,
      pageFlage,
    };

    const teamCityListProps = {
      serviceCityList,
    };
    //团队列表
    const TreeList = businessCourier.teamList.data;
    //判断Tree组件默认选中的key
    const defaultSelect = [tabs || '所有骑士'];
    //根据不同的选择加载相应的组件
    if (tabs == '所有骑士') {
      content.push('所有骑士');
    }
    if (tabs == '待审核骑士') {
      content.push(<Authstr {...searchProps} key="all-4" />);
    }
    if (tabs !== '所有骑士' && tabs !== '待审核骑士') {
      content.push(<TeamSearch {...searchProps} key="all-5" />);
    }

    return (
      <div className="con-body main-list">
        <Row>
          <div className={style.courierAll}>
            <Col sm={5}>
              {/* 城市 */}
              {/* <div className="bd-content" style={{ marginRight: 16, marginTop: 0 }}>
                <TeamCity cityChange={this.cityChange} {...teamCityListProps} />
              </div> */}

              {/* 团队 */}
              <div className="bd-content" style={{ marginRight: 16, marginTop: 0, maxHeight: '500px', overflowY: 'scroll' }}>

                {/* 标题栏目 */}
                <Form layout="horizontal" className="main-form" style={{ padding: '0px 0px 0px 30px' }}>
                  <Row className="form-divider-header" style={{ marginBottom: '10px' }}>
                    <Col span={20}>团队</Col>
                    <Col span={4} style={{ textAlign: 'right' }}>
                      <a onClick={this.showModal}><Icon style={{ fontSize: '16px', color: '#00CFA1', fontWeight: 'bold' }} type="plus" /></a>
                      <Modal title="添加新团队" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} style={{ top: '35%' }}>
                        <Row>
                          <Col sm={24}>
                            <Form onSubmit={this.handleOk}>
                              <FormItem label="当前城市" {...itemLayout}>
                                <div>{geography.cityName(currentCityCode)}</div>
                              </FormItem>
                              <FormItem label="团队名称" {...itemLayout}>
                                {
                                  getFieldDecorator('name', {
                                    validate: [
                                      { rules: [{ required: true, message: '请输入团队名称' }], trigger: 'onBlur' },
                                    ],
                                  })(
                                    <Input placeholder="请输入团队名称" />,
                                  )
                                }
                              </FormItem>
                            </Form>
                          </Col>
                        </Row>
                      </Modal>
                    </Col>
                  </Row>
                </Form>

                {/* 团队数据展示 */}
                <Tree onSelect={this.onSelect} selectedKeys={defaultSelect} defaultExpandAll>
                  <TreeNode title={`所有团队  (${TreeList.length})`} key="所有团队">
                    {
                      TreeList.map((item, index) => {
                        return (
                          <TreeNode title={`${item.name} (${item.courier_count})`} key={item.id} />
                        )
                      })
                    }
                  </TreeNode>
                </Tree>
              </div>

              {/* 骑士 */}
              <div className="bd-content" style={{ marginRight: 16, marginTop: 0, marginBottom: 60 }}>

                {/* 标题栏目 */}
                <Form layout="horizontal" className="main-form" style={{ padding: '0px 0px 0px 30px' }}>
                  <Row className="form-divider-header" style={{ marginBottom: '10px' }}>
                    <Col span={24}>骑士</Col>
                  </Row>
                </Form>

                {/* 骑士数据展示 */}
                <Tree onSelect={this.onSelect} selectedKeys={defaultSelect} defaultExpandAll>
                  <TreeNode title={`所有骑士  (${courierNumber || 0})`} key="所有骑士" />
                  <TreeNode title={`待审核骑士  (${delayCheckNumShow})`} key="待审核骑士" />
                </Tree>
              </div>

            </Col>
            <Col sm={19} style={{ background: '#ffffff', paddingBottom: 50, marginBottom: 16 }}>
              <div className={style.courierRightModel}>
                {content.length == 0 || content[0] == '所有骑士' ?
                  <div>
                    <div className="bd-header" key="all-1">
                      <Search {...searchProps} key="all-2" />
                    </div>
                  </div> : content}
                <div style={{ padding: '0 16px 16px 16px' }}>
                  <List {...tableProps} key="all-3" />
                </div>
              </div>
            </Col>
          </div>
        </Row>
      </div>
    );
  }

}

View = Form.create()(View)

//从 model 层取数据
function

mapStateToProps({ businessCourier }) {
  return { businessCourier };
}

// 连接Model 层
module.exports = connect(mapStateToProps)(View);
