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

import browser from '../engine/browser'

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
        padding: '15px 15px',
        float: 'left',
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


class BrowserAnalysis extends Component {

    constructor (){
        super();
        this.count = 100;
        this.state = {
            webClients: null,
            detailPieOpen: false,

            pvWebHrefs: null,
            pvTimeBegin: null,
            pvHrefSelected: undefined,
            pvTimeSelected: 'day',
            pvOption: this.getOption('pv'),

            pfWebHrefs: null,
            pfTimeBegin: null,
            pfHrefSelected: undefined,
            pfTimeSelected: 'day',
            pfOption: this.getOption('pf'),

            detailOption: this.detailOption()
        };
        this.appid = null;
        this.pvData = null;
        this.pfData = null;
    }

    detailOption(){
        return {
            //backgroundColor: '#2c343c',

            title: {
                text: 'Entires Percent Pie',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#000000'
                }
            },

            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },

            //visualMap: {
            //    show: false,
            //    min: 100,
            //    max: 5000,
            //    inRange: {
            //        colorLightness: [0, 1]
            //    }
            //},
            series : [
                {
                    name:'资源比例',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data: [],
                    //data:[
                    //    {value:335, name:'直接访问'},
                    //    {value:310, name:'邮件营销'},
                    //    {value:274, name:'联盟广告'},
                    //    {value:235, name:'视频广告'},
                    //    {value:400, name:'搜索引擎'}
                    //].sort(function (a, b) { return a.value - b.value; }),
                    color: ['#2196f3', '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                    //roseType: 'radius',
                    //label: {
                    //    normal: {
                    //        textStyle: {
                    //            color: 'rgba(255, 255, 255, 0.3)'
                    //        }
                    //    }
                    //},
                    //labelLine: {
                    //    normal: {
                    //        lineStyle: {
                    //            color: 'rgba(255, 255, 255, 0.3)'
                    //        },
                    //        smooth: 0.2,
                    //        length: 10,
                    //        length2: 20
                    //    }
                    //},
                    itemStyle: {
                        normal: {
                            //color: '#2196f3',
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                        //emphasis: {
                        //    shadowBlur: 10,
                        //    shadowOffsetX: 0,
                        //    shadowColor: 'rgba(0, 0, 0, 0.5)'
                        //}
                    },

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        }
    }

    getOption(type) {
        let title, legend, yAxis, series;
        switch (type){
            case 'pv':
                title = 'Browser PV';
                yAxis = [
                    {
                        type: 'value',
                        //scale: true,
                        name: 'count',
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
                        name:'count',
                        type:'line',
                        data: []
                    }
                ];
                break;
            case 'pf':
                title = 'Browser PF';
                legend = {
                    data: ['max', 'min', 'average']
                };
                yAxis = [
                    {
                        type: 'value',
                        name: 'ms',
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
                        name:'max',
                        type:'line',
                        data: []
                    },
                    {
                        name:'min',
                        type:'line',
                        data: []
                    },
                    {
                        name:'average',
                        type:'line',
                        data: []
                    }
                ];
                break;
        }
        return {
            title: {
                text: title,
                left: '40%',
                top: '15px'
            },
            legend: legend,
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
                    smooth: false,
                    showSymbol: false,
                    hoverAnimation: false,
                }, item)
            })
        };
    };

    onChartClick(param, echart){
        if(this.state.pfTimeSelected !== "day")return;

        this.clearChart('detailOption');
        const pfid = this.pfData[param.dataIndex][`${param.seriesName}_id`];

        pfid && browser.analysisPFdetail({pfid: pfid}, (err, result)=>{
            if(result && result.status == "success"){
                let detailOption = this.state.detailOption;
                let data = result.data;

                let otherSum = 0;
                data.web_performance_page_entries.forEach((o)=>{
                    if(o.duration == 0)return;
                    if(o.duration < 5){
                        otherSum = + o.duration;
                        return;
                    }
                    detailOption.series[0].data.push({
                        value: o.duration,
                        name: o.name
                    });
                });

                if(otherSum > 0){
                    detailOption.series[0].data.push({
                        value: otherSum,
                        name: 'others'
                    });
                }

                detailOption.series[0].data.sort(function (a, b) { return a.value - b.value; });

                this.setState({
                    detailPieOpen: true,
                    detailOption: detailOption
                });
            }
        });
    }

    onChartLegendselectchanged(param, echart) {
        console.log(param, echart);
    }

    clearChart(key){

        const clearIteral = (item)=>{
            item? item.forEach((o)=>{
                o.data = [];
            }): null;
        };
        let item = this.state[key];

        clearIteral(item.series);
        clearIteral(item.xAxis);
        this.setState({key, item});
    }

    selectWebClient = (index)=>{
        this.appid = this.state.webClients[index].id;
        this.fetchClientHrefPV();
        this.fetchClientHrefPF();
    };

    fetchBrowserPVInfo() {
        this.clearChart('pvOption');

        let pvOption = this.state.pvOption;

        if(!this.state.pvHrefSelected)return;

        browser.analysisPV({
            appid: this.appid,
            type: this.state.pvTimeSelected,
            before: this.state.pvTimeBegin,
            location: this.state.pvHrefSelected
        }, (err, data)=>{
            if(data && data.status == "success"){
                this.pvData = data.result.dataArr;
                this.pvData.forEach((item)=>{
                    pvOption.series[0].data.push(item.count);
                    pvOption.xAxis[0].data.push(item.time);
                });
                this.setState({
                    pvOption: pvOption
                });
            }
        });
    }

    fetchBrowserPFInfo() {
        this.clearChart('pfOption');

        let pfOption = this.state.pfOption;

        if(!this.state.pfHrefSelected)return;

        browser.analysisPF({
            appid: this.appid,
            type: this.state.pfTimeSelected,
            before: this.state.pfTimeBegin,
            location: this.state.pfHrefSelected
        }, (err, data)=>{
            if(data && data.status == "success"){
                this.pfData = data.result.dataArr;
                this.pfData.forEach((item)=>{
                    pfOption.series[0].data.push(item.max);
                    pfOption.series[1].data.push(item.min);
                    pfOption.series[2].data.push(item.average);
                    pfOption.xAxis[0].data.push(item.time);
                });
                this.setState({
                    pfOption: pfOption
                });
            }
        });
    }

    fetchClientHrefPV(){
        browser.browserHref({
            appid: this.appid,
            before: this.state.pvTimeBegin
        }, (err, result)=>{
            if(result && result.status == "success"){
                result.data && result.data.length > 0?
                this.setState({
                    pvWebHrefs: result.data,
                    pvHrefSelected: result.data[0].location
                }, ()=>{
                    this.fetchBrowserPVInfo();
                }): void(0);
            }
        });
    };

    fetchClientHrefPF(){
        browser.browserHref({
            appid: this.appid,
            before: this.state.pfTimeBegin
        }, (err, result)=>{
            if(result && result.status == "success"){
                result.data && result.data.length > 0?
                this.setState({
                    pfWebHrefs: result.data,
                    pfHrefSelected:  result.data[0].location
                }, ()=>{
                    this.fetchBrowserPFInfo();
                }): void(0);
            }
        });
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value }, ()=>{
            if(name == "pvTimeBegin")this.fetchClientHrefPV();
            if(name == "pvHrefSelected" || name == "pvTimeSelected")this.fetchBrowserPVInfo();

            if(name == "pfTimeBegin")this.fetchClientHrefPF();
            if(name == "pfHrefSelected" || name == "pfTimeSelected")this.fetchBrowserPFInfo();
        });
    };

    componentWillMount(){
    }

    componentDidMount(){
        browser.browserClient(null, (err, data)=>{
            if(data.status == "success" && data.webClients && data.webClients.rows){
                let clients = data.webClients.rows;
                this.setState({webClients: clients}, ()=>{
                    this.selectWebClient(0);
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
                    title="Web"
                    dataList={this.state.webClients}
                    selectedCallback={this.selectWebClient.bind(this)}
                />
                {/*<div id="span-controls" className={classes.spanControl}></div>*/}
                <div className={classes.container}>
                    <div className={classes.item}>
                        <div className={classes.itemSelect}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="">unit</InputLabel>
                                <Select
                                    native
                                    value={this.state.pvTimeSelected}
                                    onChange={this.handleChange('pvTimeSelected')}
                                    input={<Input id="errorScale" />}
                                >
                                    <option value={'day'}>Day</option>
                                    <option value={'month'}>Month</option>
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl} style={{minWidth: "320px"}}>
                                <InputLabel htmlFor="">href</InputLabel>
                                <Select
                                    native
                                    value={this.state.pvHrefSelected}
                                    onChange={this.handleChange('pvHrefSelected')}
                                    input={<Input id="hrefPVScale" />}
                                >
                                    {this.state.pvWebHrefs? this.state.pvWebHrefs.map((o, i)=>{
                                        return <option key={i} value={o.location}>{o.location}</option>
                                    }): <option value={undefined}>\</option>}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    label="begin"
                                    type="date"
                                    defaultValue="2017-09-01"
                                    className={classes.textField}
                                    onChange={this.handleChange('pvTimeBegin')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <ReactEcharts
                            ref='echarts_react'
                            option={this.state.pvOption}
                        />
                    </div>
                    <div className={classes.item}>
                        <div className={classes.itemSelect}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="">unit</InputLabel>
                                <Select
                                    native
                                    value={this.state.pfTimeSelected}
                                    onChange={this.handleChange('pfTimeSelected')}
                                    input={<Input id="exceptionScale" />}
                                >
                                    <option value={'day'}>Day</option>
                                    <option value={'month'}>Month</option>
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl} style={{minWidth: "320px"}}>
                                <InputLabel htmlFor="">href</InputLabel>
                                <Select
                                    native
                                    value={this.state.pfHrefSelected}
                                    onChange={this.handleChange('pfHrefSelected')}
                                    input={<Input id="hrefPFScale" />}
                                >
                                    {this.state.pfWebHrefs? this.state.pfWebHrefs.map((o, i)=>{
                                            return <option key={i} value={o.location}>{o.location}</option>
                                    }): <option value={undefined}>\</option>}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    label="begin"
                                    type="date"
                                    defaultValue="2017-09-01"
                                    className={classes.textField}
                                    onChange={this.handleChange('pfTimeBegin')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <ReactEcharts
                            ref='echarts_react'
                            option={this.state.pfOption}
                            onEvents = {{
                                'click': this.onChartClick.bind(this)
                            }}
                        />
                    </div>
                    {/*{this.state.detailPieOpen?*/}
                        <div className={classes.item}>
                            <ReactEcharts
                                ref='echarts_react'
                                option={this.state.detailOption}
                            />
                        </div>
                    {/*: null}*/}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
};

export default compose(withStyles(styleSheet), connect(mapStateToProps))(BrowserAnalysis);