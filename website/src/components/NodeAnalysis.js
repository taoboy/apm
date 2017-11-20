/**
 * Created by lenovo on 2017/7/25.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
// import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import ReactEcharts from '../core/echartlib';
import AppSelect from './AppSelect';

import node from '../engine/node'

const styleSheet = theme => ({

    appContent: {
        width: '100%',
        //flex: '1 1 100%',
        margin: '0 auto'
    },
    nodeSelect: {
        position: 'relative',
        width: '250px',
        background: theme.palette.background.contentFrame
    },
    container: {
        width: '100%',
        '&:after': {
            display: 'block',
            clear: 'both',
            content: '""'
        },
        //height: 'auto'
        //display: 'flex'
    },
    item: {
        position: 'relative',
        width: '800px',
        height: 'auto',
        padding: '15px 15px'
        //float: 'left',
        //marginLeft: '24px',
        //marginTop: '24px',
        //display: 'flex',
        //flexDirection: 'row',
    },
    itemSelect: {
        position: 'relative',
        width: '100%',
        height: '48px'
    },
    formControl: {
        //margin: theme.spacing.unit,
        float: 'right',
        marginRight: '10px',
        minWidth: 120,
        zIndex: 1
    },
    itemStats: {
        flex: '0 0 150px'
    },
    itemChart: {
    }
});


class NodeAnalysis extends Component {

    constructor (){
        super();
        this.count = 100;
        this.state = {
            nodeClients: null,

            errorSelected: 'day',
            errorBegin: null,
            errorOption: this.getOption('error'),

            exceptionSelected: 'day',
            exceptionBegin: null,
            exceptionOption: this.getOption('exception'),
        };
        this.appid = null;
        this.data = null;
        this.dataInterval = null;
    }

    selectNodeClient = (index)=>{
        this.appid = this.state.nodeClients[index].id;
        this.fetchErrorInfo();
        this.fetchExceptionInfo();
    };

    getOption(type) {
        let legend, text, yAxis, series;
        switch (type){
            case 'error':
                text = 'Node Error';
                yAxis = [
                    {
                        type: 'value',
                        //scale: true,
                        name: 'sum',
                        min: 0,
                        max: 'dataMax',
                        //interval: 10,
                        boundaryGap: [1],
                        ticks: {
                            beginAtZero: true
                        },
                    }
                ];
                series =  [
                    {
                        name:'error',
                        type:'bar',
                        data: []
                    }
                ];
                break;
            case 'exception':
                text = 'Node Exception';
                yAxis = [
                    {
                        type: 'value',
                        name: 'sum',
                        min: 0,
                        max: 'dataMax',
                        //interval: 10,
                        boundaryGap: [1],
                        ticks: {
                            beginAtZero: true
                        },
                    }
                ];
                series =  [
                    {
                        name:'exception',
                        type:'bar',
                        data: []
                    }
                ];
                break;
        }
        return {
            title: {
                text: text,
                left: '40%',
                top: '15px'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: 50,
                left: 45,
                right: 10,
                bottom:30
            },
            color: ['#2196f3', '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
            xAxis: [
                {
                    type: 'category',
                    gridLines: {
                        display: false
                    },
                    data: (()=>{
                        let now = new Date();
                        let res = [];
                        let len = this.count;
                        //while (len--) {
                        //    res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
                        //    now = new Date(now - 2000);
                        //}
                        return res;
                    })()
                }
            ],
            yAxis: yAxis,
            series: series.map((item)=>{
                return Object.assign({}, {
                    smooth: true,
                    showSymbol: false,
                    hoverAnimation: false,
                }, item)
            })
        };
    };

    clearChart(key){
        //Object.keys(this.state).forEach((key)=>{
        //    if(key.indexOf('Option') != -1){
                let item = this.state[key];
                item.series[0].data = [];
                item.xAxis[0].data = [];

                this.setState({key, item});
        //    }
        //});
    }

    fetchErrorInfo() {
        this.clearChart('pvOption');

        let errorOption = this.state.errorOption;
        let before = new Date(`${this.state.errorBegin} 00:00:00`);

        node.errorAnalysis({
            appid: this.appid,
            type: this.state.errorSelected,
            before: before.getTime()
        }, (err, data)=>{
            if(data && data.status == "success"){
                let errorData = data.result.dataArr;
                errorData.forEach((item)=>{
                    errorOption.series[0].data.push(item.count);
                    errorOption.xAxis[0].data.push(item.time);
                });
                this.setState({
                    errorOption: errorOption
                });
            }
        });
    }

    fetchExceptionInfo() {
        this.clearChart('exceptionOption');

        let exceptionOption = this.state.exceptionOption;
        let before = new Date(`${this.state.exceptionBegin} 00:00:00`);

        node.exceptionAnalysis({
            appid: this.appid,
            type: this.state.exceptionSelected,
            before: before.getTime()
        }, (err, data) => {
            if (data && data.status == "success") {
                let exceptionData = data.result.dataArr;
                exceptionData.forEach((item) => {
                    exceptionOption.series[0].data.push(item.count);
                    exceptionOption.xAxis[0].data.push(item.time);
                });
                this.setState({
                    exceptionOption: exceptionOption
                });
            }
        });
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value }, ()=>{
            if(name.indexOf('error') != -1)this.fetchErrorInfo();
            if(name.indexOf('exception') != -1)this.fetchExceptionInfo();
        });
    };

    componentWillMount(){

    }

    componentDidMount(){
        node.getUserNode(null, (err, data)=>{
            if(data.status == "success" && data.nodeClients && data.nodeClients.rows){
                let clients = data.nodeClients.rows;
                this.setState({nodeClients: clients}, ()=>{
                    this.appid = this.state.nodeClients[0].id;
                    this.fetchErrorInfo();
                    this.fetchExceptionInfo();
                });
            }
        });
    }

    componentWillUnmount() {
    }

    render(){
        const {classes, user} = this.props;

        return(
            <div className={classes.appContent}>
                <AppSelect
                    title="Node"
                    dataList={this.state.nodeClients}
                    selectedCallback={this.selectNodeClient.bind(this)}
                />
                {/*<div id="span-controls" className={classes.spanControl}></div>*/}
                <div className={classes.container}>
                    <div className={classes.item}>
                        <div className={classes.itemSelect}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="">unit</InputLabel>
                                <Select
                                    native
                                    value={this.state.errorSelected}
                                    onChange={this.handleChange('errorSelected')}
                                    input={<Input id="errorScale" />}
                                >
                                    <option value={'day'}>Day</option>
                                    <option value={'month'}>Month</option>
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    label="begin"
                                    type="date"
                                    defaultValue="2017-09-01"
                                    className={classes.textField}
                                    onChange={this.handleChange('errorBegin')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <ReactEcharts
                            ref='echarts_react'
                            option={this.state.errorOption}
                        />
                    </div>
                    <div className={classes.item}>
                        <div className={classes.itemSelect}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="">unit</InputLabel>
                                <Select
                                    native
                                    value={this.state.exceptionSelected}
                                    onChange={this.handleChange('exceptionSelected')}
                                    input={<Input id="exceptionScale" />}
                                >
                                    <option value={'day'}>Day</option>
                                    <option value={'month'}>Month</option>
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    label="begin"
                                    type="date"
                                    defaultValue="2017-09-01"
                                    className={classes.textField}
                                    onChange={this.handleChange('exceptionBegin')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <ReactEcharts
                            ref='echarts_react'
                            option={this.state.exceptionOption}
                        />
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
};

export default compose(withStyles(styleSheet), connect(mapStateToProps))(NodeAnalysis);