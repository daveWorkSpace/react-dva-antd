// 历史项目
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Row, Switch, Dropdown, Menu, Popconfirm, Icon, Button, Badge, Select, Modal } from 'antd';
import { ProjectManage } from '../../../actions';
import Search from '../core/subSearch';
import Table from '../core/subTable';
import style from '../style.less';
//引入枚举值
import { DIRECT, ADD_NEW_PROJECT, AFFILIATE_HISTORY_PROJECT_COLUMNS } from '../core/enumerate.js'
const {
    getHistoryProject,
} = ProjectManage;

const FormItem = Form.Item;
const Option = Select.Option;


class HistoryProject extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    // 表单数据
    this.state = {
      dataSource: {
        _meta: [],
        data: [],
      },
    }
    this.private = {
      dispatch,
      columns: [],                            //表单头数据
      contract_type: 20,                                      //类型为加盟
      page: 1,                                                //初始化请求page
    }
        // 获取项目列表请求
    this.renderProjectList = this.renderProjectList.bind(this);
        // 查询直营项目钩子函数
    this.searchHandle = this.searchHandle.bind(this);
  }

  componentWillMount() {
    const { page } = this.private;
    const { renderProjectList } = this;
        // 操作回调
    const operateCallback = record => (
      <span>
        <Link>商家信息</Link>
      </span>
        );

    this.private.columns = AFFILIATE_HISTORY_PROJECT_COLUMNS(operateCallback);
    const listParams = {
      page,
    }
        // 初始化请求，获取全部直营项目管理列表
    renderProjectList(listParams)
  }

  componentWillReceiveProps(nextProps) {
    const { ProjectManage } = nextProps;
    const {
            HistoryProjectList,
        } = ProjectManage;
    this.setState({
      dataSource: HistoryProjectList,
    })
  }

    // 获取项目列表请求
  renderProjectList(params) {
    const { dispatch } = this.private;
    dispatch({ type: getHistoryProject, payload: params })
  }

    // 查询新项目钩子函数
  searchHandle(params) {
    const { renderProjectList } = this;
    renderProjectList(params)
  }

  render() {
    const { columns, contract_type } = this.private;
    const { dataSource } = this.state;
    const { searchHandle, renderProjectList } = this;
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
          contract_type,
          page,
        }
        renderProjectList(listParams)
      },
    }
    const searchParams = {
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
        <div className="bd-header">
          <Search {...searchParams} />
        </div>
        {/* 渲染table */}
        <div className="bd-content">
          <Table {...tableParams} />
        </div>
      </div>
    )
  }
}

function mapStateToProps({ ProjectManage }) {
  return { ProjectManage };
}

export default connect(mapStateToProps)(Form.create()(HistoryProject));
