/**
 * Created by lenovo on 2017/7/20.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Link from 'react-router/lib/Link';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styleSheet = theme => {
    return {
        root: {
            flex: '1 0 100%',
            minHeight: '100vh', // Makes the hero full height until we get some more content.
            //flex: '0 0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.primary[500],
            background: 'url("/img/ocean.jpg") no-repeat',
            backgroundSize: '100% 100%',
            color: theme.palette.getContrastText(theme.palette.primary[500]),
        },
        content: {
            padding: '60px 30px',
            textAlign: 'center',
            [theme.breakpoints.up('sm')]: {
                padding: '120px 30px',
            },
        },
        button: {
            marginTop: 20,
        },
        logo: {
            margin: '20px -40%',
            width: '100%',
            height: '40vw',
            maxHeight: 230,
        },
    };
};

class AppHome extends Component {
    constructor(){
        super();
    }


    render(){
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                <div className={classes.hero}>
                    <div className={classes.content}>
                        {/*<img src={muiLogo} alt="Material-UI Logo" className={classes.logo} />*/}
                        <Typography type="headline" component="h1" color="inherit">
                            {'YYFAX-APM'}
                        </Typography>
                        <Typography type="subheading" component="h2" color="inherit">
                            {/*{"友金所前端系统性能监控平台"}*/}
                            {"Front Application Performance Management System"}
                        </Typography>
                        {/*<Button*/}
                            {/*component={Link}*/}
                            {/*className={classes.button}*/}
                            {/*raised*/}
                            {/*to="/node"*/}
                        {/*>*/}
                            {/*{'DEMO'}*/}
                        {/*</Button>*/}
                    </div>
                </div>
            </div>
        );
    }
}


AppHome.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styleSheet)(AppHome);