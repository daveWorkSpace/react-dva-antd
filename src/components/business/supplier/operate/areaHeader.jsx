import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Select, Table, Row, Col, Button, Tag, Input } from 'antd';
import AddArea from './addArea';
import Storage from '../../../../application/library/storage';
import style from '../style.less';
import { authorize } from '../../../../application';
import { BusinessSupplierService } from '../../../actions';

const [FormItem, Option] = [Form.Item, Select.Option];

const { getAddAreaList, submitAdds } = BusinessSupplierService;

class AreaHeader extends Component {
  constructor(props) {
    super(props);
    const { dispatch, BusinessSupplierService } = props;
    this.state = {
      addAreaList: BusinessSupplierService.addAreaList,         //可添加的区域列表
    }
    this.private = {
      dispatch,
      storage: new Storage('supplier', { useSession: true }),
      vendor_id: authorize.auth.vendorId,                     //服务商id
      city_code: dot.get(authorize.vendor, 'city.code'),      //城市code
      city_name: dot.get(authorize.vendor, 'city.name'),      //城市名
      is_filter_sub_area: true,                               //是否过滤子区域
      state: 100,                                              //状态
      limit: 500,                                               //分页数
      itemLayout: { labelCol: { span: 7 }, wrapperCol: { span: 14 } },
    }
    // 查询合作区域列表
    this.handleSubmit = this.handleSubmit.bind(this);
    // 添加合作区域提交
    this.submitAddArea = this.submitAddArea.bind(this);
    // 获取可供选择合作区域列表
    this.getAreaList = this.getAreaList.bind(this);
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    const { BusinessSupplierService } = nextProps;
    this.setState({
      addAreaList: BusinessSupplierService.addAreaList,
    })
  }


  // 查询合作区域列表
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // 调用钩子函数
        this.props.searchHandle(values)
      }
    });
  }

  // 添加合作区域提交
  submitAddArea(values) {
    const { dispatch, storage, vendor_id, city_code, city_name } = this.private;
    const params = {
      vendor_id,
      city_code,
      city_name,
      area_id: values,
      supply_vendor_id: storage.get('supply_vendor_id'),
    }

    dispatch({ type: submitAdds, payload: { values: params } })
  }

  // 获取可供选择合作区域列表
  getAreaList() {
    const { supplierModel, dispatch } = this.props;
    const { vendor_id, city_code, is_filter_sub_area, state, limit } = this.private;
    const params = {
      vendor_id,
      city_code,
      is_filter_sub_area,
      state,
      limit,
    }

    dispatch({ type: getAddAreaList, payload: params })
  }

  render() {
    const { itemLayout } = this.private;
    const { getFieldDecorator } = this.props.form;
    const { addAreaList } = this.state;
    const { handleSubmit, submitAddArea, getAreaList } = this;
    const addAreaProps = {
      submitAddArea,
      getAreaList,
      addAreaList,
    }
    return (
      <div className="bd-header">
        <Form layout="horizontal" onSubmit={handleSubmit}>
          <Row gutter={24}>
            {/*<Col sm={8}>
              <FormItem label="区域名称"  {...itemLayout}  >
                {
                  getFieldDecorator("name")(
                    <Input {...{ "placeholder": "请输入区域名称" }} />
                  )
                }
              </FormItem>
            </Col>*/}
            <Col sm={8}>
              <FormItem label="合作状态" {...itemLayout} >
                {
                  getFieldDecorator('state', { initialValue: '100' })(
                    <Select showSearch optionFilterProp="children" placeholder="请选择订单状态" >
                      <Option key="0" value="">全部</Option>
                      <Option key="1" value="100">合作</Option>
                      <Option key="2" value="-100">不合作</Option>
                    </Select>,
                  )
                }
              </FormItem>
            </Col>
            <Col sm={4}>
              <Button type="primary" htmlType="submit" >查询</Button>
            </Col>
            {/* 添加区域合作 */}
            <AddArea {...addAreaProps} />
          </Row>
        </Form>
      </div>
    );
  }
}

function mapStateToProps({ BusinessSupplierService }) {
  return { BusinessSupplierService };
}

export default connect(mapStateToProps)(Form.create()(AreaHeader));
