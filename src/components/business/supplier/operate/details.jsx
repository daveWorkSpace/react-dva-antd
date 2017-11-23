import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Switch, Row, Col, Form, Input, Icon, Select, TreeSelect } from 'antd';
import Storage from '../../../../application/library/storage';
import style from '../style.less';
import { geography } from '../../../../application';
import { BusinessSupplierService } from '../../../actions';

const city = geography.city.data;
const [FormItem, Option, TreeNode] = [Form.Item, Select.Option, TreeSelect.TreeNode];

const { getSupplierDetails } = BusinessSupplierService;

class SupplierDetails extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch, BusinessSupplierService } = props;
    this.state = {
      //承运商详情
      supplierDetail: BusinessSupplierService.supplierDetail,
    }
    this.private = {
      dispatch,
      storage: new Storage('supplier', { useSession: true }),              //缓存实例
    }
  }

  componentWillMount() {
    const { dispatch, storage } = this.private;
    //服务商业务信息ID
    const biz_info_id = storage.get('biz_info_id');
    const params = {
      biz_info_id,
    }
    dispatch({ type: getSupplierDetails, payload: params });
  }

  componentWillReceiveProps(nextProps) {
    const { BusinessSupplierService } = nextProps;
    this.setState({
      supplierDetail: BusinessSupplierService.supplierDetail,
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { supplierDetail } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <div className="bd-content">
          <div className="content-title">承运商信息</div>
          <Row>
            <Col sm={12}>
              <FormItem label="供应商名称:" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                  getFieldDecorator('name', {
                    initialValue: supplierDetail.name,
                    rules: [{ required: true, message: '请输入供应商名称' }],
                  })(
                    <Input placeholder="供应商名称" disabled />,
                  )
                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="加盟商" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('vendor_name', {
                                      initialValue: supplierDetail.vendor_name,
                                      rules: [{ required: true, message: '请输入加盟商' }],
                                    })(
                                      <Input placeholder="加盟商" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="公司全称:" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('full_name', {
                                      initialValue: supplierDetail.full_name,
                                      rules: [{ required: true, message: '请输入公司全称' }],
                                    })(
                                      <Input placeholder="公司全称" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="申请加盟城市" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('service_city_code', {
                                      initialValue: supplierDetail.service_city_code || '',
                                      rules: [{ required: true, message: '请输入申请加盟城市' }],
                                    })(
                                      <Select placeholder="申请加盟城市" disabled >
                                        {
                                                city.map((item, index) => {
                                                  return (
                                                    <Option key={item._id} value={item._id}>{item.name}</Option>
                                                  )
                                                })
                                            }
                                      </Select>,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="公司成立时间" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('company_created_at', {
                                      initialValue: supplierDetail.company_created_at,
                                      rules: [{ required: true, message: '请输入公司成立时间' }],
                                    })(
                                      <Input placeholder="公司成立时间" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="公司注册地址" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('company_register_address', {
                                      initialValue: supplierDetail.company_register_address,
                                      rules: [{ required: true, message: '请输入公司注册地址' }],
                                    })(
                                      <Input placeholder="公司注册地址" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="公司注册城市" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('company_created_city_code', {
                                      initialValue: supplierDetail.company_created_city_code || '',
                                      rules: [{ required: true, message: '请输入公司注册城市' }],
                                    })(
                                      <Select placeholder="公司注册城市" disabled >
                                        {
                                                city.map((item, index) => {
                                                  return (
                                                    <Option key={item._id} value={item._id}>{item.name}</Option>
                                                  )
                                                })
                                            }
                                      </Select>,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="公司办公地址" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('company_address', {
                                      initialValue: supplierDetail.company_address,
                                      rules: [{ required: true, message: '请输入公司办公地址' }],
                                    })(
                                      <Input placeholder="公司办公地址" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="公司类型" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('company_type', {
                                      initialValue: supplierDetail.company_type,
                                      rules: [{ required: true, message: '请输入公司类型' }],
                                    })(
                                      <Input placeholder="公司类型" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="注册资金(单位:万元)" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('register_money', {
                                      initialValue: supplierDetail.register_money,
                                      rules: [{ required: true, message: '请输入注册资金' }],
                                    })(
                                      <Input placeholder="注册资金(单位:万元)" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="公司主营业务" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('company_business', {
                                      initialValue: supplierDetail.company_business,
                                      rules: [{ required: true, message: '请输入公司主营业务' }],
                                    })(
                                      <Input placeholder="公司主营业务" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="公司传真号码" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('company_fax', {
                                      initialValue: supplierDetail.company_fax,
                                      rules: [{ required: true, message: '请输入公司传真号码' }],
                                    })(
                                      <Input placeholder="公司传真号码" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="公司固话" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('company_tel', {
                                      initialValue: supplierDetail.company_tel,
                                      rules: [{ required: true, message: '请输入公司固话' }],
                                    })(
                                      <Input placeholder="公司固话" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="紧急联系人电话" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('company_contact_mobile', {
                                      initialValue: supplierDetail.company_contact_mobile,
                                      rules: [{ required: true, message: '请输入紧急联系人电话' }],
                                    })(
                                      <Input placeholder="紧急联系人电话" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="紧急联系人" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('company_contact_name', {
                                      initialValue: supplierDetail.company_contact_name,
                                      rules: [{ required: true, message: '请输入紧急联系人' }],
                                    })(
                                      <Input placeholder="紧急联系人" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="备注" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('note', {
                                      initialValue: supplierDetail.note,
                                      rules: [{ required: true, message: '请输入备注信息' }],
                                    })(
                                      <Input placeholder="备注" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="公司网址" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('company_site', {
                                      initialValue: supplierDetail.company_site,
                                      rules: [{ required: true, message: '请输入公司网址' }],
                                    })(
                                      <Input placeholder="公司网址" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className="bd-content">
          <div className="content-title">调研信息</div>
          <Row>
            <Col sm={12}>
              <FormItem label="可支配流动资金(单位:万元):" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('working_cash', {
                                      initialValue: supplierDetail.working_cash,
                                      rules: [{ required: true, message: '请输入可支配流动资金' }],
                                    })(
                                      <Input placeholder="可支配流动资金(单位:万元)" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="年收入(单位:万元)" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('year_income', {
                                      initialValue: supplierDetail.year_income,
                                      rules: [{ required: true, message: '请输入年收入' }],
                                    })(
                                      <Input placeholder="年收入(单位:万元)" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="预计投入(单位:万元)" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('invested', {
                                      initialValue: supplierDetail.invested,
                                      rules: [{ required: true, message: '请输入预计投入' }],
                                    })(
                                      <Input placeholder="预计投入(单位:万元)" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="从业时长(单位:月)" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('operate_time', {
                                      initialValue: supplierDetail.operate_time,
                                      rules: [{ required: true, message: '请输入从业时长' }],
                                    })(
                                      <Input placeholder="从业时长(单位:月)" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="现有骑手人数(单位:人)" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('courier_count', {
                                      initialValue: supplierDetail.courier_count,
                                      rules: [{ required: true, message: '请输入现有骑手人数' }],
                                    })(
                                      <Input placeholder="现有骑手人数(单位:人)" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="骑手商业意外险" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('accident_insurance', {
                                      initialValue: supplierDetail.accident_insurance || '',
                                      rules: [{ required: true, message: '请输入骑手商业意外险', type: 'boolean' }],
                                    })(
                                      <Select placeholder="骑手商业意外险" disabled >
                                        <Option value="false">无</Option>
                                        <Option value="true">有</Option>
                                      </Select>,
                                    )
                                }

              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="现有管理人员人数" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('manager_count', {
                                      initialValue: supplierDetail.manager_count,
                                      rules: [{ required: true, message: '请输入现有管理人员人数' }],
                                    })(
                                      <Input placeholder="现有管理人员人数" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="团队规模(单位:人)" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('team_count', {
                                      initialValue: supplierDetail.team_count,
                                      rules: [{ required: true, message: '请输入现有管理人员人数' }],
                                    })(
                                      <Input placeholder="现有管理人员人数" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className="bd-content">
          <div className="content-title">资质审核</div>
          <Row>
            <Col sm={12}>
              <FormItem label="营业执照编号:" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('company_business_no', {
                                      initialValue: supplierDetail.company_business_no,
                                      rules: [{ required: true, message: '请输入营业执照编号' }],
                                    })(
                                      <Input placeholder="营业执照编号" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="统一社会信用编号" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('credit_no', {
                                      initialValue: supplierDetail.credit_no,
                                      rules: [{ required: true, message: '请输入统一社会信用编号' }],
                                    })(
                                      <Input placeholder="统一社会信用编号" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="企业法人" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('legal_name', {
                                      initialValue: supplierDetail.legal_name,
                                      rules: [{ required: true, message: '请输入企业法人' }],
                                    })(
                                      <Input placeholder="企业法人" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="企业法人身份证号" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('legal_passport', {
                                      initialValue: supplierDetail.legal_passport,
                                      rules: [{ required: true, message: '请输入企业法人身份证号' }],
                                    })(
                                      <Input placeholder="企业法人身份证号" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="企业法人手机号" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('legal_mobile', {
                                      initialValue: supplierDetail.legal_mobile,
                                      rules: [{ required: true, message: '请输入企业法人手机号' }],
                                    })(
                                      <Input placeholder="企业法人手机号" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="企业法人邮箱" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('legal_email', {
                                      initialValue: supplierDetail.legal_email,
                                      rules: [{ required: true, message: '请输入企业法人邮箱' }],
                                    })(
                                      <Input placeholder="企业法人邮箱" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="三证合一证件失效日期" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('integrate_paper_expire_date', {
                                      initialValue: supplierDetail.integrate_paper_expire_date,
                                      rules: [{ required: true, message: '请输入三证合一证件失效日期' }],
                                    })(
                                      <Input placeholder="三证合一证件失效日期" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="食品流通许可证证件失效日期" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('food_paper_expire_date', {
                                      initialValue: supplierDetail.food_paper_expire_date,
                                      rules: [{ required: true, message: '请输入食品流通许可证证件失效日期' }],
                                    })(
                                      <Input placeholder="食品流通许可证证件失效日期" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="食品流通许可证编号" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('food_paper_no', {
                                      initialValue: supplierDetail.food_paper_no,
                                      rules: [{ required: true, message: '请输入食品流通许可证编号' }],
                                    })(
                                      <Input placeholder="食品流通许可证编号" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="快递经营许可证证件失效日期" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('expresses_paper_expire_date', {
                                      initialValue: supplierDetail.expresses_paper_expire_date,
                                      rules: [{ required: true, message: '请输入快递经营许可证证件失效日期' }],
                                    })(
                                      <Input placeholder="快递经营许可证证件失效日期" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="快递经营许可证编号" {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}>
                {
                                    getFieldDecorator('expresses_paper_no', {
                                      initialValue: supplierDetail.expresses_paper_no,
                                      rules: [{ required: true, message: '请输入快递经营许可证编号' }],
                                    })(
                                      <Input placeholder="快递经营许可证编号" disabled />,
                                    )
                                }
              </FormItem>
            </Col>
            <div>
              <Row>
                <Col sm={24}>
                  <FormItem label="营业执照" {...{ labelCol: { span: 2 }, wrapperCol: { span: '' } }}>
                    <img
                      src={supplierDetail.company_business_assets[0] || ''} className={style.supplierImg}
                      alt="无上传图片"
                    />
                    <img
                      src={supplierDetail.company_business_assets[1] || ''} className={style.supplierMrImg}
                      alt="无上传图片"
                    />
                    <img
                      src={supplierDetail.company_business_assets[2] || ''} className={style.supplierMrImg}
                      alt="无上传图片"
                    />
                  </FormItem>
                </Col>
                <Col sm={24}>
                  <FormItem label="三证合一" {...{ labelCol: { span: 2 }, wrapperCol: { span: '' } }}>
                    <img
                      src={supplierDetail.integrate_paper_assets[0] || ''} className={style.supplierImg}
                      alt="无上传图片"
                    />
                  </FormItem>
                </Col>
                <Col sm={24}>
                  <FormItem label="法人身份证件照" {...{ labelCol: { span: 2 }, wrapperCol: { span: '' } }}>
                    <Row>
                      <img
                        src={supplierDetail.legal_passport_assets[0] || ''} className={style.supplierImg}
                        alt="无上传图片"
                      />
                      <img
                        src={supplierDetail.legal_passport_assets[1] || ''} className={style.supplierMrImg}
                        alt="无上传图片"
                      />
                      <img
                        src={supplierDetail.legal_passport_assets[2] || ''} className={style.supplierMrImg}
                        alt="无上传图片"
                      />
                    </Row>
                  </FormItem>
                </Col>
                <Col sm={24}>
                  <FormItem label="食品流通许可证" {...{ labelCol: { span: 2 }, wrapperCol: { span: '' } }}>
                    <img src={supplierDetail.food_paper_assets[0] || ''} className={style.supplierImg} alt="无上传图片" />
                  </FormItem>
                </Col>
                <Col sm={24}>
                  <FormItem label="快递经营许可证" {...{ labelCol: { span: 2 }, wrapperCol: { span: '' } }}>
                    <img
                      src={supplierDetail.expresses_paper_assets[0] || ''} className={style.supplierImg}
                      alt="无上传图片"
                    />
                  </FormItem>
                </Col>
              </Row>
            </div>
          </Row>
        </div>
        <Row type="flex" justify={'center'}>
          <Col sm={5}>
            <FormItem>
              <Button><Link to="/business/supplier/list">返回</Link></Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

function mapStateToProps({ BusinessSupplierService }) {
  return { BusinessSupplierService };
}

export default connect(mapStateToProps)(Form.create()(SupplierDetails))
