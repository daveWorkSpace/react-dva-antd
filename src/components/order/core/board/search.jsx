import React, { Component, PropTypes } from 'react';
import { hashHistory, Link } from 'dva/router';
import { Form, Button, Select } from 'antd';
import style from './style.less';

import { OrderParams } from '../exports';

const moment = require('moment');

const { rgReg, requestPagerSize, requestPageNumber } = OrderParams;

//初始化变量   {/*onChange={onChangeCity}defaultValue={cityCode}*/} {/*{...state}*/}
const [FormItem, Option] = [Form.Item, Select.Option];

//引入枚举值
import { DIRECT, AFFILIATE } from '../enumerate.js'

class boardSearch extends Component {
    constructor(props) {
        super();
        this.state = {
            date: props.date,
        };
        this.private = {
            onChangeDate: props.onChangeDate,      //选择日期的时间回调
            onHandleSearch: props.onHandleSearch,  //处理搜索回调
        };
        //点击异常单按钮触发事件
        this.handleClickToGo = this.handleClickToGo.bind(this);
    }

    componentWillReceiveProps = (nextProps) => {
        //初始化新数据
        this.setState({
            date: nextProps.date,                //当前日期
        });
    };

    //选择日期
    onChangeDate = (date) => {
        this.private.onChangeDate(date);
    };

    //搜索
    onHandleSearch = () => {
        this.private.onHandleSearch();
    };

    //日期
    renderDateComponent = () => {
        //昨天
        const yesterday = moment().subtract(1, 'days').format().replace(rgReg, '').substring(0, 8);
        //今天
        const today = moment().format().replace(rgReg, '').substring(0, 8);
        //明天
        const tomorrow = moment().add(1, 'days').format().replace(rgReg, '').substring(0, 8);
        const dateSource = [
            { title: '昨天', date: yesterday },
            { title: '今天', date: today },
            { title: '明天', date: tomorrow },
        ];
        const { onChangeDate } = this;
        return (
            <Select
                showSearch
                style={{ width: 150 }}
                placeholder="请选择日期"
                optionFilterProp="children"
                onChange={onChangeDate}
                defaultValue={'今天'}
            >
                {
                    //渲染选项
                    dateSource.map((item, index) => {
                        return (<Option key={index} value={item.date} title={item.title}>{item.title}</Option>);
                    })
                }
            </Select>
        )
    };

    //点击异常单按钮触发事件
    handleClickToGo() {
        window.sessionStorage && sessionStorage.setItem('simulateHeaderMenuState', true)
    }

    /**
     * 选择器
     * @returns
     * @memberof boardSearch
     */
    render() {
        const { renderDateComponent, onHandleSearch } = this;
        // 异常单跳转
        const { type } = this.props;
        let redirectPath = '';
        if (type === DIRECT) {
            redirectPath = '/order/exception/direct'
        } else if (type === AFFILIATE) {
            redirectPath = '/order/exception/affiliate'
        }

        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <FormItem label="日期" className={ style.marginBottom0 }>
                    {/*日期选择器 */}
                    {renderDateComponent()}
                </FormItem>
                <FormItem className={ style.marginBottom0 }>
                    <Button type="primary" onClick={onHandleSearch}>查询</Button>
                </FormItem>
                <FormItem className={ style.marginBottom0 }>
                    <Link to={ redirectPath } onClick={this.handleClickToGo()} className={style.exception}><Button>异常单查看</Button></Link>
                </FormItem>
            </Form>
        );
    }
}

module.exports = Form.create()(boardSearch);
