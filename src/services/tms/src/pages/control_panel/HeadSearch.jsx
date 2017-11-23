import dot from 'dot-prop'
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button, Checkbox, Icon, Popover, Select, Popconfirm, message } from 'antd';
import aoaoAppSystemFlag from './../../../../../utils/systemConfig';
import { geography, authorize } from '../../../../../application'
import { BusinessType } from '../../../../../application/define';
import { CommonManage } from '../../../../../../src/components/actions.js';

const [FormItem, Option] = [Form.Item, Select.Option];
const { dateFormat } = window.tempAppTool;
const { fetchSellersList, clearSellersList } = CommonManage;

class HeadSearch extends Component {

  constructor(props) {
    super();
    // 将区域名称存放到页面的内部state中
    this.state = {
      area_name: '',
      city_name: '',
      area_id: '',
      city_code: '',
      sellersList: props.commonSellers.sellersList
    };
    this.private = {
      area_id: '',
      area_name: '',
      city_code: '',
      city_name: '',
      form: props.form,
      fetchSellersList,
      clearSellersList,
      dispatch: props.dispatch,
    }
  }

  componentWillMount() {
    const { default_area_id, default_area_name, default_city_code, default_city_name } = this.props;
    this.private.area_id = default_area_id;
    this.private.area_name = default_area_name;
    this.private.city_code = default_city_code;
    this.private.city_name = default_city_name;
  }

  componentWillReceiveProps = (nextProps) => {
    const { sellersList } = nextProps.commonSellers;

    this.setState({
      sellersList,
    });

    const { flag } = this;
    const _that = this;
    // 默认的区域id
    let default_area_id1 = '';
    // 默认的区域名称
    let default_area_name1 = '';

    if (flag) {
      default_area_id1 = nextProps.default_area_id;
      default_area_name1 = nextProps.default_area_name;
    }
  }

  //商家类型
  onSelectContractType = (type) => {
    const { resetFields } = this.private.form;
    const { dispatch, fetchSellersList, clearSellersList } = this.private;
    //重置商家
    resetFields(['seller_id'])
    dispatch({
      type: clearSellersList
    });
    if (!type) {
      return;
    }
    dispatch({
      type: fetchSellersList,
      payload: { type: type }
    });
  }

  // 提交函数
  handleSubmit = (e) => {
    e.preventDefault();
    const { handleSearch } = this.props;
    const { getFieldsValue } = this.private.form;
    const params = getFieldsValue();
    //只需要把form的值传过去就可以，其他的交给父级去处理和保存，相当于部分更新
    handleSearch(getFieldsValue());
  }

  //更新城市函数
  handleCityChange = (value) => {
    const { cityChange, serviceCityList } = this.props;
    cityChange(value);
    let city_name = '';
    for (const city_list of serviceCityList) {
      if (city_list.city_code === value) {
        city_name = city_list.city_name;
        break;
      }
    }
    const cityInfo = {
      city_code: value,
      city_name,
    }
    this.private.city_code = value;
    this.private.city_name = city_name;
    //当更新城市时，设置缓存，以便其他页面返回时获取数据，同时清空区域缓存
    window.sessionStorage && sessionStorage.setItem('CITYINFO', JSON.stringify(cityInfo));
    window.sessionStorage && sessionStorage.removeItem('AREAINFO');

    this.setState({ city_name, area_name: '-' });
    if (city_name.length !== 0) {
      message.success(`已切换城市为${city_name}。`);
    }
  }

  // 更新区域的函数
  handleAreaChange = (value) => {
    const { areaChange, areas_data } = this.props;
    //向上传area_id
    areaChange(value);
    //更新本地的区域名称
    let area_name = '';
    for (const area of areas_data) {
      if (area.id === value) {
        area_name = area.name;
        break;
      }
    }
    const areaInfo = {
      area_id: value,
      area_name,
    }
    this.private.area_id = value;
    this.private.area_name = area_name;
    //当更新区域时，设置缓存，以便其他页面返回时获取数据
    window.sessionStorage && sessionStorage.setItem('AREAINFO', JSON.stringify(areaInfo));
    this.setState({ area_name });
    if (area_name.length !== 0) {
      message.success(`已切换区域为${area_name}。`);
    }
  };

  componentWillUnmount() {
    // 卸载组件时，删除记录的状态  ！！！浏览器刷新非组件卸载
    const areaInfo = {
      area_id: this.private.area_id,
      area_name: this.private.area_name,
    }
    const cityInfo = {
      city_code: this.private.city_code,
      city_name: this.private.city_name,
    }
    window.sessionStorage && sessionStorage.setItem('AREAINFO', JSON.stringify(areaInfo));
    window.sessionStorage && sessionStorage.setItem('CITYINFO', JSON.stringify(cityInfo));

    const { areaChange, cityChange } = this.props;

    areaChange(this.private.area_id);
    cityChange(this.private.city_code);
    const { dispatch, fetchSellersList, clearSellersList } = this.private;
    //重置商家
    dispatch({
      type: clearSellersList
    });

  }


  // 伸缩的div
  toggleStyle = () => {
    const div = document.getElementById('toggleDiv')
    const button = document.getElementById('button')
    const Icon = document.getElementById('Icon')
    if (div.style.left == '-366px') {
      div.style.left = '0px'
      button.innerHTML = '收起'
      div.style.transition = 'left 1s'
    } else if (div.style.left == '0px') {
      div.style.left = '-366px'
      button.innerHTML = '切换'
    }
  }

  render() {
    //   从props里面获取信息
    let { updateArea_id, updateCityCode, areas_data = [], serviceCityList = [], default_city_code, default_city_name, default_area_id, default_area_name, Allrefresh, default_couriers, stateChange } = this.props;
    // 从form里面获取信息
    const { getFieldDecorator } = this.private.form;
    // 从this里面获取信息
    const { handleSubmit, handleAreaChange, handleCityChange, toggleStyle } = this;
    // 从this.state里面获取信息
    const { area_name, city_name, sellersList } = this.state;

    //解决页面返回时 store 缓存问题（model设置机制问题）
    const areaInfo = window.sessionStorage && JSON.parse(sessionStorage.getItem('AREAINFO'))
    const cityInfo = window.sessionStorage && JSON.parse(sessionStorage.getItem('CITYINFO'))
    // const unmountKey = window.sessionStorage && JSON.parse(sessionStorage.getItem('COMPONENT_UNMOUNT'));

    const itemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    //商户列表
    let selectSellersChildren = [];
    if (dot.has(sellersList, 'data') && sellersList.data.length > 0) {
      sellersList.data.map((item, index) => {
        selectSellersChildren.push(<Option key={`${item.id}-${index}`} value={item.id}> {item.name} </Option>);
      })
    }

    if (areas_data.length > 0) {
      if (areaInfo && areaInfo.area_id && areaInfo.area_name) {
        default_area_id = areaInfo.area_id;
        default_area_name = areaInfo.area_name;
      }
    }
    if (serviceCityList.length > 0) {
      if (cityInfo && cityInfo.city_code && cityInfo.city_name) {
        default_city_code = cityInfo.city_code;
        default_city_name = cityInfo.city_name;
      }
    }

    //TODO: 打补丁，处理之前的sessionStorage中的逻辑，将来sessionStorage全部删除掉
    if (default_city_code.length <= 2 && authorize.vendor) {
      default_city_code = dot.get(authorize.vendor, 'city.code')
      default_city_name = dot.get(authorize.vendor, 'city.name')
    }

    //排除重复id
    const newAreasData = [];
    if (areas_data && areas_data.length > 0) {
      for (const i in areas_data) {
        if (newAreasData.length > 0) {
          let flag = false;
          for (const j in newAreasData) {
            if (areas_data[i].id === newAreasData[j].id) {
              flag = true;
              break;
            }
          }
          !flag && newAreasData.push({
            id: areas_data[i].id,
            name: areas_data[i].name,
          })
        } else {
          newAreasData.push({
            id: areas_data[i].id,
            name: areas_data[i].name,
          })
        }
      }
    }

    updateArea_id(default_area_id)
    updateCityCode(default_city_code)
    this.private.area_id = default_area_id;
    this.private.area_name = default_area_name;
    this.private.city_code = default_city_code;
    this.private.city_name = default_city_name;

    //取当前时间
    const _date = dateFormat();
    _date.shift();
    //取当前默认区域
    const currDate = _date.join('-');
    // 文字说明
    const tms_guide = (
      <div>
        <p> 当前系统采用纯抢单模式：<br /> 1.商户下单后，系统推送给取货地址周围3km骑士，<br />2.根据骑士当前位置等综合条件同时推送订单给多位骑士，进行抢单；</p>
        <p> 注：区域负责人可以查看到骑士申请改派的订单进行改派。 </p>
      </div>
    );
    // 文字说明
    const tms_guide2 = (
      <div>
        <p> 当前系统采用纯抢单模式：<br /> 商户下单后，系统推送给取货地址周围3km骑士，根据骑士当前位置等综合条件同时推送订单给多位骑士，进行抢单；</p>
        <p>商家下单后，所有订单都只在期望送达时间当天营业时间内推送</p>
        <p> 注：区域负责人可以查看到骑士申请改派的订单进行改派。</p>
      </div>
    );
    return (
      <Form layout="inline" onSubmit={handleSubmit} style={{ height: '62px', boxSizing: 'border-box', padding: '5px 0' }}>
        <Row style={{ minWidth: '1100px' }}>
          <Col span={1}>
            <div id="toggleDiv" style={{ width: '350px', height: '35px', position: 'absolute', left: '-366px', top: '3px', zIndex: '22', background: '#fff', padding: '5px' }}>
              {
                aoaoAppSystemFlag.HAS_MORE_CITY === false ?
                  <span style={{ marginRight: 10 }}>当前城市：{geography.cityName(default_city_code)}</span> :
                  serviceCityList.length > 0 && default_city_code && <Select showSearch optionFilterProp="children" onChange={handleCityChange} placeholder={default_city_name} defaultValue={default_city_code} style={{ width: 150 }} >
                    {
                      serviceCityList.map((item, index) => {
                        return <Option key={`${item.city_code}${index}`} value={item.city_code}>{item.city_name}</Option>
                      })
                    }
                  </Select>
              }
              &nbsp;&nbsp;
              {
                (newAreasData.length > 0 && default_area_id) ? <Select showSearch optionFilterProp="children" onChange={handleAreaChange} placeholder={default_area_name} defaultValue={default_area_id} style={{ width: 150 }} >
                  {
                    newAreasData.map((item, index) => {
                      return <Option key={`${item.id}${index}`} value={item.id}>{item.name}</Option>
                    })
                  }
                </Select> : <Select showSearch optionFilterProp="children" onChange={handleAreaChange} placeholder={default_area_name} style={{ width: 150 }} >
                    {
                      newAreasData.map((item, index) => {
                        return <Option key={`${item.id}${index}`} value={item.id}>{item.name}</Option>
                      })
                    }
                  </Select>
              }
              <Button id="button" className="toggle-button" onClick={toggleStyle}>
                切换
             </Button>
            </div>
          </Col>
          <Col span={6} style={{ minWidth: '240px' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flexEnd',
                lineHeight: '38px',
              }}
            >
              <div>
                {city_name || default_city_name}&nbsp;
              </div>
              <div>
                {area_name || default_area_name}&nbsp;
              </div>
              <div>
                {currDate}
                &nbsp;  &nbsp;
                <Popover content={tms_guide2} title="调度规则说明：">
                  <Icon type="question-circle-o" />
                </Popover>
              </div>
            </div>

          </Col>

          <Col span={12} >
            <FormItem label="订单号" {...itemLayout}>
              {
                getFieldDecorator('org_order_id')(
                  <Input placeholder='请输入订单号' style={{ width: 150 }} />,
                )
              }
            </FormItem>
            <FormItem label="骑士" {...itemLayout}>
              {
                getFieldDecorator('courier_id')(
                  <Select
                    style={{ width: 165 }}
                    placeholder="请输入骑士姓名/骑士手机" 
                    showSearch 
                    optionFilterProp="children"
                    filterOption={(inputValue, option) => {
                      const { children } = option.props;
                      const _test = Array.isArray(children) ? children[0] : children;
                      if (_test.indexOf(inputValue) !== -1) {
                        return true;
                      }
                    }}
                  >
                    <Option value="all">全部</Option>
                    {default_couriers.map((item, index) => {
                      return (<Option key={`courier_id_${item.id}`} value={item.id}>{`${item.name}(${item.mobile})`} </Option>)
                    })}
                  </Select>,
                )
              }

            </FormItem>
            <Button icon="retweet" onClick={() => { Allrefresh() }} style={{ marginLeft: '25px' }}>刷新</Button>
            <FormItem label="商家类型" {...itemLayout}>
              {
                getFieldDecorator('business-type', {
                  initialValue: '全部'
                })(
                  <Select
                    showSearch
                    placeholder="请选择商家类型"
                    style={{ width: 150 }}
                    onSelect={this.onSelectContractType}
                  >
                    <Option value=''>全部</Option>
                    <Option key={`${BusinessType.driect}`} value={`${BusinessType.driect}`}>{BusinessType.description(BusinessType.driect)}</Option>
                    <Option value={`${BusinessType.affiliate}`}>{BusinessType.description(BusinessType.affiliate)}</Option>
                  </Select>
                  )
              }
            </FormItem>
            <FormItem label="商家名称" {...itemLayout}>
              {
                getFieldDecorator('seller_id')(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择商家名称"
                    style={{ width: 165 }}
                  >
                    {
                      selectSellersChildren
                    }

                  </Select>
                )
              }
            </FormItem>
            <Button id="primary" type="primary" htmlType="submit">查询</Button>
          </Col>

        </Row>
      </Form>
    );
  }
}

function mapStateToProps({ commonSellers }) {
  return { commonSellers };
}

module.exports = connect(mapStateToProps)(Form.create()(HeadSearch));
