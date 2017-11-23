// 添加项目

import dot from 'dot-prop'
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Row, Switch, Dropdown, Menu, Popconfirm, Icon, Button, Badge, Select, Modal, message, Input } from 'antd';
import { ProjectManage } from '../../../actions';
import { authorize } from '../../../../application';
import Search from '../core/subSearch';
import Table from '../core/subTable';
import style from '../style.less';
//引入枚举值
import { DIRECT, ADD_NEW_PROJECT, ADD_NEW_PROJECT_COLUMNS } from '../core/enumerate.js'
const [FormItem, Option, confirm] = [Form.Item, Select.Option, Modal.confirm];
const {
  getNewProjectList,
  addNewProject,
  updateAddNewProjectState,
  getSignSellerLists,
} = ProjectManage;

class AddProject extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.state = {
      addVisible: false,                                      //添加面板显示状态
      dataSource: {
        _meta: [],
        data: [],
      },
    }
    this.private = {
      dispatch,
      columns: [],
      vendor_id: authorize.auth.vendorId,
      city_code: dot.get(authorize.vendor, 'city.code'),
      operatorId: authorize.account.id,                        //操作人ID
      state: 1,
      contract_type: 10,                                      //签约类型为直营
      page: 1,                                                //初始化请求page
      limit: 10,
      addProjectName: '',
      itemLayout: { labelCol: { span: 7 }, wrapperCol: { span: 14 } },
    };

    // 获取项目列表请求
    this.renderProjectList = this.renderProjectList.bind(this);
    // 查询直营项目钩子函数
    this.searchHandle = this.searchHandle.bind(this);
    // 添加项目
    this.addProject = this.addProject.bind(this);
  }

  componentWillMount() {
    const { renderProjectList, addProject } = this;
    const operateCallback = (record) => {
      return (
        <a onClick={() => addProject(record)}>添加</a>
      )
    }

    this.private.columns = ADD_NEW_PROJECT_COLUMNS(operateCallback);

    // 初始化请求，获取全部直营项目申请合作项目列表
    renderProjectList({})
  }


  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.private;
    const { ProjectManage } = nextProps;
    const {
      sellerList,
      addprojectState,
    } = ProjectManage;

    // 添加项目完成，更新列表
    if (addprojectState) {
      const state = false;
      message.success('添加成功');
      // 获取全部直营项目申请合作项目列表
      this.renderProjectList({})
      // 重置添加项目状态
      dispatch({ type: updateAddNewProjectState, payload: { state } })
    }
    this.setState({
      dataSource: sellerList,
    })
  }

  // 查询新项目钩子函数
  searchHandle(params) {
    const { renderProjectList } = this;
    renderProjectList(params)
  }

  // 添加项目
  addProject(record) {
    const { dispatch, operatorId } = this.private;
    confirm({
      title: '添加后生成新的直营合作项目，需要进行相关项目配置，是否确认添加？',
      onOk() {
        // 调编辑接口
        const params = {
          contractId: record.id,
          operatorId,
        }
        dispatch({ type: addNewProject, payload: params })
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  // 获取项目列表请求
  renderProjectList(params) {
    const { dispatch, page, vendor_id, city_code, state, limit } = this.private;
    const { sellerNo, sellerName } = params;
    const listParams = {
      vendor_id: params.vendor_id || vendor_id,
      city_code: params.city_code || city_code,
      state: params.state || state,
      limit: params.limit || limit,
      page: params.page || page,
      seller_no: sellerNo,
      seller_name: sellerName,
    };

    dispatch({ type: getSignSellerLists, payload: listParams })
  }

  render() {
    const { columns, contract_type } = this.private;
    const { dataSource, addVisible } = this.state;
    const { searchHandle, renderProjectList, AddModal } = this;
    console.log(dataSource)
    // 页码
    const pagination = {
      total: dataSource._meta.result_count || 0,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      onChange: (current) => {
        const page = current;
        const listParams = {
          page,
        }
        renderProjectList(listParams)
      },
    }
    const searchParams = {
      type: ADD_NEW_PROJECT,
      searchHandle,
    }
    const tableParams = {
      columns,
      dataSource,
      pagination,
    }
    return (
      <div className={`${style.component} con-body main-list`}>
        {/* 渲染条件筛选组件 */}
        <div className="bd-content">
          <Search {...searchParams} />
        </div>
        {/* 渲染table */}
        <div className="bd-content">
          <p>备注：以下为申请与当前服务商合作的商家申请签约记录，添加后将生成新的合作项目，请与商家确认后再同意添加。</p>
          <Table {...tableParams} />
        </div>
      </div>
    )
  }
}

function mapStateToProps({ ProjectManage }) {
  return { ProjectManage };
}

export default connect(mapStateToProps)(Form.create()(AddProject));
