/**
 * Created by lenovo on 2017/8/16.
 */
import React, {Component} from 'react';
import {createUltimatePagination, ITEM_TYPES} from 'react-ultimate-pagination';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import NavigationFirstPage from 'material-ui-icons/FirstPage';
import NavigationLastPage from 'material-ui-icons/LastPage';
import NavigationChevronLeft from 'material-ui-icons/ChevronLeft';
import NavigationChevronRight from 'material-ui-icons/ChevronRight';

const styleSheet = theme => ({
    pagination: {
        position: 'relative',
        display: 'inline-block',
        float: 'right',
        paddingRight: '25px',
        paddingTop: '15px',
    },
    button: {
        minWidth: 36,
        padding: '0px',
        float: 'left'
    }
});


class AppPagination extends Component {
    constructor(){
        super()
    }

    render(){
        const {classes, currentPage, totalPages, boundaryPagesRange, siblingPagesRange, onChange} = this.props;

        const Page = ({value, isActive, onClick}) => (
            <Button className={classes.button} color={isActive? "primary": "default"} onClick={onClick}>
                {value.toString()}
            </Button>
        );

        const Ellipsis = ({onClick}) => (
            <Button className={classes.button}  onClick={onClick}>
                ...
            </Button>
        );

        const FirstPageLink = ({isActive, onClick}) => (
            <Button className={classes.button} onClick={onClick}>
                <NavigationFirstPage />
            </Button>
        );

        const PreviousPageLink = ({isActive, onClick}) => (
            <Button className={classes.button} onClick={onClick}>
                <NavigationChevronLeft />
            </Button>
        );

        const NextPageLink = ({isActive, onClick}) => (
            <Button className={classes.button} onClick={onClick} >
                <NavigationChevronRight />
            </Button>
        );

        const LastPageLink = ({isActive, onClick}) => (
            <Button className={classes.button} onClick={onClick} >
                <NavigationLastPage />
            </Button>
        );

        const itemTypeToComponent = {
            [ITEM_TYPES.PAGE]: Page,
            [ITEM_TYPES.ELLIPSIS]: Ellipsis,
            [ITEM_TYPES.FIRST_PAGE_LINK]: FirstPageLink,
            [ITEM_TYPES.PREVIOUS_PAGE_LINK]: PreviousPageLink,
            [ITEM_TYPES.NEXT_PAGE_LINK]: NextPageLink,
            [ITEM_TYPES.LAST_PAGE_LINK]: LastPageLink
        };

        const UltimatePaginationMaterialUi = createUltimatePagination({itemTypeToComponent});
        
        return (
            <div className={classes.pagination}>
                <UltimatePaginationMaterialUi
                    currentPage={currentPage}
                    totalPages={totalPages}
                    boundaryPagesRange={boundaryPagesRange}
                    siblingPagesRange={siblingPagesRange}
                    onChange={onChange}
                />
            </div>
        );
    }
}


export default compose(withStyles(styleSheet))(AppPagination);