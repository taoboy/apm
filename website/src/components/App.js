/**
 * Created by lenovo on 2017/7/24.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiThemeProvider, { MUI_SHEET_ORDER } from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from 'material-ui/styles';
import {blue, pink, indigo} from 'material-ui/colors';

import initRouter from '../router/index'


export default function(store) {

    const Router = initRouter(store);

    function App (props){

        const { dark } = props;

        const theme = createMuiTheme({
            palette: {
                primary: blue,
                secondary: pink,
                type: dark ? 'dark' : 'light',
            },
        });
        return (
            <MuiThemeProvider theme={theme}>
                <Router />
            </MuiThemeProvider>
        );

    }


    return connect(state => ({ dark: state.dark }))(App);
}


