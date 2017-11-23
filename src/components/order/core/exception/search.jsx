import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { hashHistory, Link } from 'dva/router';
import { Form, Button, Select, DatePicker } from 'antd';
import { OrderParams } from '../exports';

const RangePicker = DatePicker.RangePicker;

const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;

//初始化变量
const [FormItem, Option] = [Form.Item, Select.Option];

//引入枚举值
import { AFFILIATE, DIRECT } from '../enumerate.js'

class FilterComponent extends Component {
    constructor(props) {
        super();
        this.state = {
            cityCode: props.cityCode,        //当前城市code
            startDate: props.startDate,      //日期范围
            endDate: props.endDate,      //日期范围
        };

        this.private = {
            onChangeDate: props.onChangeDate,       //处理日期回调
            onHandleSearch: props.onHandleSearch,   //处理搜索回调
        };
    }

    componentWillReceiveProps = (nextProps) => {
        //初始化新数据
        this.setState({
            cityCode: nextProps.cityCode,             //当前城市code
            closeOrderList: nextProps.closeOrderList, //异常订单列表
            startDate: nextProps.startDate,           //日期范围
            endDate: nextProps.endDate,           //日期范围
        });
    };

    //选择日期
    onChangeDate = (value, dateString) => {
        let startDate;
        let endDate;
        if (dateString) {
            startDate = dateString[0].replace(rgReg, '');
            endDate = dateString[1].replace(rgReg, '');
        }
        this.private.onChangeDate(startDate, endDate);
    };

    //搜索
    onHandleSearch = () => {
        this.private.onHandleSearch();
    };

    disabledDate(current) {
        return current && current.valueOf() >= Date.now() - 24 * 60 * 60;
    }

    //日期
    renderDateComponent = () => {
        const { onChangeDate } = this;
        const today = moment().format().replace(rgReg, '').substring(0, 8);
        return (
            // <RangePicker defaultValue={[new Date(), new Date()]} style={{ width: 184 }} onChange={onChangeDate} />
            <RangePicker
                defaultValue={[moment(), moment()]}
                style={{ width: 184 }}
                disabledDate={ this.disabledDate }
                onChange={onChangeDate}
            />
        )
    };

    //选择器
    render() {
        const { renderDateComponent, onHandleSearch } = this;
        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <FormItem label="日期">
                    {/*日期选择器 onClick={onHandleSearch} */}
                    {renderDateComponent()}
                </FormItem>
                <FormItem>
                    <Button type="ghost" onClick={onHandleSearch}>查询</Button>
                </FormItem>
            </Form>
        );
    }
}

module.exports = Form.create()(FilterComponent);
