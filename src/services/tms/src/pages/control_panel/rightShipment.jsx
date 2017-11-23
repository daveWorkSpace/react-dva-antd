import dot from 'dot-prop';
import React from 'react';
import moment from 'moment';
import { Row, Col, Button, Table, Radio } from 'antd';
import { Link } from 'dva/router';
import { DeliveryOrderState } from '../../../../../application/define';
import { GetDateDiff } from '../../../../../utils/newUtils.js';

const [RadioButton, RadioGroup] = [Radio.Button, Radio.Group];
// 从全局变量中获取
const { stateTransform, utcToDate } = window.tempAppTool;
/*按钮TAB的配置*/
const radioArr = [
  {
    txt: '待分配',
    field: 'confirm',
    val: '8',
    overtime: true,
  },
  {
    txt: '已接单',
    field: 'accepted',
    val: '1',
    overtime: true,
  }, {
    txt: '已取货',
    field: 'pickup',
    val: '2',
    overtime: true,
  }, {
    txt: '未完成',
    field: 'unfinished',
    val: '3',
    overtime: true,
  }, {
    txt: '异常',
    field: 'error',
    val: '4',
    overtime: false,
  }, {
    txt: '已送达',
    field: 'done',
    val: '5',
    overtime: false,
  }, {
    txt: '已取消',
    field: 'closed',
    val: '6',
    overtime: false,
  }, {
    txt: '全部',
    field: 'total',
    val: '7',
    overtime: false,
  },
];

// 订单状态  根据此状态判断其是否可以改派 / 指派
const orderState = {
  state: '',
}

class RightShipment extends React.Component {
  constructor(props) {
    super(props);
    const { shipments_stats, page, shipments, handleSelect, selectedRowKeys, saveOrderState } = props;

    this.state = {
      shipments_stats,
      page,
      shipments,
      handleSelect,
      selectedRowKeys,
      saveOrderState,
    }
    this.private = {
      onPageChange: props.onPageChange,  //分页回调
      stateChange: props.stateChange,    //切换tabs
    }

    // const countDownList =
  }

  componentWillReceiveProps = (nextProps) => {
    const { shipments_stats, page, shipments, handleSelect, selectedRowKeys, saveOrderState } = nextProps;

    this.setState({
      shipments_stats,
      page,
      shipments,
      handleSelect,
      selectedRowKeys,
      saveOrderState,
    })
  }

  componentDidMount() {
    //判断当前是否有tab key，有则模拟点击
    // const areaInfo = window.sessionStorage && JSON.parse(sessionStorage.getItem('AREAINFO'))
    const selectTabIndex = window.sessionStorage && JSON.parse(sessionStorage.getItem('SELECT_TAB_INDEX'));

    const unmountKey = window.sessionStorage && JSON.parse(sessionStorage.getItem('COMPONENT_UNMOUNT'));

    // 选中tab按钮
    if (unmountKey && (selectTabIndex || selectTabIndex === 0)) {
      const antRadioButtonList = document.querySelectorAll('.ant-radio-button-wrapper > .ant-radio-button')
      antRadioButtonList[selectTabIndex].click();
    }
  }

  componentWillUnmount() {
    //组件卸载 key
    window.sessionStorage && sessionStorage.setItem('COMPONENT_UNMOUNT', JSON.stringify(1));
    //卸载组件时，删除记录的状态  ！！！浏览器刷新非组件卸载
    // window.sessionStorage && sessionStorage.removeItem('SELECT_TAB_INDEX');
    // window.sessionStorage && sessionStorage.removeItem('AREAINFO');
  }

  getCurrentSelectTab = (e, sort = {}) => {
    const { stateChange } = this.private;

    stateChange('shipments', e.target.value, sort)

    window.sessionStorage && sessionStorage.setItem('TAB_VALUE', JSON.stringify(e.target.value));

    //存储key值
    (e.target.data_key || e.target.data_key === 0) && window.sessionStorage && sessionStorage.setItem('SELECT_TAB_INDEX', JSON.stringify(e.target.data_key));
  }

  //排序 
  handleTableChange = (pagination, filters, sorter) => {
    console.log('sorter', sorter);
    const { stateChange } = this.private;

    //获取当前的tab值
    const tabValue = window.sessionStorage && JSON.parse(sessionStorage.getItem('TAB_VALUE'));

    //正序 or 倒序（默认）
    const sort = {}
    const field = dot.get(sorter, 'field');
    sort[field] = (dot.get(sorter, 'order') === 'ascend') ? 1 : -1;
    stateChange('shipments', tabValue, sort, dot.get(pagination, 'current', 1));
  };

  renderTabs = () => {
    const { shipments_stats } = this.state;

    return (
      <RadioGroup style={{ width: '100%', marginLeft: '0px' }} defaultValue="1" onChange={(e) => { this.getCurrentSelectTab(e) }} >
        {
          radioArr.map((item, index) => {
            const _stats = item.field === 'unfinished' ?
              (shipments_stats.total - shipments_stats.done - shipments_stats.closed)
              : shipments_stats[item.field];
            return <RadioButton key={index} data_key={index} value={item.val}>{item.txt}({_stats || 0})</RadioButton>
          })
        }
      </RadioGroup>
    );
  }

  renderTable = () => {
    // 从props里面获取信息
    const { page, shipments, handleSelect, selectedRowKeys, saveOrderState } = this.state;
    const { onPageChange } = this.private;

    const columns = [
      {
        title: '状态',
        key: 'delivery_state',
        dataIndex: 'delivery_state',
        render: (text, record) => {
          return DeliveryOrderState.description(text);
        },
      }, {
        title: '期望时间',
        key: 'shipping_time',
        dataIndex: 'shipping_time',
        sorter: true,
        render: (text, record) => {
          //期望时间
          const shipTime = moment(text);
          //当前时间
          const now = moment();

          //时间
          const datetime = utcToDate(text);
          datetime.time.length = 2;

          //倒计时
          let countDown = '';
          // 颜色
          let color = '';
          // 计算时间差
          const time = GetDateDiff(now, shipTime, 'minute');
          
          if (time >= 0 && time < 60) {
            color = 'rgb(64, 122, 71)';
            if (time < 30){
              color = '#FF9901';
            }
            countDown = ` 剩余 ${time}分钟`
          }
          if (time >= 60) {
            color = 'rgb(64, 122, 71)';
            const hours = Math.floor(time / 60);
            const minute = time - hours*60;
            const hoursText = hours > 0 ? (hours + '小时') : '';
            const minuteText = minute > 0 ? (minute + '分钟') : ''
            countDown = ` 剩余 ${ hoursText + minuteText}`
          }
          // 超出时间
          if (time < 0 && time > -60){
            color = '#FF0000';
            countDown = ` 超出 ${-time} 分钟`
          }
          if (time <= -60){
            color = '#FF0000';
            const hours = Math.floor(-time / 60);
            const minute = -time - hours*60;

            const hoursText = hours > 0 ? (hours + '小时') : '';
            const minuteText = minute > 0 ? (minute + '分钟') : ''

            countDown = ` 超出  ${ hoursText + minuteText}`
          }

          // 判断当前时间是否在期望时间之前
          // if (moment().isBefore(text)) {

          //   console.log(datetime, now);
          //   console.log('minute', );

          //   countDown = ` 剩余 ${now.from(shipTime, true)}`
          //   // 最小单位为分钟，小于1分钟按一分钟计
          //   if (now.from(shipTime, true) == '几秒') {
          //     countDown = ` 剩余 1 分钟`
          //   }

          //   color = '#FF9901';
          //   // 剩余时间超过30分钟时，显示绿色，小于30分钟显示橙色
          //   if (shipTime.diff(now, 'minute') > 30) {
          //     color = 'rgb(64, 122, 71)';
          //   }
          // }
          // // 判断当前时间是否在期望时间之后
          // if (moment().isAfter(text)) {
          //   countDown = ` 超出 ${now.from(shipTime, true)}`
          //   //
          //   if (now.from(shipTime, true) == '几秒') {
          //     countDown = ` 超出 1 分钟`
          //   }

          //   color = '#FF0000';
          // }

          return (
            <span>
              {datetime.time.join(':')}<br />
              <span style={{ color }}>{countDown}</span>
            </span>
          );
        },
      }, {
        title: '商家名称',
        key: 'seller.name',
        dataIndex: 'seller.name',
      }, {
        title: '顾客地址',
        key: 'consignee_address',
        dataIndex: 'consignee_address',
        width: '260px',
        render: (text, record) => {
          const _txt = text + record.consignee_address_detail;
          return (<a style={{ color: '#666' }} title={_txt}>{_txt}</a>);
        },
      }, {
        title: '骑士',
        key: 'courier_name',
        dataIndex: 'courier_name',
        render: (text, record) => {
          return record.courier ? record.courier.name : '';
        },
      }, {
        title: '操作',
        key: 'operate',
        dataIndex: 'operate',
        render: (text, record) => (
          <Link to={`/operations/details?id=${record.id}`}>详情</Link>
        ),
      },
    ];

    // 表格参数
    const tableProps = {

      rowSelection: {
        type: 'checkbox',
        selectedRowKeys, //选择行
        // 根据props来判断按钮是否可用
        // delivery_state 根据此状态进行改派判定按钮 ||record.delivery_state == 10
        getCheckboxProps(record) {
          const props = { disabled: true };
          const state = dot.get(record, 'delivery_state');
          if (state === DeliveryOrderState.accepted || state === DeliveryOrderState.arrived || state === DeliveryOrderState.pickup) {
            props.disabled = false;
          }
          // if (record.state === 50) {
          //   _result.disabled = false;
          //   if (record.state === 50) {
          //     orderState.state = 50; // 保存骑士已接单的状态
          //     /*this.props.saveOrderState(orderState.state);*/
          //   } else if (record.delivery_state == 10) {
          //     orderState.state = 10; // 保存订单待分配的状态
          //     /*this.props.saveOrderState(orderState.state);*/
          //   }

          return props;
        },
        onChange: handleSelect,
      },
      // 分页参数配置参考ant-design
      pagination: {
        total: shipments._meta.result_count || 0, //数据的总条数
        current: page,
        pageSize: 10,
        onChange: onPageChange,
      },
      columns,
      onChange: this.handleTableChange,
      rowKey: record => record.id,
      size: 'middle',
      dataSource: shipments.data,
      rowClassName: (record, index) => { //根据条件给行添加一个类
        let _className = '';
        if (record.reassign_record) {
          if (record.reassign_record.state === 50) {
            _className = 'aoao-reassign';
          }
        }
        return _className;
      },
    }
    return <Table {...tableProps} />
  }

  render() {
    const { renderTable, renderTabs } = this;
    return (
      <Col span={19} className="right-shipment">
        <Row style={{ height: '40px' }}>
          {renderTabs()}
        </Row>
        <Row style={{ height: 'calc(100% - 40px)', overflowY: 'auto', border: '1px solid #e9e9e9', borderLeft: 'none', padding: '10px' }}>
          {renderTable()}
        </Row>
      </Col>
    );
  }
}

module.exports = RightShipment;
