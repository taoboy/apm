/**
 * Created by lenovo on 2017/7/24.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import withWidth, { isWidthUp } from 'material-ui/utils/withWidth';

import AppDrawer from '../components/AppDrawer';
import AppLogin from '../components/AppLogin';
import AppBadge from './AppBadge';


function getTitle(routes) {
    for (let i = routes.length - 1; i >= 0; i -= 1) {
        if (routes[i].hasOwnProperty('title')) {
            return routes[i].title;
        }
    }
    return null;
}

const styleSheet = theme => ({
    '@global': {
        html: {
            boxSizing: 'border-box',
        },
        '*, *:before, *:after': {
            boxSizing: 'inherit',
        },
        body: {
            margin: 0,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            lineHeight: '1.2',
            overflowX: 'hidden',
            WebkitFontSmoothing: 'antialiased', // Antialiasing.
            MozOsxFontSmoothing: 'grayscale', // Antialiasing.
        },
        img: {
            maxWidth: '100%',
            height: 'auto',
            width: 'auto',
        },
    },
    appFrame: {
        display: 'flex',
        alignItems: 'stretch',
        minHeight: '100vh',
        width: '100%',
        //background: 'url("/img/greenish.jpg") no-repeat',
        //backgroundSize: '100% 100%',
    },
    grow: {
        flex: '1 1 auto',
    },
    title: {
        marginLeft: 0,
        flex: '0 1 auto',
    },
    appBar: {
        transition: theme.transitions.create('width'),
    },
    appBarHome: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
    },
    [theme.breakpoints.up('lg')]: {
        drawer: {
            width: '200px',
        },
        appBarShift: {
            width: 'calc(100% - 200px)',
        },
    },
    navIconHide: {
        display: 'none',
    },
    navIconDisplay: {
        display: 'block'
    },
    appContent: {
        width: "100%",
        paddingTop: '64px',
        [theme.breakpoints.up('lg')]: {
            width: 'calc(100% - 200px)',
        },
    }
});


class AppFrame extends Component {
    constructor(){
        super();
        this.state = {
            loginOpen: false,
            drawerOpen: false
        };
    }

    handleDrawerClose = () => {
        this.setState({ drawerOpen: false });
    };

    handleDrawerToggle = () => {
        this.setState({ drawerOpen: !this.state.drawerOpen });
    };

    handleLoginClose = ()=>{
        this.setState({ loginOpen: false });
    };


    render(){
        const { children, routes, width, classes } = this.props;
        const { user } = this.props;

        let screenOverLg = isWidthUp('lg', width), mobileOpen = false, disablePermanent = false;
        let navIconClassName = classes.navIconHide;
        let appBarClassName = classes.appBar;
        let title = getTitle(routes);
        let online = user && user.id;


        if(online){
            mobileOpen = this.state.drawerOpen;
            if(title){
                if(screenOverLg){
                    appBarClassName += ` ${classes.appBarShift}`;
                } else {
                    disablePermanent = true;
                    navIconClassName = ` ${classes.navIconDisplay}`;
                }
            } else {
                appBarClassName += ` ${classes.appBarHome}`;
                navIconClassName = ` ${classes.navIconDisplay}`;
                if(screenOverLg){
                    disablePermanent = true;
                }
            }
        } else {
            mobileOpen = false;
            disablePermanent = true;
            appBarClassName += ` ${classes.appBarHome}`;
        }


        return (
            <div className={classes.appFrame}>
                <AppBar className={`${appBarClassName}`}>
                    <Toolbar>
                        <IconButton color="contrast" aria-label="Menu" onClick={this.handleDrawerToggle} className={navIconClassName}>
                            <MenuIcon />
                        </IconButton>
                        {title !== null &&
                        <Typography className={classes.title} type="title" color="inherit" noWrap>
                            {title}
                        </Typography>}
                        <div className={classes.grow} />
                        {/*<AppSearch />*/}
                        {
                            online?
                                <AppBadge />
                                :
                                <Button color="contrast" onClick={()=> this.setState({loginOpen: true})}>
                                    Login
                                </Button>
                        }
                    </Toolbar>
                </AppBar>
                <AppDrawer
                    className={classes.drawer}
                    routes={routes}
                    onRequestClose={this.handleDrawerClose}
                    open={mobileOpen}
                    disablePermanent={disablePermanent}
                />
                <AppLogin
                    open = {this.state.loginOpen}
                    onRequestClose = {this.handleLoginClose}
                />
                {title?
                    <div className={classes.appContent}>
                        {children}
                    </div>
                    :
                    children
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
};



export default compose(withStyles(styleSheet), withWidth(), connect(mapStateToProps))(AppFrame);