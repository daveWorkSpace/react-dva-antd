import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import AddSupplier from './addSupplier';
import { Form, Table, Row, Col, Button, Tag, Input, message, Select, Tooltip, Icon } from 'antd';
import { BusinessSupplierService } from '../../actions';
import { authorize } from '../../../application';
import { CoreContent, CoreSearch } from '../../core';

const FormItem = Form.Item;
const { getVendorSupplierList, addSuppliers, updataStateFunc } = BusinessSupplierService;


class Search extends Component {
  constructor(props) {
    super(props);
    const { dispatch, BusinessSupplierService } = props;
    //承运商列表
    this.state = {
      vendorSupplierList: BusinessSupplierService.vendorSupplierList,
    };
    this.private = {
      dispatch,
      vendor_id: authorize.auth.vendorId,                   //服务商id
      city_code: dot.get(authorize.vendor, 'city.code'),    //城市code
      city_name: dot.get(authorize.vendor, 'city.name'),    //城市名
      limit: 10,                                            //分页数
      page: 1,                                              //默认分页
      state: 100,                                   //状态
      verify_state: 100,                            //审核状态
      itemLayout: { labelCol: { span: 7 }, wrapperCol: { span: 14 } },
      search: {
        supplyVendorId: '',    //承运商ID
      },
    };
        // 查询承运商列表
    this.onSearch = this.onSearch.bind(this);
        // 添加供应商获取可用供应商列表
    this.getVendorSupplierListFunc = this.getVendorSupplierListFunc.bind(this);
        // 提交添加供应商信息
    this.addSubmit = this.addSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { BusinessSupplierService } = nextProps;
    this.setState({
      vendorSupplierList: BusinessSupplierService.vendorSupplierList,
    });

    if (BusinessSupplierService.upDataState === true) {
      message.success('添加成功');
      const { dispatch } = this.private;
      //
      this.onFresh();
      // 完成操作后 重置 返回状态
      dispatch({ type: updataStateFunc, payload: false })
    }
  }

  // 刷新承运商列表
  onFresh = () => {
    const { vendor_id, city_code, page, limit } = this.private;
    const { supplyVendorId } = this.private.search;
    const listParams = {
      vendor_id,
      city_code,
      page,
      limit,
      supplyVendorId,
    };
    // 更新承运商列表
    this.props.renderSupplierList(listParams);
  };

  // 查询承运商列表
  onSearch = (e) => {
    this.private.search.supplyVendorId = e.supplyVendorId;
    this.onFresh();
  };
  //重置搜索查询
  onReset = () => {
    this.private.search = {
      supplyVendorId: '',  //
    };
    //重新刷新列表
    this.onFresh();
  };

  // 添加供应商获取可用供应商列表
  getVendorSupplierListFunc =() => {
    const { dispatch, vendor_id, city_code, state, verify_state } = this.private;
    const params = {
      city_code,
      state,
      verify_state,
    };

    dispatch({
      type: getVendorSupplierList,
      payload: params,
    })
  };

  // 提交添加供应商信息
  addSubmit = (values) => {
    const { vendorSupplierList } = this.state;
    const { dispatch, vendor_id, city_code, city_name } = this.private;

    values.service_city_code = [`${city_code}`];
    values.vendor_id = vendor_id;
    for (let i = 0; i < vendorSupplierList.length; i++) {
      if (vendorSupplierList[i].id == values.supply_vendor_id) {
        values.name = vendorSupplierList[i].name;
      }
    }

    dispatch({ type: addSuppliers, payload: { values } })
  };

  render() {
    const { itemLayout, city_name } = this.private;
    const { vendorSupplierList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { getVendorSupplierListFunc, addSubmit } = this;
    const addSupplierProps = {
      vendorSupplierList,
      city_name,
      getVendorSupplierListFunc,
      addSubmit,
    };
    const { supplyVendorId } = this.private.search;
    const items = [
      // {
      //   label: '商户号',
      //   form: form => (form.getFieldDecorator('vendorId', { initialValue: stockId })(<Input placeholder="请输入商户号" />)),
      // },
      {
        label: '承运商名称',
        form: form => (form.getFieldDecorator('supplyVendorId', { initialValue: name })(<Input placeholder="请输入承运商ID" />)),
      },
      // {
      //   label: '承运商状态',
      //   form: form => (form.getFieldDecorator('state', { initialValue: state })(
      //     <Select>
      //       <Select.Option value="">全部</Select.Option>
      //       <Select.Option value={`${ServiceState.on}`}>{ServiceState.description(ServiceState.on)}</Select.Option>
      //       <Select.Option value={`${ServiceState.off}`}>{ServiceState.description(ServiceState.off)}</Select.Option>
      //     </Select>,
      //   )),
      // },
    ];
    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      // operations: (
      //   <div>
      //     {/*添加新承运商模块*/}
      //     <AddSupplier {...addSupplierProps} />
      //   </div>
      // ),
    };

    return (
      <CoreContent>
        <Row>
          <Col sm={20}>
            {/* 渲染搜索 */}
            <CoreSearch {...props} />
          </Col>
          <Col sm={4}>
            {/*添加新承运商模块*/}
            <AddSupplier {...addSupplierProps} />
          </Col>
        </Row>
      </CoreContent>
    );
  }
}

function mapStateToProps({ BusinessSupplierService }) {
  return { BusinessSupplierService };
}

export default connect(mapStateToProps)(Form.create()(Search));
