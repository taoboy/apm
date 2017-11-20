import React, {Component} from 'react';
import {connect} from 'react-redux';
import compose from 'recompose/compose';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import {withStyles} from 'material-ui/styles';
import node from '../engine/node';

import Menu, {MenuItem} from 'material-ui/Menu';
import Typography from 'material-ui/Typography';
import Pagination from './AppPagination'
import AppSelect from './AppSelect';

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
    }
});

class NodeException extends Component {
    constructor(props) {
        super(props);
        this.state = {  //先声明变量并初始化
            nodeClients: null,

            tableData: null,
            tableDataCount: 1,
            currentPage: 1,
            defaultLimit: 13
        };
        this.appid = null;
    }

    nodexception = (index) => {

        node.nodeException({
            appid: this.appid,
            offset: (index - 1) * this.state.defaultLimit,
            limit: this.state.defaultLimit
        }, (err, data) => {
            if (err) return alert("数据加载失败");

            if (data.status == "success") {
                this.setState({
                    tableData: data.nodeException.rows,
                    currentPage: index,
                    tableDataCount: data.nodeException.count
                })
            }
        })
    };

    getUserNode = (callback)=>{
        node.getUserNode(null, (err, data)=>{
            if(data.status == "success" && data.nodeClients && data.nodeClients.rows){
                callback(data.nodeClients.rows);
            }
        })
    };

    selectNodeClient = (index)=>{
        this.appid = this.state.nodeClients[index].id;
        this.nodexception(1);
    };

    onChange = (index) => {
        this.nodexception(index);
    };

    componentWillMount() {//组件渲染完成之前触发此函数
        this.getUserNode((clients)=>{
            this.setState({nodeClients: clients}, ()=>{
                this.selectNodeClient(0);
            });
        });
    };

    render() {
        const {classes, open} = this.props;
        const tableData = this.state.tableData;
        return (
            <div className={classes.section}>
                <AppSelect
                    title="Node"
                    dataList={this.state.nodeClients}
                    selectedCallback={this.selectNodeClient.bind(this)}
                />
                <Paper open={open} className={classes.paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell >#</TableCell>
                                <TableCell >Node端</TableCell>
                                <TableCell >客户端记录时间</TableCell>
                                <TableCell >服务端记录时间</TableCell>
                                <TableCell >异常类型</TableCell>
                                <TableCell >异常信息</TableCell>
                                <TableCell >异常堆栈</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData ? tableData.map((n, i) => {
                                const ctime = new Date(n.client_time);
                                const stime = new Date(n.server_time);
                                const cli_time = ctime.getFullYear() + "/" + (ctime.getMonth() + 1) + "/" + ctime.getDate() + " " + (ctime.getHours() - 8) + ":" + ctime.getMinutes() + ":" + ctime.getSeconds();
                                const ser_time = stime.getFullYear() + "/" + (stime.getMonth() + 1) + "/" + stime.getDate() + " " + (stime.getHours() - 8) + ":" + stime.getMinutes() + ":" + stime.getSeconds();
                                return (
                                    <TableRow
                                        key={n.id}>
                                        <TableCell>
                                            {(this.state.currentPage - 1) * this.state.defaultLimit + i + 1}
                                        </TableCell>
                                        <TableCell>
                                            {n.node_client.name}
                                        </TableCell>
                                        <TableCell >
                                            {cli_time}
                                        </TableCell>
                                        <TableCell >
                                            {ser_time}
                                        </TableCell>
                                        <TableCell >
                                            {n.type}
                                        </TableCell>
                                        <TableCell >
                                            {n.message}
                                        </TableCell>
                                        <TableCell >
                                            {n.stack.substring(0, 30)}
                                        </TableCell>
                                    </TableRow>
                                );
                            }) : void(0)}
                        </TableBody>
                    </Table>
                </Paper>
                <Pagination
                    currentPage={this.state.currentPage}
                    totalPages={this.state.tableDataCount == 0 ? 1 : Math.ceil(this.state.tableDataCount / this.state.defaultLimit)}
                    boundaryPagesRange={2}
                    siblingPagesRange={1}
                    onChange={this.onChange}
                />
            </div>
        );
    }

}
export default compose(withStyles(styleSheet))(NodeException);


