/**
 * Created by lenovo on 2017/8/2.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import Menu, {MenuItem} from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import MailIcon from 'material-ui-icons/Mail';
import NotifyIcon from 'material-ui-icons/Notifications';
import AccountIcon from 'material-ui-icons/AccountCircle';

import user from '../engine/user';
import {userLogout} from '../redux/actions/user'

const styleSheet = theme => ({
    badge: {
        margin: `0 ${theme.spacing.unit * 2}px`,
    },
    count: {
        marginLeft: `${theme.spacing.unit * 3}px`,
        marginRight: `${theme.spacing.unit}px`
    }
});


class AppBadge extends Component {
    constructor() {
        super();
        this.state = {
            avatorOpen: false,
            anchorEl: undefined,

            notifyOpen: false,
            notifyCount: 23,
            notifyNodeCount: 11,
            notifyWebCount: 12
        }
    }

    handleChange = (name, value) => event => {
        this.setState({[name]: value});
    };

    handleRequestOpen = name => event => {
        this.setState({[name]: true, anchorEl: event.currentTarget});
    };

    handleRequestClose = ()=> {
        this.setState({avatorOpen: false});
    };

    logout = ()=> {
        user.logout(null, (err, data)=>{

            //if(data.status == "success"){
                this.props.actions.userLogout();
                //this.handleRequestClose();
                browserHistory.push('/');
            //}
        })
    };

    getNotify = ()=>{
        user.getNotify((err, data)=>{
            if(data && data.status == "success"){
                let result = data.result;
                this.setState({
                    notifyNodeCount: result.node,
                    notifyWebCount: result.web,
                    notifyCount: result.node + result.web
                });
            }
        })
    };

    componentWillMount(){
        //this.getNotify()
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                {/*{*/}
                    {/*this.state.notifyCount != 0?*/}
                        {/*<Badge className={classes.badge} badgeContent={this.state.notifyCount} color="accent" onClick={this.handleRequestOpen('notifyOpen')}>*/}
                            {/*<NotifyIcon />*/}
                        {/*</Badge> : null*/}
                {/*}*/}
                {/*<Badge className={classes.badge} badgeContent={1} color="accent">*/}
                    {/*<MailIcon />*/}
                {/*</Badge>*/}
                <IconButton color="contrast" aria-label="Avator" onClick={this.handleRequestOpen('avatorOpen')}>
                    <AccountIcon />
                </IconButton>

                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={this.state.avatorOpen}
                    onRequestClose={this.handleChange("avatorOpen", false)}
                >
                    <MenuItem>My account</MenuItem>
                    <MenuItem onClick={this.logout}>Logout</MenuItem>
                </Menu>

                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={this.state.notifyOpen}
                    onRequestClose={this.handleChange("notifyOpen", false)}
                >
                    <MenuItem>
                        <span>Node Error</span>
                        <Badge className={classes.count} badgeContent={this.state.notifyNodeCount} color="accent"></Badge>
                    </MenuItem>
                    <MenuItem>
                        <span>Web Error</span>
                        <Badge className={classes.count} badgeContent={this.state.notifyWebCount} color="accent"></Badge>
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}
;

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators({userLogout}, dispatch)};
};

export default compose(withStyles(styleSheet), connect(mapStateToProps, mapDispatchToProps))(AppBadge);