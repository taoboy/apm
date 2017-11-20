/**
 * Created by lenovo on 2017/8/25.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Collapse from 'material-ui/transitions/Collapse';
import TextField from 'material-ui/TextField';

import Pagination from './AppPagination'
import task from '../engine/task';


const styleSheet = theme => ({
    section: {
        width: '100%',
    },
    paper: {
        // maxWidth: '900px',
        // height: '700px',
        // paddingLeft: '24px',
        // paddingRight: '24px',
        flex: '1 1 100%',
        margin: '0 auto',
        overflow: 'auto',
    },
    controlPanel: {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        marginTop: '15px',
        marginLeft: '15px',
        height: '48px'
    },
    button: {
        width: '88px',
        height: '36px',
        marginLeft: '15px'
    },
    container: {
        display: 'flex',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

class BrowserBusiness extends Component {
    constructor(props) {
        super(props);
        this.state = {  //先声明变量并初始化
            tableData: [],
            tableDataCount: 1,
            currentPage: 1,
            defaultLimit: 13,
            expanded: false,
            formData: {
                name: null,
                struct: 'koa2'
            }
        }
    }

    getNodeTask = (index) => {

        task.myNodeTask({
            offset: (index-1)*this.state.defaultLimit,
            limit: this.state.defaultLimit
        }, (err, data) => {
            if (err) return alert("数据加载失败");

            if (data.status == "success") {
                this.setState({
                    tableData: data.nodeClients.rows,
                    currentPage: index,
                    tableDataCount: data.nodeClients.count
                })
            }
        })
    };

    onChange = (index)=>{
        this.getNodeTask(index);
    };

    displayInput = ()=>{
        //let tmpData = this.state.tableData;
        //tmpData.unshift()
        this.setState({
            expanded: !this.state.expanded
        });
    };

    addItem = ()=>{
        console.log(this.state.formData);
        task.addNodeTask(this.state.formData, (err, data) => {
            if (err) return alert("数据加载失败");
            if (data.status == "success") {
                this.getNodeTask(1);
                this.setState({
                    expanded: false
                });
            } else {
                return alert("数据加载失败");
            }
        })
    };



    componentWillMount() {//组件渲染完成之前触发此函数
        this.getNodeTask(1);
    };

    render() {
        const { classes, open } = this.props;
        const tableData = this.state.tableData;
        return (
            <div className={classes.section}>
                <Paper open={open} className={classes.paper}>
                    <div className={classes.controlPanel}>
                        <Collapse in={this.state.expanded} transitionDuration="auto" unmountOnExit>
                            <div className={classes.container}>
                                <TextField
                                    id="name"
                                    label="Name"
                                    className={classes.textField}
                                    value={this.state.formData.name}
                                    onChange={event => {
                                        let tmp = {name: event.target.value, struct: this.state.formData.struct};
                                        this.setState({formData: tmp})
                                    }}
                                />
                                {/*<TextField*/}
                                    {/*id="struct"*/}
                                    {/*label="Struct"*/}
                                    {/*className={classes.textField}*/}
                                    {/*defaultValue="koa2"*/}
                                    {/*value={this.state.formData.struct}*/}
                                    {/*onChange={event => {*/}
                                        {/*let tmp = {name: this.state.formData.name, struct: event.target.value};*/}
                                        {/*this.setState({formData: tmp})*/}
                                    {/*}}*/}
                                {/*/>*/}
                            </div>
                        </Collapse>
                        {!this.state.expanded ?
                            <div>
                                <Button raised color="primary" onClick={this.displayInput} className={classes.button}>
                                    Add
                                </Button>
                            </div>
                            :
                            <div>
                                <Button raised color="accent" onClick={this.addItem} className={classes.button}>
                                    Save
                                </Button>
                                <Button raised dense onClick={this.displayInput} className={classes.button}>
                                    Cancel
                                </Button>
                            </div>
                        }
                    </div>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{width: '20px'}}>index</TableCell>
                                <TableCell >name</TableCell>
                                <TableCell >appid</TableCell>
                                <TableCell >struct</TableCell>
                                <TableCell >version</TableCell>
                                <TableCell >time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {tableData? tableData.map((n, i) => {
                            let cli_time = null;
                            if(n.time){
                                const ctime = new Date(n.time);
                                cli_time = ctime.getFullYear()+"年"+(ctime.getMonth()+1)+"月"+ctime.getDate()+"日"+(ctime.getHours()-8)+"时"+ctime.getMinutes()+"分"+ctime.getSeconds()+"秒";
                            }

                            return (
                                <TableRow
                                    key={n.id}>
                                    <TableCell>
                                        {i+1}
                                    </TableCell>
                                    <TableCell>
                                        {n.name}
                                    </TableCell>
                                    <TableCell>
                                        {n.appid}
                                    </TableCell>
                                    <TableCell>
                                        {n.struct}
                                    </TableCell>
                                    <TableCell>
                                        {n.version}
                                    </TableCell>
                                    <TableCell>
                                        {cli_time}
                                    </TableCell>
                                </TableRow>
                            );
                        }): void(0)}
                        </TableBody>
                    </Table>
                </Paper>
                <Pagination
                    currentPage={this.state.currentPage}
                    totalPages={this.state.tableDataCount == 0? 1: Math.ceil(this.state.tableDataCount/this.state.defaultLimit)}
                    boundaryPagesRange={2}
                    siblingPagesRange={1}
                    onChange={this.onChange}
                />
            </div>
        );
    }

}
export default compose(withStyles(styleSheet))(BrowserBusiness);


