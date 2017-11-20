import React,{Component} from 'react';
import compose from 'recompose/compose';
import Table,{ TableBody,TableCell,TableHead,TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import browser from '../engine/browser';


function parseTime(time) {
    const ctime = new Date(time);
    return ctime.getFullYear() + "/" + (ctime.getMonth() + 1) + "/" + ctime.getDate() + " " + (ctime.getHours() - 8) + ":" + ctime.getMinutes() + ":" + ctime.getSeconds();
}


const styleSheet = theme => ({
    section: {
        width: '100%',
    },
    summary: {

    },
    paper: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
    }),
    root: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        width: '70%',
    }
});

class BrowserException extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: null,
            tableData: null,
            tableDataCount: 1,
        };
        this.exceptionId = this.props.params.id;
    }


    broexception = () => {

        browser.broExceptionDetail({
            id: this.exceptionId
            //id: '4756ca80-c83d-11e7-a82f-17cfd6c4a713'
        }, (err, data) => {
            if (err) return alert("数据加载失败");

            if (data.status == "success" && data.webExceptionDetail) {
                this.setState({
                    detail: data.webExceptionDetail
                });
            }
        })
    };


    componentWillMount() {//组件渲染完成之前触发此函数
        this.broexception();
    };

    render() {
        const { classes, open } = this.props;
        const loggers = this.state.detail ? this.state.detail.web_loggers: null;
        return (
            <div className={classes.section}>
                <Paper open={open} className={classes.paper}  elevation={1}>
                    <Typography type="title" component="h3">
                        {this.state.detail ? this.state.detail.exception_msg: null}
                    </Typography>
                    <Typography type="body2" component="p">
                        exception_url: {this.state.detail ? this.state.detail.exception_url: null}
                    </Typography>
                    <Typography type="body2" component="p">
                        exception_line: {this.state.detail ? this.state.detail.exception_line: null}
                    </Typography>
                    <Typography type="body2" component="p">
                        exception_col: {this.state.detail ? this.state.detail.exception_col: null}
                    </Typography>
                    <Typography type="body2" component="p">
                        exception_stack: {this.state.detail ? this.state.detail.exception_stack: null}
                    </Typography>
                    <Typography type="body2" component="p">
                        client_time: {this.state.detail ? parseTime(this.state.detail.client_time): null}
                    </Typography>
                    <Typography type="body2" component="p">
                        user_agent: {this.state.detail ? this.state.detail.user_agent: null}
                    </Typography>
                    <Typography type="body2" component="p">
                        location_href: {this.state.detail ? this.state.detail.location_href: null}
                    </Typography>
                    <Typography type="body2" component="p">
                        geolocation: {this.state.detail ? (this.state.detail.geolocation_province + "/" + this.state.detail.geolocation_city): null}
                    </Typography>
                    <Typography type="body2" component="p">
                        client_OS: {this.state.detail ? this.state.detail.client_OS: null}
                    </Typography>
                    <Typography type="body2" component="p">
                        client_mobile: {this.state.detail ? this.state.detail.client_mobile: null}
                    </Typography>
                    <Typography type="body2" component="p">
                        client_name: {this.state.detail ? this.state.detail.client_name: null}
                    </Typography>
                    <Typography type="body2" component="p">
                        client_version: {this.state.detail ? this.state.detail.client_version: null}
                    </Typography>
                </Paper>
                <Paper open={open} className={classes.paper}  elevation={1}>
                    <Typography type="headline" component="h3">
                        Log
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell >#</TableCell>
                                <TableCell >Time</TableCell>
                                <TableCell >Type</TableCell>
                                <TableCell >Info</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.detail && this.state.detail.web_loggers && this.state.detail.web_loggers.map((n, i) => {
                                const ctime = new Date(n.client_time);
                                const stime = new Date(n.server_time);
                                const cli_time = ctime.getFullYear() + "/" + (ctime.getMonth() + 1) + "/" + ctime.getDate() + " " + (ctime.getHours() - 8) + ":" + ctime.getMinutes() + ":" + ctime.getSeconds();
                                const ser_time = stime.getFullYear() + "/" + (stime.getMonth() + 1) + "/" + stime.getDate() + " " + (stime.getHours() - 8) + ":" + stime.getMinutes() + ":" + stime.getSeconds();
                                return (
                                    <TableRow
                                        key={n.id}>
                                        <TableCell>
                                            {i}
                                        </TableCell>
                                        <TableCell>
                                            {cli_time}
                                        </TableCell>
                                        <TableCell>
                                            {n.type}
                                        </TableCell>
                                        <TableCell>
                                            {JSON.stringify(n.info)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>

            </div>
        );
    }

}
export default compose(withStyles(styleSheet))(BrowserException);


