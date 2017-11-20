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
import Typography from 'material-ui/Typography';
import AppSelect from './AppSelect';
import ReactEcharts from '../core/echartlib';

import node from '../engine/node'

const styleSheet = theme => ({

    appContent: {
        width: '100%',
        //flex: '1 1 100%',
        margin: '0 auto'
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
        height: '320px',
        float: 'left',
        marginLeft: '24px'
        //marginTop: '24px'
        //display: 'flex',
        //flexDirection: 'row',
    },
    itemStats: {
        flex: '0 0 150px'
    },
    itemChart: {
    }
});

const defaultSpan = 1;

class NodeDashboard extends Component {

    constructor (){
        super();
        this.count = 100;
        this.state = {
            nodeClients: null,

            errorOption: this.getOption('cpu'),
            memOption: this.getOption('mem'),
            loadOption: this.getOption('load'),
            resOption: this.getOption('res'),
            rpsOption: this.getOption('rps')
        };
        this.os = {
            cpu: 0,
            memory: 0,
            load: 0,
            timestamp: Date.now()
        };
        this.res = {
            //'2': 0,
            //'3': 0,
            //'4': 0,
            //'5': 0,
            count: 0,
            mean: 0,
            timestamp: Date.now()
        };
        this.data = null;
        this.dataInterval = null;

        this.socket = io(location.protocol + '//' + location.hostname + ':' + location.port);
    }

    getOption(type) {
        let legend = '', yAxis, series;
        switch (type){
            case 'cpu':
                legend = 'CPU Usage';
                yAxis = [
                    {
                        type: 'value',
                        //scale: true,
                        name: 'cpu(%)',
                        max: 100,
                        min: 0,
                        boundaryGap: [0.5, 0.5],
                        ticks: {
                            beginAtZero: true
                        },
                    }
                ];
                series =  [
                    {
                        name:'cpu',
                        type:'line',
                        data: []
                    }
                ];
                break;
            case 'mem':
                legend = 'Memory Usage';
                yAxis = [
                    {
                        type: 'value',
                        name: 'memory(MB)',
                        min: 0,
                        max: 'dataMax',
                        interval: 10,
                        boundaryGap: [1],
                        ticks: {
                            beginAtZero: true
                        },
                    }
                ];
                series =  [
                    {
                        name:'memory',
                        type:'line',
                        data: []
                    }
                ];
                break;
            case 'load':
                legend = 'Load Avg';
                yAxis = [
                    {
                        type: 'value',
                        name: 'load',
                        min: 0,
                        max: 'dataMax',
                        boundaryGap: [0.1],
                        ticks: {
                            beginAtZero: true
                        },
                    }
                ];
                series =  [
                    {
                        name:'load',
                        type:'line',
                        data: []
                    }
                ];
                break;
            case 'res':
                legend = 'Response Time';
                yAxis = [
                    {
                        type: 'value',
                        name: 'time(ms)',
                        min: 0,
                        max: 'dataMax',
                        //boundaryGap: [],
                        ticks: {
                            beginAtZero: true
                        },
                    }
                ];
                series =  [
                    {
                        name:'load',
                        type:'line',
                        data: []
                    }
                ];
                break;
            case 'rps':
                legend = 'Response Per Second';
                yAxis = [
                    {
                        type: 'value',
                        name: 'count',
                        min: 0,
                        max: 'dataMax',
                        boundaryGap: [1],
                        ticks: {
                            beginAtZero: true
                        },
                    }
                ];
                series =  [
                    {
                        name:'rps',
                        type:'line',
                        data: []
                    }
                ];
                break;
        }
        return {
            title: {
                legend: legend,
                text: '',
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
                    //smooth: true,
                    showSymbol: false,
                    hoverAnimation: false,
                }, item)
            })
        };
    };

    drawChart(){
        let lastResTimeStamp = Date.now();

        this.dataInterval = setInterval(()=>{
            const time1 = new Date(this.os.timestamp).toLocaleTimeString().replace(/^\D*/,'');

            let cpuOption = this.state.errorOption;
            let cpuData = cpuOption.series[0].data;
            if(cpuData.length > this.count-1){
                cpuData.shift();
                cpuOption.xAxis[0].data.shift();
            }
            cpuData.push(this.os.cpu);
            cpuOption.xAxis[0].data.push(time1);
            cpuOption.title.text = cpuOption.title.legend + ' : ' + this.os.cpu + '%';

            let memOption = this.state.memOption;
            let memData = memOption.series[0].data;
            if(memData.length > this.count-1){
                memData.shift();
                memOption.xAxis[0].data.shift();
            }
            memData.push(this.os.memory);
            memOption.xAxis[0].data.push(time1);
            memOption.title.text = memOption.title.legend + ' : ' + this.os.memory + 'MB';

            let loadOption = this.state.loadOption;
            let loadData = loadOption.series[0].data;
            if(loadData.length > this.count-1){
                loadData.shift();
                loadOption.xAxis[0].data.shift();
            }
            loadData.push(this.os.load);
            loadOption.xAxis[0].data.push(time1);
            loadOption.title.text = loadOption.title.legend + ' : ' + this.os.load;

            const time2 = new Date(this.res.timestamp).toLocaleTimeString().replace(/^\D*/,'');

            let resOption = this.state.resOption;
            let resData = resOption.series[0].data;
            if(resData.length > this.count-1){
                resData.shift();
                resOption.xAxis[0].data.shift();
            }
            resData.push(this.res.mean);
            resOption.xAxis[0].data.push(time2);
            resOption.title.text = resOption.title.legend + ' : ' + this.res.mean + 'ms';

            let rpsOption = this.state.rpsOption;
            let rpsData = rpsOption.series[0].data;
            if(rpsData.length > this.count-1){
                rpsData.shift();
                rpsOption.xAxis[0].data.shift();
            }

            let deltaTime = this.res.timestamp - lastResTimeStamp;
            if(deltaTime > 0){
                let rps = Math.round(this.res.count/deltaTime*1e6)/1000
                rpsData.push(rps);
                rpsOption.xAxis[0].data.push(time2);
                rpsOption.title.text = rpsOption.title.legend + ' : ' + rps;
            }
            lastResTimeStamp = this.res.timestamp

            this.setState({
                errorOption: cpuOption,
                memOption: memOption,
                loadOption: loadOption,
                resOption: resOption,
                rpsOption: rpsOption
            });

        }, 1e3)
    };

    clearChart(){
        Object.keys(this.state).forEach((key)=>{
            if(key.indexOf('Option') != -1){
                let item = this.state[key]
                item.series[0].data = [];
                item.xAxis[0].data = [];
                item.title.text = item.title.legend + ' : ';

                this.setState({key, item});
            }
        });
    }

    startMonite(index) {
        //os = [];
        const nodeId = this.state.nodeClients[index].id;
        this.socket.removeAllListeners();
        this.dataInterval && clearInterval(this.dataInterval);
        this.clearChart();

        this.socket.on('start', (data)=> {
            if (data) {
                this.data = data;
                this.socket.emit("stats");
                this.drawChart();
            } else {
                //alert('暂无数据');
            }
        });

        this.socket.on('stats', (data)=> {
            if (!this.data[defaultSpan])return;
            if (data && data.retention === this.data[defaultSpan].retention && data.interval === this.data[defaultSpan].interval) {
                //if (this.data[defaultSpan].retention < this.os.length) {
                //    this.os.shift();
                //}
                //this.os.push(data.os.cpu);
                this.os.cpu = data.os.cpu;
                this.os.timestamp = data.os.timestamp;
                this.os.memory = data.os.memory;
                this.os.load = data.os.load[0];

                this.res.mean = data.responses.mean;
                this.res.count = data.responses.count;
                this.res.timestamp = data.responses.timestamp;
            }
        });

        this.socket.emit("init", nodeId);

    }

    getUserNode = (callback)=>{
        node.getUserNode(null, (err, data)=>{
            if(data.status == "success" && data.nodeClients && data.nodeClients.rows){
                callback(data.nodeClients.rows);
            }
        })
    };

    componentWillMount(){
    }

    componentDidMount(){
        this.getUserNode((clients)=>{
            this.setState({nodeClients: clients}, ()=>{
                this.startMonite(0);
            });
        });
    }

    componentWillUnmount() {
        if (this.dataInterval) {
            clearInterval(this.dataInterval);
        }
    }

    render(){
        const {classes, user} = this.props;

        return(
            <div className={classes.appContent}>
                {/*<div id="span-controls" className={classes.spanControl}></div>*/}
                <AppSelect
                    title="Node"
                    dataList={this.state.nodeClients}
                    selectedCallback={this.startMonite.bind(this)}
                />
                <div className={classes.container}>
                    <div className={classes.item}>
                        <ReactEcharts
                            ref='echarts_react'
                            option={this.state.errorOption}
                        />
                    </div>
                    <div className={classes.item}>
                        <ReactEcharts
                            ref='echarts_react'
                            option={this.state.memOption}
                        />
                    </div>
                    <div className={classes.item}>
                        <ReactEcharts
                            ref='echarts_react'
                            option={this.state.loadOption}
                        />
                    </div>
                    <div className={classes.item}>
                        <ReactEcharts
                            ref='echarts_react'
                            option={this.state.resOption}
                        />
                    </div>
                    <div className={classes.item}>
                        <ReactEcharts
                            ref='echarts_react'
                            option={this.state.rpsOption}
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

export default compose(withStyles(styleSheet), connect(mapStateToProps))(NodeDashboard);