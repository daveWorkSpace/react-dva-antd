import React, { Component } from 'react';
import { connect } from 'dva';
import dot from 'dot-prop';
import { Table, Tooltip, Icon, Popconfirm, Switch, InputNumber } from 'antd';
import Storage from '../../../../../application/library/storage';
import { geography, authorize } from '../../../../../application';
import { CoreContent } from '../../../../core';
import { SendOrderRules } from '../../../../actions.js';
import { sopRulesType } from '../../../../../application/define'

const { getSopRulesList, updateSopRulesList, createSopRulesList } = SendOrderRules;

class SopRules extends Component {
  constructor(props) {
    super(props);
    const { dispatch, SendOrderRules } = props;
    this.state = {
      sopRulesList: SendOrderRules.sopRulesList,
      sopRulesDataSorce: [
        {
          key: '1',
          sop_id: 'accepted',
        },
        // {
        //   key: '2',
        //   sop_id: 'stockIn',
        //   state: '',  
        // },
        
      ],
    }
    this.private = {
      dispatch,
      storage: new Storage('direct', { useSession: true }),  // 初始化storage
      vendor_id: authorize.vendor.id,
      operator_id: authorize.account.id,
    }
  }

  componentWillMount() {
    // 获取标准规则列表
    const { dispatch, storage } = this.private;
    dispatch({
      type: getSopRulesList,
      payload: {
        contract_id: storage.get('contract_id')
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { sopRulesList } = nextProps.SendOrderRules;
    const { sopRulesDataSorce } = this.state;
    this.setState({
      sopRulesList,
    });
    
    // 处理标准规则数据
    if (dot.get(sopRulesList,'data').length > 0) {
      sopRulesList.data.map( (item, index )=> {
        for (let i = 0; i < sopRulesDataSorce.length; i++ ){
          // == 先转化再比较  === 不转化直接比较
          if (sopRulesDataSorce[i].sop_id == item.sop_id){
            sopRulesDataSorce[i] = item;
            this.setState({sopRulesDataSorce });
          }
        }
      });
    }
  }

  // 强制扫码状态切换
  onHandleScanSwitch = (e) => {
    // ruleId 存在调用编辑接口 否则调用创建接口
    console.log('checkedId--',e);
    const { dispatch, storage, vendor_id, operator_id } = this.private;

    if (dot.get(e,'id') && dot.get(e,'id') !== '') {
      // 编辑接口
      const { vendor_id, seller_id, contract_id, sop_id, operator_id,  priority } = e
      const values = {
        vendor_id, 
        seller_id, 
        contract_id, 
        sop_id, 
        operator_id, 
        priority,
        state: e.state == 100 ? -100 : 100,
      }
       dispatch({
         type: updateSopRulesList,
         payload: {
          rule_id: e.id,
          values
         }
       });
    } else {
      // 创建接口  签约ID同项目签约ID一致
      const seller_id =  storage.get('seller_id');      
      const contract_id = storage.get('contract_id');
      const sop_id = e.sop_id
      const priority = 1;        // 优先级
       dispatch({
         type: createSopRulesList,
         payload: {
           vendor_id,
           seller_id,
           contract_id,
           sop_id,
           operator_id,
           priority,
           state: 100,
         }
       });
    }

  }

  // 处理骑士距离限制
  onHandleDisSwitch = ()=> {

  };
  // 强制扫码模块
  forceScanSetting = () => {
    const { sopRulesDataSorce } = this.state;

    const columns = [
      {
        title: '订单操作项',
        dataIndex: 'sop_id',
        key: 'sop_id',
        render: (text,record)=>{
          return sopRulesType[text];
        }
      }, {
        title: (
          <div>是否强制扫码&nbsp;
              <Tooltip title="设置强制扫码，对应项目服务商或骑士在操作订单时只能通过扫码操作" arrowPointAtCenter>
                <Icon type="info-circle" />
              </Tooltip>
          </div>
            ),
        dataIndex: 'state',
        key: (text, record)=>{return `${record.id} ? ${record.id} : ${record.sop_id}+${record.state}` },
        render: (text, record) => {
          return (
            <Popconfirm
              title = { text == 100? 
              <div>确认关闭强制扫码？
                <p>备注：关闭强制扫码后，对应项目骑士在对应环节操作订单时能通过扫码或手动操作</p>
              </div>
              : 
              <div>确认开启强制扫码？
                <p>备注：开启强制扫码后，对应项目骑士在对应环节操作订单时只能通过扫码操作</p>
              </div>
              }
              placement="top"
              okText="确认"
              cancelText="取消"
              onConfirm = { ()=>{this.onHandleScanSwitch(record)} }
            >
              <a>
                <Switch
                  checked={text === 100} 
                  checkedChildren={'是'}
                  unCheckedChildren={'否'}
                />
              </a>
            </Popconfirm>
          )
        }
      }
    ];
    
    return (
      <CoreContent title={'强制扫码设置'}>
        <Table 
          dataSource={ sopRulesDataSorce }
          columns={ columns } 
          rowKey={(record, index) => { return index }}
          pagination={ false }
        />
      </CoreContent>
    )
  }

  // 末端取送货确认距离限制模块
  distanceSetting = () => {
    const columns = [
      {
        title: '取送货',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '是否距离限制',
        dataIndex: 'distance',
        key: 'distance',
        render: (text, record) => {
          return (
            <Switch
              defaultChecked={record.distance === 1} 
              checkedChildren={'是'}
              unCheckedChildren={'否'}
              onChange={ this.onHandleDisSwitch}
            />
          )
        }
      }, {
        title: '限制距离',
        dataIndex: 's',
        key: 's',
        render: (text, record) => {
          const inputNumber = <InputNumber min={0} max={10} disabled={true} defaultValue={text} />
          return (
            <div>离取货地小于 { inputNumber } km</div>
          )
        }
      }
    ];

    const dataSource = [
      {
        key: 1,
        name: '取货',
        distance: 1,
        s: 0.2
      }
    ]
    return (
      <CoreContent title={'末端取送货确认距离限制'}>
        <Table 
          dataSource={ dataSource }
          columns={ columns } 
          pagination={ false }
        />
      </CoreContent>
    )
  }

  render() {
    const { forceScanSetting, distanceSetting } = this;
    return (
      <div className={`con-body main-list`}>
        {/* 强制扫码模块 */}
        { forceScanSetting() }
        {/* 末端取送货确认距离限制模块 */}
        {/* { distanceSetting() } */}
      </div>
    )
  }
}
function mapStateToProps({ SendOrderRules }) {
  return { SendOrderRules };
}
export default connect(mapStateToProps)(SopRules);

