// 骑士分单规则列表
import React, { Component, PropTypes } from 'react';
import { Table } from 'antd';

class RulesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagination: {},
        }
    }

    componentWillMount() {

    }

    // 接受父级的数据
    componentWillReceiveProps = (nextProps) => {
    };


    render() {
        const { columns, activeAreaName, knightRuleListDetail } = this.props;
        return (
            <Table rowKey={(record, index) => { return index }} columns={ columns } dataSource={ activeAreaName ? knightRuleListDetail : [] } pagination={this.state.pagination} />
        )
    }
}
export default RulesList
