/**
 * Created by lenovo on 2017/9/28.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';

const styleSheet = theme => ({
    select: {
        position: 'relative',
        width: '250px',
        background: theme.palette.background.contentFrame
    },
});


class AppSelect extends Component{
    constructor(){
        super();
        this.state = {
            menuOpen: false,
            selectedIndex: 0
        }
    }

    handleClickList = event => {
        this.setState({menuOpen: true, anchorEl: event.currentTarget });
    };

    handleClickItem = (event, index)=> {
        const {selectedCallback} = this.props;
        this.setState({menuOpen: false, selectedIndex: index}, ()=>{
            selectedCallback(this.state.selectedIndex);
        });
    };

    handleRequestClose = () => {
        this.setState({ menuOpen: false });
    };

    render(){
        const {classes, title, dataList} = this.props;

        return (
            <div className={classes.select}>
                <List>
                    <ListItem
                        button
                        aria-haspopup="true"
                        aria-controls="lock-menu"
                        aria-label="When device is locked"
                        onClick={this.handleClickList}
                    >
                        <ListItemText
                            primary={`${title}: ${dataList? dataList[this.state.selectedIndex].name: "\\"}`}
                        />
                    </ListItem>
                </List>
                {/*<Button*/}
                    {/*aria-owns={this.state.open ? 'simple-menu' : null}*/}
                    {/*aria-haspopup="true"*/}
                    {/*aria-controls="lock-menu"*/}
                    {/*onClick={this.handleClickList}*/}
                {/*>*/}
                    {/*{`${title}: ${dataList[this.state.selectedIndex].name || "\\"}`}*/}
                {/*</Button>*/}
                <Menu
                    id="lock-menu"
                    anchorEl={this.state.anchorEl}
                    open={this.state.menuOpen}
                    onRequestClose={this.handleRequestClose}
                    PaperProps={{
                        style: {
                            marginLeft: (title.length*10 + 16) + "px"
                        },
                    }}
                >
                    {dataList? dataList.map((option, index) =>
                            <MenuItem
                                key={option.id}
                                selected={index === this.state.selectedIndex}
                                onClick={event => this.handleClickItem(event, index)}
                            >
                                {option.name}
                            </MenuItem>,
                        ): void(0)}
                </Menu>
            </div>
        );
    }
}


export default withStyles(styleSheet)(AppSelect);