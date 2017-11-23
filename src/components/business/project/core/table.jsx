// 项目列表模块
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { hashHistory, Link } from 'dva/router';
import { Pagination, Table } from 'antd';
//引入枚举值
import { JOIN, DIRECT } from './enumerate.js'
import style from './style.less';

class PeojectTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {
                _meta: [],
                data: []
            },
        }
        this.private = {
            columns: []
        }
    }

    componentWillMount() {
        console.log(this.props)
        const { columns, dataSource } = this.props;
        this.private.columns = columns;
        this.setState({ dataSource })
    }

    componentWillReceiveProps(nextProps) {
        const { dataSource } = nextProps;
        this.setState({ dataSource })
    }

    render() {
        const { columns } = this.private;
        const { dataSource } = this.state;
        const { pagination } = this.props;
        return (
            <div>
                <Table
                    rowKey={(record, index) => { return index }}
                    dataSource={ dataSource.data }
                    columns={ columns }
                    pagination={ pagination }
                />
            </div>
        );
    }
}

export default PeojectTable

