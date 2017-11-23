import React, { Component, PropTypes } from 'react';
import { Button, Table, Pagination, Popconfirm } from 'antd';
import { Link } from 'dva/router';
import { stateTransform } from '../../../../../../utils/newUtils';
import { authorize } from '../../../../../../application';

const { utcToDate } = window.tempAppTool;

const List = ({ data, _meta, page, loading, onPageChange, listType, dispatch, tabs, city, pageFlage }) => {
  //团队成员删除
  function teamListDelete(index) {
    // 获取点击删除的骑士Id
    const courier_ids = data[index].id;
    // 将删除的骑士Id 及所属的团队Id 传给model层
    const city_code = city;
    dispatch({ type: 'businessCourier/removeTeamMember', payload: { courier_ids, tabs, city_code } });
  }
  // 存储骑士列表的状态(所有骑士、待审核骑士、团队)，从子页面返回主页时 需要，model监测的是路由地址 有冲突
  function setTreeSelect(value) {
    const id = value;
    const city_code = city;
    sessionStorage.setItem('tabs', tabs);
    sessionStorage.setItem('listType', listType);

    dispatch({ type: 'businessCourier/getCourierDetailE', payload: { id } });
    dispatch({ type: 'businessCourier/getTeam', payload: { vendor_id: authorize.auth.vendorId, city_code } })
  }

  //根据tabs 的长度判断操作为什么
  let columns = []
  if (tabs === '所有骑士') {
    columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '工号',
        dataIndex: 'code',
        key: 'code',
        render: (text, record) => (
          <Link
            style={{
              color: '#00CFA1',
            }} to={`/team/courier/list/detail?id=${record.id}`}
            onClick={setTreeSelect.bind(this, record.id)}
          >{text}</Link>
        ),
      }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      }, {
        title: '员工类型',
        dataIndex: 'work_type',
        key: 'work_type',
        render: (text) => {
          return stateTransform('work_type', text);
        },
      }, {
        title: '在岗状态',
        dataIndex: 'work_state',
        key: 'work_state',
        render: (text) => {
          return stateTransform('duty_state', text);
        },
      },
      {
        title: '员工状态',
        dataIndex: 'state',
        key: 'courier_state',
        render: (text, record) => {
          return stateTransform('jobState', text);
        },
      },
      {
        title: '审核状态',
        dataIndex: 'verify_state',
        key: 'id2',
        render: (text) => {
          return stateTransform('verify_state', text);
        },
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => {
          const _date = utcToDate(text);
          _date.time.length = 2;
          return `${_date.date.join('-')}  ${_date.time.join(':')}`;
        },
      }, {
        title: '操作',
        dataIndex: 'verify_state',
        key: 'verify_state',
        render: (text, record) => {
          return (
            <p>
              <Link
                style={{
                  color: '#00CFA1',
                }} to={`/team/courier/list/edit?id=${record.id}`}
                onClick={setTreeSelect.bind(this, record.id)}
              >编辑</Link>
            </p>
          )
        },
      },
    ]
  } else if (tabs === '待审核骑士') {
    columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '工号',
        dataIndex: 'code',
        key: 'code',
        render: (text, record) => (
          <Link
            style={{
              color: '#00CFA1',
            }} to={`/team/courier/list/detail?id=${record.id}`}
            onClick={setTreeSelect.bind(this, record.id)}
          >{text}</Link>
        ),
      }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      }, {
        title: '员工类型',
        dataIndex: 'work_type',
        key: 'work_type',
        render: (text) => {
          return stateTransform('work_type', text);
        },
      }, {
        title: '在岗状态',
        dataIndex: 'work_state',
        key: 'work_state',
        render: (text) => {
          return stateTransform('duty_state', text);
        },
      },
      {
        title: '员工状态',
        dataIndex: 'state',
        key: 'courier_state',
        render: (text, record) => {
          return stateTransform('jobState', text);
        },
      },
      {
        title: '审核状态',
        dataIndex: 'verify_state',
        key: 'id2',
        render: (text) => {
          return stateTransform('verify_state', text);
        },
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => {
          const _date = utcToDate(text);
          _date.time.length = 2;
          return `${_date.date.join('-')}  ${_date.time.join(':')}`;
        },
      }, {
        title: '操作',
        dataIndex: 'verify_state',
        key: 'verify_state',
        render: (text, record) => {
          return (
            <p>
              <Link
                style={{
                  color: '#00CFA1',
                }} to={`/team/courier/list/check?id=${record.id}`}
                onClick={setTreeSelect.bind(this, record.id)}
              >审核</Link>

            </p>
          )
        },
      },
    ]
  } else {
    columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '工号',
        dataIndex: 'code',
        key: 'code',
        render: (text, record) => (
          <Link
            style={{
              color: '#00CFA1',
            }} to={`/team/courier/list/detail?id=${record.id}`}
            onClick={setTreeSelect.bind(this, record.id)}
          >{text}</Link>
        ),
      }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      }, {
        title: '员工类型',
        dataIndex: 'work_type',
        key: 'work_type',
        render: (text) => {
          return stateTransform('work_type', text);
        },
      }, {
        title: '在岗状态',
        dataIndex: 'work_state',
        key: 'work_state',
        render: (text) => {
          return stateTransform('duty_state', text);
        },
      },
      {
        title: '员工状态',
        dataIndex: 'state',
        key: 'courier_state',
        render: (text, record) => {
          return stateTransform('work_state', text);
        },
      },
      {
        title: '审核状态',
        dataIndex: 'verify_state',
        key: 'id2',
        render: (text) => {
          return stateTransform('verify_state', text);
        },
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => {
          const _date = utcToDate(text);
          _date.time.length = 2;
          return `${_date.date.join('-')}  ${_date.time.join(':')}`;
        },
      }, {
        title: '操作',
        dataIndex: 'verify_state',
        key: 'verify_state',
        render: (text, record, index) => {
          return (
            <p>
              <span
                onClick={teamListDelete.bind(this, index)}
                style={{ color: '#00CFA1', cursor: 'pointer' }}
              >删除</span>
            </p>
          )
        },
      },
    ]
  }
  const pagination = {
    total: _meta.result_count || 0,
    current: pageFlage ? page : 1,
    pageSize: 10,
    onChange: onPageChange,
  };
  const total1 = _meta.result_count;
  return (
    <div>
      <Table rowKey={record => record.code} columns={columns} dataSource={data} loading={loading} pagination={false} />
      <Pagination
        className="ant-table-pagination"
        {...pagination}
        showTotal={total1 => `共 ${total1} 条`}
      />
    </div>
  );
};


module.exports = List;
