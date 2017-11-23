import dot from 'dot-prop'
import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Table, Badge, Pagination } from 'antd';

import style from './style.less';
import { OrderListState, OrderParams } from '../exports'
import Storage from '../../../../application/library/storage';
import { authorize } from '../../../../application';

//引入枚举值
import { DIRECT, AFFILIATE, DERECT_DETAIL, AFFILIATE_DETAIL } from '../enumerate'

const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;

//优化代码－－－
function getSource(styleName, key, name) {
  return {
    title: <span><Badge className={style.minCircle_1} />name</span>,
    dataIndex: 'states',
    key: 'key',
    render: (states, row, index) => { return states[OrderListState.key] || 0 },
  }
}

class StateTable extends Component {
  constructor(props) {
    super();
        //初始化商家列表－状态
    this.state = {
      sellerOrderList: props.sellerOrderList,
      sellerMeta: props.sellerMeta,
      date: props.date,
      current: props.current,
      cityCode: props.cityCode,
      isDirect: props.isDirect,
    };

    //初始化商家列表－方法
    this.private = {
      onPageChange: props.onPageChange,
      city_code: dot.get(authorize.vendor, 'city.code'),
      storage: new Storage('direct', { useSession: true }),
    }
    this.columns = [
      {
        title: '项目',
        dataIndex: 'seller_name',
        key: 'sellerName',
        render: this.renderLink,
      },
            // {
            //     title: '区域',
            //     dataIndex: 'area',
            //     key: 'area',
            // },
            // {
            //     title: '运力服务商',
            //     dataIndex: 'capacity-provider',
            //     key: 'capacity-provider',
            // },
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
                    //未完成订单数
          const createdNumber = states[OrderListState.created] ? states[OrderListState.created] : 0;

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
      }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => {
          if (record.contract_id) {
            //TODO:链接调整
            return <Link to={'/business/project/direct'} >分单规则调整</Link>
          }
          return ''
        },
      },
    ];
    // 保存商户id、 签约id 至缓存 , 选择tabs 缓存tabs key, 给 操作入口文件使用
    this.saveSellerInfo = this.saveSellerInfo.bind(this);
  }

  componentWillMount() {
    const { type } = this.props;
    if (type === AFFILIATE) {
      this.columns.splice(-1)
    }

    if (type === DERECT_DETAIL || type === AFFILIATE_DETAIL) {
      this.columns.splice(0, 1)
      this.columns.splice(-1)
      const content = [
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
      ]
      this.columns = content.concat(this.columns)
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
      isDirect: nextProps.isDirect,
    });
  };

    //update 页码
  onPageChange = (page) => {     //当前页
    this.setState({ current: page });
    this.private.onPageChange(page);
  };

  //保存商户id、 签约id 至缓存 , 选择tabs 缓存tabs key, 给 操作入口文件使用
  saveSellerInfo(tab, record) {
    const { storage, city_code } = this.private;
    const data = {
      tab,
      seller_id: record.seller_id,
      contract_id: record.contract_id,
      seller_name: record.seller_name,
      biz_mode: record.biz_mode,      //业务模式
      city_code,
      seller_record: record,
    }
    storage.set(data)
  }

  renderLink = (text, record) => {
    const { date, cityCode, isDirect } = this.state;
    return (
      <span> <Link to={`/operation/order/seller?sellerId=${record.seller_id}&date=${date}&sellerName=${record.seller_name}&cityCode=${cityCode}&isDirect=${isDirect}`}>{ record.seller_name }</Link> </span>
    );
  }

  render() {
    const { sellerOrderList, sellerMeta, date, current, cityCode } = this.state;
    const { onPageChange, columns } = this;

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
