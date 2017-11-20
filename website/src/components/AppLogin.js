/**
 * Created by lenovo on 2017/7/31.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router';
import compose from 'recompose/compose';
import {withStyles} from 'material-ui/styles';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Input, {InputLabel} from 'material-ui/Input';
import {FormControl, FormHelperText} from 'material-ui/Form';

import user from '../engine/user';
import {userLogin} from '../redux/actions/user'

const styleSheet = theme => ({
    textField: {
        margin: theme.spacing.unit,
        //marginLeft: theme.spacing.unit,
        //marginRight: theme.spacing.unit,
        display: "block",
        width: 200,
    },
});

class AppLogin extends Component {
    constructor() {
        super();
        this.state = {  //先声明变量并初始化
            name: '',
            password: '',
            error: null
        }
    }

    login = () => {

        const {onRequestClose} = this.props;
        user.login({
            username: this.state.name,
            password: this.state.password
        }, (err, data) => {
            if (err)return alert("login failed");

            if (data.status == "success") {
                this.props.actions.userLogin(data.user);
                onRequestClose();
                browserHistory.push('/task/myNode');
                this.setState({
                    error: null
                })
            } else {
                this.setState({
                    error: data.msg
                })
            }
        })
    };

    handleKeyDown = (event) => { //按下enter键，触发login事件
        switch (event.keyCode) {
            case 13:
                this.login();
                break;
        }
    };

    handleChange = name => (event) => {
        //event.persist();
        this.setState({[name]: event.target.value})
    };

    componentDidMount() {//组件渲染完成之后触发此函数
        window.addEventListener('keydown', this.handleKeyDown)
    }

    render() { //
        const {classes, open, onRequestClose} = this.props;

        return (
            <Dialog open={open} onRequestClose={onRequestClose}>
                <DialogTitle>
                    {"Login"}
                </DialogTitle>
                <DialogContent>
                    {/*<DialogContentText>*/}
                    {/*Let Google help apps determine location. This means sending anonymous location data to*/}
                    {/*Google, even when no apps are running.*/}
                    {/*</DialogContentText>*/}
                    <TextField
                        id="name"
                        label="Name"
                        className={classes.textField}
                        value={this.state.name}
                        onChange={this.handleChange("name")}
                    />
                    {/*<TextField*/}
                    {/*id="password"*/}
                    {/*label="Password"*/}
                    {/*className={classes.textField}*/}
                    {/*type="password"*/}
                    {/*autoComplete="current-password"*/}
                    {/*onChange={event => this.setState({ password: event.target.value })}*/}
                    {/*/>*/}
                    <FormControl className={classes.textField}>
                        <InputLabel htmlFor="Password">Password</InputLabel>
                        <Input id="password" type="password" value={this.state.password}
                               onChange={this.handleChange("password")}/>
                        {
                            this.state.error ?
                                <FormHelperText error>{this.state.error}</FormHelperText>
                                : null
                        }
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.login} color="primary">
                        OK
                    </Button>
                    <Button onClick={onRequestClose} color="default">
                        CANCEL
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators({userLogin}, dispatch)};
};

export default compose(withStyles(styleSheet), connect(mapStateToProps, mapDispatchToProps))(AppLogin);