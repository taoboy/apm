// @flow

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import classNames from 'classnames';
import {withStyles} from 'material-ui/styles';
import Button from 'material-ui/Button';
import Collapse from 'material-ui/transitions/Collapse';

import grey from 'material-ui/colors/grey';

import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import InboxIcon from 'material-ui-icons/Inbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import StarIcon from 'material-ui-icons/Star';
import SendIcon from 'material-ui-icons/Send';
import MailIcon from 'material-ui-icons/Mail';
import DeleteIcon from 'material-ui-icons/Delete';
import ReportIcon from 'material-ui-icons/Report';

import ViewList from 'material-ui-icons/ViewList';
import Share from 'material-ui-icons/Share';
import Camera from 'material-ui-icons/Camera';
import Data from 'material-ui-icons/DataUsage';

const icons = {
    Task: ViewList,
    Node: Share,
    Browser: Camera,
    Analysis: Data
};

const styleSheet = theme => ({
    button: theme.mixins.gutters({
        borderRadius: 0,
        justifyContent: 'flex-start',
        textTransform: 'none',
        width: '100%',
        transition: theme.transitions.create('background-color', {
            duration: theme.transitions.duration.shortest,
        }),
        '&:hover': {
            textDecoration: 'none',
        },
    }),
    icon: {
        fill: grey[700]
    },
    navItem: {
        ...theme.typography.body2,
        display: 'block',
        paddingTop: 0,
        paddingBottom: 0,
    },
    navLink: {
        fontWeight: theme.typography.fontWeightRegular,
        display: 'flex',
        paddingTop: 0,
        paddingBottom: 0,
    },
    navLinkButton: {
        color: theme.palette.text.secondary,
        textIndent: 34,
        fontSize: 13,
    },
    activeButton: {
        color: theme.palette.text.primary,
    },
});

class AppDrawerNavItem extends Component {
    static defaultProps = {
        openImmediately: false,
    };

    state = {
        open: false,
    };

    componentWillMount() {
        if (this.props.openImmediately) {
            this.setState({open: true});
        }
    }

    handleClick = () => {
        this.setState({open: !this.state.open});
    };

    render() {
        const {children, classes, title, to, openImmediately} = this.props;

        if (to) {
            return (
                <ListItem className={classes.navLink} disableGutters>
                    <Button
                        component={Link}
                        to={to}
                        className={classNames(classes.button, classes.navLinkButton)}
                        disableRipple
                        activeClassName={classes.activeButton}
                        onClick={this.props.onClick}
                    >
                        {title}
                    </Button>
                </ListItem>
            );
            //return (
            //    <ListItem className={classes.navLink} disableGutters>
            //        <Button
            //            component={Link}
            //            to={to}
            //            className={classNames(classes.button, classes.navLinkButton)}
            //            activeClassName={classes.activeButton}
            //            onClick={this.props.onClick}
            //        >
            //            {title}
            //        </Button>
            //    </ListItem>
            //);
        }

        let MenuIcon = icons[title] || InboxIcon;

        return (
            <ListItem className={classes.navItem} disableGutters>
                <Button
                    classes={{
                        root: classes.button,
                        label: openImmediately ? 'algolia-lvl0' : '',
                    }}
                    onClick={this.handleClick}
                >

                    <MenuIcon style={{marginRight: '10px'}} className={classes.icon} />
                    {title}
                </Button>
                <Collapse in={this.state.open} transitionDuration="auto" unmountOnExit>
                    {children}
                </Collapse>
            </ListItem>
        );
    }
}

AppDrawerNavItem.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    openImmediately: PropTypes.bool,
    title: PropTypes.string.isRequired,
    to: PropTypes.string,
};

export default withStyles(styleSheet)(AppDrawerNavItem);
