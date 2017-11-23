// 中转仓设置
import dot from 'dot-prop';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Row, Icon, Button, Select } from 'antd';
import { BusinessStock } from '../../../../actions';
import Storage from '../../../../../application/library/storage';
import { geography, authorize } from '../../../../../application';
import style from '../../style.less';
import { CoreForm, CoreContent } from '../../../../core';

//引入枚举值
import { AFFILIATE, PROJECT_COLUMNS } from '../../core/enumerate'

const {
  getStockListByDirect,
  getStockDispatchRuleByDirect,
  createStockDispatchRuleByDirect,
  updateStockDispatchRuleByDirect,
} = BusinessStock;

const FormItem = Form.Item;
const Option = Select.Option;

class TransferStock extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.state = {
      // 直营仓库列表
      directStockList: {
        _meta: {},
        data: [],
      },
      // 当前仓库规则
      stockDispatchRule: {
        _meta: {},
        data: [],
      },
    }
    this.private = {
      dispatch,
      storage: new Storage('direct', { useSession: true }),              //缓存实例
      vendorId: authorize.auth.vendorId,
      cityCode: dot.get(authorize.vendor, 'city.code'),
      state: 100,         //仓库状态（100：启用 -100：禁用）
      isDelivery: true,  //是否有配送能力（true：是 false：否）
      ruleType: 30,     //规则类型（10：配送站 20：库房 30：中转仓）
      size: 999,         //分页
      itemLayout: { labelCol: { span: 2 }, wrapperCol: { span: 7 } },
    }
    // 设置中转仓保存
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const { storage, dispatch, vendorId, cityCode, state, isDelivery, ruleType, size } = this.private;
    const sellerId = storage.get('seller_id')
    const contractId = storage.get('contract_id')

    const params = {
      vendorId,
      cityCode,
      state,
      isDelivery,
      size,
    }
    const ruleParams = {
      vendorId,
      sellerId,
      contractId,
      state,
      ruleType,
    }
    // 获取全部仓库
    dispatch({ type: getStockListByDirect, payload: params })
    // 获取当前仓库规则
    dispatch({ type: getStockDispatchRuleByDirect, payload: ruleParams })
  }

  componentWillReceiveProps(nextProps) {
    const { BusinessStock } = nextProps;
    const { directStockList, stockDispatchRule } = BusinessStock;

    this.setState({
      directStockList,
      stockDispatchRule,
    })
  }

    // 设置中转仓保存
  onSubmit = (e) => {
    e.preventDefault();
    const { storage, dispatch, vendorId, cityCode, state, isDelivery, ruleType, size } = this.private;
    const { stockDispatchRule } = this.state;
    const sellerId = storage.get('seller_id')
    const contractId = storage.get('contract_id')
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        console.log('Received values of form: ', values);
        if (stockDispatchRule.data.length === 0) {
          // 添加仓库分配规则
          const params = {
            vendorId,
            sellerId,
            contractId,
            ruleType,
            stockList: [values.stock],
          }
          dispatch({ type: createStockDispatchRuleByDirect, payload: params })
        } else {
          // 编辑仓库分配规则
          const params = {
            ruleId: stockDispatchRule.data[0].id,
            stockList: [values.stock],
            state,
          }
          dispatch({ type: updateStockDispatchRuleByDirect, payload: params })
        }
      }
    });
  }

  // 渲染中转仓下拉选择
  renderStorageSelect = () => {
    const { getFieldDecorator } = this.props.form;
    const { directStockList, stockDispatchRule } = this.state;

    //获取已经存在的规则
    const selectedStocks = dot.get(stockDispatchRule, 'data.0.stock_list', []);

    return getFieldDecorator('stock', {
      initialValue: selectedStocks,
      validate: [
        {
          rules: [{ type: 'string', required: true, message: '请选择仓库' }],
          trigger: 'onBlur',
        },
      ],
    })(
      <Select showSearch placeholder="请选择仓库" optionFilterProp="children">
        {
          directStockList.data.map((item, index) => {
            return <Option key={index} value={item.id}>{ item.name }</Option>
          })
        }
      </Select>,
    );
  }

  // 渲染中转仓模块
  renderTransferStorage = () => {
    const { renderStorageSelect } = this;
    const formItems = [{
      label: '中转仓',
      form: renderStorageSelect(),
    }, {
      label: '备注',
      layout: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
      form: (
        <span>
          1.一个项目目前支持设置一个默认中转仓；<br />
          2.若不设置订单揽收入站后，中转出站，没有默认下一站，需要人工临时选择下一站
        </span>
      ),
    }];
    return (
      <CoreContent title="中转仓配置">
        <CoreForm items={formItems} />
      </CoreContent>
    )
  }

  render() {
    const { renderTransferStorage, onSubmit } = this;
    return (
      <div className={`${style.component} rules-body con-body main-list`}>
        <Form layout="horizontal" onSubmit={onSubmit}>

          {/* 渲染中转仓 */}
          {renderTransferStorage()}

          {/* 保存按钮 */}
          <div className="bd-content">
            <Row type="flex" justify="center" gutter={24}>
              <Button type="primary" htmlType="submit" >保存</Button>
            </Row>
          </div>
        </Form>
      </div>
    )
  }
}

function mapStateToProps({ BusinessStock }) {
  return { BusinessStock };
}

export default connect(mapStateToProps)(Form.create()(TransferStock));
