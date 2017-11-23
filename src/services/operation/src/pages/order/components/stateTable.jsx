
import React from 'react';
import { Link } from 'dva/router';
import { Table, Badge, Pagination } from 'antd';

import style from './style.less';
import { OrderListState, OrderParams } from '../../exports'

//优化代码－－－
function getSource(styleName, key, name) {
  return {
    title: <span><Badge className={style.minCircle_1} />name</span>,
    dataIndex: 'states',
    key: 'key',
    render: (states, row, index) => { return states[OrderListState.key] || 0 },
  }
}

const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;

class StateTable extends React.Component {
  constructor(props) {
    super();
    //初始化商家列表－状态
    this.state = {
      sellerOrderList: props.sellerOrderList,
      sellerMeta: props.sellerMeta,
      date: props.date,
      current: props.current,
      cityCode: props.cityCode,
    };
    //初始化商家列表－方法
    this.private = {
      onPageChange: props.onPageChange,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    //update 商家列表
    this.setState({
      sellerOrderList: nextProps.sellerOrderList,
      sellerMeta: nextProps.sellerMeta,
      date: nextProps.date,
      current: nextProps.current,
      cityCode: nextProps.cityCode,
    });
  };

  //update 页码
  onPageChange = (page) => {     //当前页
    this.setState({ current: page });
    this.private.onPageChange(page);
  };

  //保存商户ID 商户名 签约ID
  saveId = (record) => {
    sessionStorage.setItem('sellerId', record.seller_id);
    sessionStorage.setItem('sellerName', record.seller_name);
    sessionStorage.setItem('contractId', record.contract_id);
  };

  render() {
    const { sellerOrderList, sellerMeta, date, current, cityCode } = this.state;
    const { onPageChange } = this;

    const columns = [
    // {
    //   title: '项目',
    //   dataIndex: 'seller_name',
    //   key: 'sellerName',
    //   render: (text, record) => (
    //     <span> <Link to={`/operation/order/seller?sellerId=${record.seller_id}&date=${date}&sellerName=${record.seller_name}&cityCode=${cityCode}`}>{ record.seller_name }</Link> </span>
    //   ),
    // },
      {
        title: '区域',
        dataIndex: 'area',
        key: 'area',
      },
      {
        title: '运力服务商',
        dataIndex: 'capacity-provider',
        key: 'capacity-provider',
      },
      {
        title: '总订单',
        dataIndex: 'order_count',
        key: 'total',
      },
      {
        title: <span><Badge className={style.minCircle_2} />已确认</span>,
        dataIndex: 'states',
        key: 'confirmed',
        render: (states, row, index) => { return states[OrderListState.confirmed] || 0 },
      }, {
        title: <span><Badge className={style.minCircle_4} />配送中</span>,
        dataIndex: 'states',
        key: 'distribution',
        render: (states, row, index) => { return states[OrderListState.distribution] || 0 },
      }, {
        title: <span><Badge className={style.minCircle_3} />异常</span>,
        dataIndex: 'states',
        key: 'exception',
        render: (states, row, index) => { return states[OrderListState.exception] || 0 },
      }, {
        title: <span><Badge className={style.minCircle_5} />未完成</span>,
        dataIndex: 'states',
        key: 'undone',
        render: (states, row, index) => {
          //已确认订单数
          const confirmedNumber = states[OrderListState.confirmed] ? states[OrderListState.confirmed] : 0;
          //配送中订单数
          const distributionNumber = states[OrderListState.distribution] ? states[OrderListState.distribution] : 0;
          //异常订单数
          const exceptionNumber = states[OrderListState.exception] ? states[OrderListState.exception] : 0;
          //已创建
          const createdNumber = states[OrderListState.created] ? states[OrderListState.created] : 0;
          //未完成订单数
          return (confirmedNumber + distributionNumber + exceptionNumber + createdNumber);
        },
      }, {
        title: <span><Badge className={style.minCircle_6} />已送达</span>,
        dataIndex: 'states',
        key: 'done',
        render: (states, row, index) => { return states[OrderListState.done] || 0 },
      }, {
        title: <span><Badge className={style.minCircle_7} />已取消</span>,
        dataIndex: 'states',
        key: 'canceled',
        render: (states, row, index) => { return states[OrderListState.canceled] || 0 },
      }, {
        title: '完成率',
        dataIndex: 'states',
        key: 'completeRate',
        render: (text, record, index) => {
        //总数:   ＊＊总数为0
          const totalNum = record.order_count ? record.order_count : 0;
        //已完成: ＊＊完成数为0
          const doneNum = text[OrderListState.done] ? text[OrderListState.done] : 0;
        //完成率：＊＊总数为0
          const rate = totalNum !== 0 ? doneNum / totalNum : 0;
          let completeRate = rate * 100;
        //取两位小数
          completeRate = `${completeRate.toFixed(2).toString()}%`;
          return completeRate && completeRate;
        },
      },
    // {
    //   title: '操作',
    //   key: 'operation',
    //   render: (text, record) => {
    //     if (record.contract_id) {
    //       return <Link to={`/business/manage/retail/orderDispatchRules?id=${record.seller_id}`} onClick={this.saveId.bind(this, record)} >分单规则调整</Link>
    //     }
    //     return ''
    //   },
    // }
    ];
    const totalNum = sellerMeta && sellerMeta.result_count > 0 ? sellerMeta.result_count : 0;
    const pagination = {
      total: totalNum,
      current,
      pageSize: requestPagerSize,
      onChange: onPageChange,
    };
    const paginationShow = totalNum > 0 ? <Pagination className="ant-table-pagination" {...pagination} showTotal={total1 => `共 ${totalNum} 条`} /> : '';
    return (
      <div>
        <Table rowKey={(record, index) => { return index }} dataSource={sellerOrderList} columns={columns} pagination={false} />
        {
          paginationShow
        }
      </div>
    );
  }
}
module.exports = StateTable;
