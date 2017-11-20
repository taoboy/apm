import React,{Component} from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import compose from 'recompose/compose';
import Table,{ TableBody,TableCell,TableHead,TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import browser from '../engine/browser';
import Pagination from './AppPagination';
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
    },
});

class BrowserException extends Component {
    constructor(props) {
        super(props);
        this.state = {  //先声明变量并初始化
            webClients: null,

            tableData: null,
            tableDataCount: 1,
            currentPage: 1,
            defaultLimit: 13
        };
        this.appid = null;
    }


    selectWebClient = (index)=>{
        this.appid = this.state.webClients[index].id;
        this.broexception(1);
    };

    getWebClients = ()=>{
        browser.browserClient(null, (err, data)=>{
            if (data.status == "success") {
                this.setState({webClients: data.webClients.rows}, ()=>{
                    this.selectWebClient(0);
                });
            }
        });
    };

    broexception = (index) => {

        browser.broException({
            appid: this.appid,
            offset: (index-1)*this.state.defaultLimit,
            limit: this.state.defaultLimit
        }, (err, data) => {
            if (err) return alert("数据加载失败");

            if (data.status == "success") {
                this.setState({
                    
                    currentPage: index,
                    tableData: data.webException.rows,
                    tableDataCount: data.webException.count
                });
            }
        })
    };

    onChange = (index)=>{
        this.broexception(index);
    };

    componentWillMount() {//组件渲染完成之前触发此函数
        this.getWebClients();
    };

    render() {
        const { classes, open } = this.props;
        const tableData = this.state.tableData;
        return (
            <div className={classes.section}>
                <AppSelect
                    title="Web"
                    dataList={this.state.webClients}
                    selectedCallback={this.selectWebClient.bind(this)}
                />
                <Paper open={open} className={classes.paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell >#</TableCell>
                                {/*<TableCell >user_agent</TableCell>*/}
                                {/*<TableCell >服务端记录时间</TableCell>*/}
                                {/*<TableCell >Web端</TableCell>*/}
                                <TableCell >页面链接</TableCell>
                                {/*<TableCell >页面源地址</TableCell>*/}
                                {/*<TableCell >页面域名</TableCell>*/}
                                {/*<TableCell >页面协议</TableCell>*/}
                                <TableCell >异常msg</TableCell>
                                <TableCell >异常来源</TableCell>
                                <TableCell >异常行号</TableCell>
                                <TableCell >异常列号</TableCell>
                                {/*<TableCell >异常信息</TableCell>*/}
                                {/*<TableCell >国家</TableCell>*/}
                                {/*<TableCell >省份</TableCell>*/}
                                {/*<TableCell >城市</TableCell>*/}
                                {/*<TableCell >浏览器操作系统</TableCell>*/}
                                {/*<TableCell >是否移动端</TableCell>*/}
                                {/*<TableCell >浏览器名称</TableCell>*/}
                                {/*<TableCell >浏览器版本号</TableCell>*/}
                                {/*<TableCell >是否微信</TableCell>*/}
                                <TableCell >记录时间</TableCell>
                                <TableCell >操作</TableCell>
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
                                            {/*<TableCell>*/}
                                            {/*{n.user_agent}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell >*/}
                                            {/*{ser_time}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell >*/}
                                                {/*{n.web_client.name}*/}
                                            {/*</TableCell>*/}
                                            <TableCell >
                                                {n.location_href}
                                            </TableCell>
                                            {/*<TableCell >*/}
                                            {/*{n.location_origin}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell >*/}
                                            {/*{n.location_host}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell >*/}
                                            {/*{n.location_protocal}*/}
                                            {/*</TableCell>*/}
                                            <TableCell >
                                                {n.exception_msg.substring(0, 40)}
                                            </TableCell>
                                            <TableCell >
                                                {n.exception_url}
                                            </TableCell>
                                            <TableCell >
                                                {n.exception_line}
                                            </TableCell>
                                            <TableCell >
                                                {n.exception_col}
                                            </TableCell>
                                            {/*<TableCell >*/}
                                            {/*{n.exception_error}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell >*/}
                                                {/*{n.geolocation_country}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell >*/}
                                                {/*{n.geolocation_province}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell >*/}
                                                {/*{n.geolocation_city}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell >*/}
                                                {/*{n.client_OS}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell >*/}
                                                {/*{n.client_mobile ? 'Y' : 'N'}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell >*/}
                                                {/*{n.client_name}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell >*/}
                                                {/*{n.client_version}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell >*/}
                                                {/*{n.client_weixin ? 'Y' : 'N'}*/}
                                            {/*</TableCell>*/}
                                            <TableCell >
                                                {cli_time}
                                            </TableCell>
                                            <TableCell >
                                                <Link to={'/browser/exception/detail/'+ n.id}>
                                                    详情
                                                </Link>
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
export default compose(withStyles(styleSheet))(BrowserException);


