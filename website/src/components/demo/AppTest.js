/**
 * Created by lenovo on 2017/9/28.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import AppSelect from '../AppSelect'


const styleSheet = theme => ({
    appContent: {
        [theme.breakpoints.up('lg')]: {
            width: 'calc(100% - 200px)',
        },

        width: '100%',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '90px',
        //flex: '1 1 100%',
        margin: '0 auto'
    }
});

const clients = [
    {
        "id": "123545e0-8df3-11e7-b279-3f795acce1b2",
        "appid": "qKzebaqK5C",
        "name": "yyexch",
        "struct": "koa2",
        "version": "v7.8.0",
        "disable": false,
        "time": "2017-08-30T18:21:18.000Z",
        "user_id": "9506a440-8c8c-11e7-9a64-456ebaf6c00b"
    },
    {
        "id": "2261ddb0-8e26-11e7-9b1a-6b6211810925",
        "appid": "XCv1TPy0nb",
        "name": "eee",
        "struct": "koa2",
        "version": null,
        "disable": false,
        "time": "2017-08-31T00:26:49.000Z",
        "user_id": "9506a440-8c8c-11e7-9a64-456ebaf6c00b"
    },
    {
        "id": "a6276840-8c8c-11e7-9a64-456ebaf6c00b",
        "appid": "u1nbaGOyeH",
        "name": "yyfaxgroup",
        "struct": "koa2",
        "version": "v7.8.0",
        "disable": false,
        "time": "2017-08-28T23:35:36.000Z",
        "user_id": "9506a440-8c8c-11e7-9a64-456ebaf6c00b"
    }
];

class AppTest extends Component {
    constructor(){
        super()
    }

    handleMenuItemClick = index=>{
        console.log(index);
    };

    render(){

        const {classes} = this.props;
        return (
            <div className={classes.appContent}>
                <div>
                    <span>select</span>
                    <AppSelect title={'Node'} dataList={clients} selectedCallback={this.handleMenuItemClick}/>
                </div>
            </div>

        );
    }
}

export default withStyles(styleSheet)(AppTest);