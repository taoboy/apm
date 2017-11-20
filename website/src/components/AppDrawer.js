import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Hidden from 'material-ui/Hidden';

import Link from './AppLink';
import AppDrawerNavItem from './AppDrawerNavItem';


//import InboxIcon from 'material-ui-icons/Inbox';
//import DraftsIcon from 'material-ui-icons/Drafts';
//import StarIcon from 'material-ui-icons/Star';
//import SendIcon from 'material-ui-icons/Send';
//import MailIcon from 'material-ui-icons/Mail';
//import DeleteIcon from 'material-ui-icons/Delete';
//import ReportIcon from 'material-ui-icons/Report';
//



const styleSheet = theme => ({
    nav: {
        width: "200px"
    },
    list: {
        width: '200px',
        flex: 'initial',
    },
    listFull: {
        width: 'auto',
        flex: 'initial',
    },
    paper: {
        width: 200,
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        color: theme.palette.text.primary,
        '&:hover': {
            color: theme.palette.primary[500],
        },
    },
    toolbar: {
        //textAlign: 'center',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    anchor: {
        color: theme.palette.text.secondary,
    },
});

function reduceChildRoutes(props, items, childRoute, index) {
    if (childRoute.nav) {
        if (childRoute.childRoutes && childRoute.childRoutes.length) {
            const openImmediately = props.routes.indexOf(childRoute) !== -1 || false;
            items.push(
                <AppDrawerNavItem key={index} openImmediately={openImmediately} title={childRoute.title}>
                    {renderNavItems(props, childRoute)}
                </AppDrawerNavItem>,
            );
        } else {
            items.push(
                <AppDrawerNavItem
                    key={index}
                    title={childRoute.title}
                    to={childRoute.path}
                    onClick={props.onRequestClose}
                />,
            );
        }
    }
    //if (childRoute.nav) {
    //    items.push(
    //        <AppDrawerNavItem key={index} onClick={props.onRequestClose} title={childRoute.title} to={childRoute.path} />
    //    );
    //}
    return items;
}

function renderNavItems(props, navRoot) {
    let navItems = null;

    if (navRoot.childRoutes && navRoot.childRoutes.length) {
        // eslint-disable-next-line no-use-before-define
        navItems = navRoot.childRoutes.reduce(reduceChildRoutes.bind(null, props), []);
    }

    return (
        <List>
            {navItems}
        </List>
    );
}

class DockedDrawer extends Component {

    constructor(props){
        super(props);
    }

    render(){
        const { routes, classes, className, open, onRequestClose, disablePermanent} = this.props;

        const drawer = (
            <div >
                <Toolbar className={classes.toolbar}>
                    <Link className={classes.title} to="/" onClick={onRequestClose}>
                        <Typography type="subheading" gutterBottom color="inherit">
                            YYFAX-APM
                        </Typography>
                    </Link>
                    <Link className={classes.anchor}>
                        <Typography type="caption">
                            v{`1.0.0_20171116_master`}
                        </Typography>
                    </Link>
                    <Divider absolute />
                </Toolbar>
                {renderNavItems(this.props, routes[0])}
            </div>
        );

        return (
            <div className={className}>
                <Hidden lgUp={!disablePermanent}>
                    <Drawer
                        type="temporary"
                        classes={{
                            paper: classes.paper,
                        }}
                        open = {open}
                        onRequestClose={onRequestClose}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                {disablePermanent ? null : (
                    <Hidden lgDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.paper,
                            }}
                            type="permanent"
                            open = {open}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                )}
            </div>

        )
    }
}

DockedDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(DockedDrawer);