import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Switch, Row, Col, Form, Input, Icon, Select, Table, Pagination, message } from 'antd';
import Storage from '../../../../application/library/storage';
import style from '../style.less';
import { authorize } from '../../../../application';
import { BusinessSupplierService, BusinessStock } from '../../../actions';
import AddStock from './addStock';
import { SUPPLIER_STOCK_COLUMNS } from '../core/enumerate';

const [FormItem, Option] = [Form.Item, Select.Option];

const { getSupplierDetails } = BusinessSupplierService;
const { getStockListByUnity } = BusinessStock;
class SupplierStock extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch, BusinessSupplierService, BusinessStock } = props;
    this.state = {
      //仓库列表
      stockListByUnity: BusinessStock.stockListByUnity,
      page: 1,
    }
    this.private = {
      dispatch,
      vendorId: authorize.auth.vendorId,             //加盟仓库查询方式
      cityCode: dot.get(authorize.vendor, 'city.code'),
      size: 10,                           //分页数
      sort: '{"_id":-1}',                 //排序
      columns: [],
      storage: new Storage('supplier', { useSession: true }),              //缓存实例
      itemLayout: { labelCol: { span: 5 }, wrapperCol: { span: 16 } },
      /** 搜索条件 */
      name: '',             //仓库名称
    }
    // 搜索模块
    this.renderStockSearch = this.renderStockSearch.bind(this);
    // 搜索函数
    this.handleSubmit = this.handleSubmit.bind(this);
    // 查询仓库列表
    this.renderStockList = this.renderStockList.bind(this);
  }

  componentWillMount() {
    // 请求所有合作仓库
    this.renderStockList();

    const operateCallback = record => (
      <Link to={`/business/stock/detail?id=${record.id}`}>查看仓库</Link>
    )
    this.private.columns = SUPPLIER_STOCK_COLUMNS(operateCallback)
  }

  componentWillReceiveProps(nextProps) {
    const { BusinessStock } = nextProps;
    this.setState({
      stockListByUnity: BusinessStock.stockListByUnity,
    })
  }

  // 查询仓库列表
  renderStockList() {
    const { dispatch, storage, vendorId, cityCode, size, sort, name } = this.private;
    const { page } = this.state;
    const supplyVendorId = storage.get('supply_vendor_id');
    const params = {
      vendorId,
      supplyVendorId,
      cityCode,
      page,
      size,
      sort,
    }

    if (name) {
      params.name = name;
    }
    dispatch({ type: getStockListByUnity, payload: params })
  }

  // 搜索函数
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (values.name) {
          this.private.name = values.name
        }
        this.renderStockList()
      }
    });
  }

  // 搜索模块
  renderStockSearch() {
    const { itemLayout } = this.private;
    const { handleSubmit } = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="bd-header">
        <Row gutter={24}>
          <Col sm={16}>
            <Form layout="horizontal" onSubmit={handleSubmit}>
              <Col sm={18}>
                <FormItem label="仓库名称" {...itemLayout} >
                  {
                    getFieldDecorator('name')(
                      <Input {...{ placeholder: '请输入仓库名称' }} />,
                    )
                  }
                </FormItem>
              </Col>
              <Col sm={6}>
                <Button type="primary" htmlType="submit" >查询</Button>
              </Col>
            </Form>
          </Col>
          <Col sm={8}>
            {/*<AddStock />*/}
            <Link to="/business/stock/create"><Button>添加合作仓库</Button></Link>
          </Col>
        </Row>
      </div>

    )
  }

  render() {
    const { renderStockSearch, renderStockList } = this;
    const { columns, size } = this.private;
    const { stockListByUnity } = this.state;
    // 页码
    const pagination = {
      total: stockListByUnity._meta.result_count || 0,
      pageSize: size,
      showTotal: (total) => {
        return `总共 ${total} 条`;
      },
      onShowSizeChange: (current, pageSize) => {
        this.props.onShowSizeChange(current, pageSize);
      },
      onChange: (current) => {
        this.setState({
          page: current,
        }, () => {
          renderStockList()
        })
      },
    }
    return (
      <div className="bd-content">
        {/* 搜索模块 */}
        {renderStockSearch()}
        <Table rowKey={(record, index) => { return index }} columns={columns} dataSource={stockListByUnity.data} pagination={pagination} />
      </div>
    )
  }
}

function mapStateToProps({ BusinessSupplierService, BusinessStock }) {
  return { BusinessSupplierService, BusinessStock };
}

export default connect(mapStateToProps)(Form.create()(SupplierStock))
