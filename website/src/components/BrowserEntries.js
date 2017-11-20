import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import browser from '../engine/browser';

import Pagination from './AppPagination'


const styleSheet = theme => ({
    section: {
        width: '100%',
    },
    paper: {
        // maxWidth: '900px',
        // height: '700px',
        flex: '1 1 100%',
        margin: '0 auto',
        overflow: 'auto',
    },
});

class BrowserEntries extends Component {
    constructor(props) {
        super(props);
        this.state = {  //先声明变量并初始化
            tableData: null,
            tableDataCount: 1,
            currentPage: 1,
            defaultLimit: 13
        };
    }

    broentries = (index) => {

        browser.broEntries({
            offset: (index-1)*this.state.defaultLimit,
            limit: this.state.defaultLimit
        }, (err, data) => {
            if (err) return alert("数据加载失败");

            if (data.status == "success") {
                this.setState({
                    
                    currentPage: index,
                    tableData: data.webEntries.rows,
                    tableDataCount: data.webEntries.count
                });
            }
        })
    };

    onChange = (index)=>{
        this.broentries(index);
    }

    componentWillMount() {//组件渲染完成之前触发此函数
        this.broentries(1);
    };

    render() {
        const { classes, open } = this.props;
        const tableData = this.state.tableData;
        return (
            <div className={classes.section}>
                <Paper open={open} className={classes.paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell >#</TableCell>
                                <TableCell >Web端</TableCell>
                                <TableCell >请求页面</TableCell>
                                <TableCell >引入名称</TableCell>
                                <TableCell >引入类型</TableCell>
                                <TableCell >资源类型</TableCell>
                                <TableCell >TCP耗时</TableCell>
                                <TableCell >下载耗时</TableCell>
                                <TableCell >DNS耗时</TableCell>
                                <TableCell >重定向耗时</TableCell>
                                <TableCell >加载耗时</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData ? tableData.map((n, i) => {
                                    return (
                                        <TableRow
                                            key={n.id}>
                                            <TableCell>
                                                {(this.state.currentPage - 1) * this.state.defaultLimit + i + 1}
                                            </TableCell>
                                            <TableCell >
                                                {n.web_performance_page.web_client.name}
                                            </TableCell>
                                            <TableCell >
                                                {n.web_performance_page.location_href}
                                            </TableCell>
                                            <TableCell >
                                                {n.name}
                                            </TableCell>
                                            <TableCell >
                                                {n.entry_type}
                                            </TableCell>
                                            <TableCell >
                                                {n.initiator_type}
                                            </TableCell>
                                            <TableCell>
                                                {n.connect}
                                            </TableCell>
                                            <TableCell >
                                                {n.duration}
                                            </TableCell>
                                            <TableCell >
                                                {n.lookup_domain}
                                            </TableCell>
                                            <TableCell >
                                                {n.redirect}
                                            </TableCell>
                                            <TableCell >
                                                {n.request}
                                            </TableCell>

                                        </TableRow>
                                    );
                                }) : void(0)}
                        </TableBody>
                    </Table>
                </Paper>
                <Pagination
                    currentPage={this.state.currentPage}
                    totalPages={Math.ceil(this.state.tableDataCount / this.state.defaultLimit)}
                    boundaryPagesRange={2}
                    siblingPagesRange={1}
                    onChange={this.onChange}
                />
            </div>
        );
    }

}
export default compose(withStyles(styleSheet))(BrowserEntries);


