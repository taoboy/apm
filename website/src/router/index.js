import React from 'react';
import { applyRouterMiddleware, browserHistory, Router, Route, IndexRoute } from 'react-router';
import { useScroll } from 'react-router-scroll';

import AppFrame from '../components/AppFrame'
import AppHome from '../components/AppHome'
//import NodeAnalysis from '../components/NodeAnalysis'

import NodeTask from '../components/NodeTask'
import NodeError from '../components/NodeError'
import NodeException from '../components/NodeException'
import NodeAnalysis from '../components/NodeAnalysis'

import BrowserTask from '../components/BrowserTask'
import BrowserDashboard from '../components/BrowserDashboard'
import BrowserException from '../components/BrowserException'
import BrowserExceptionDetail from '../components/BrowserExceptionDetail'
import BrowserBusiness from '../components/BrowserBusiness'
import BrowserEntries from '../components/BrowserEntries'
//import BrowserEchart from '../components/BrowserEchart'
import BrowserMap from '../components/demo/BrowserMap'
//import BrowserDynamic from '../components/BrowserDynamic'
import BrowserAnalysis from '../components/BrowserAnalysis'

import AppTest from '../components/demo/AppTest'

import user from '../engine/user';


export default function(store) {


    function enterCheck(nextState, replace, callback) {
        user.checkLogin((err, data)=>{
            if(data && data.status == "success"){
                store.dispatch({type: "USER_LOGIN", content: data.user});
            } else {
                store.dispatch({type: "USER_LOGOUT"});
                if(nextState.location.pathname != "/")replace({pathname: "/"});
            }
            callback();
        });
    }

    function changeCheck(preState, nextState, replace, callback) {

        user.checkLogin((err, data)=>{
            if(data && data.status == "success"){
                store.dispatch({type: "USER_LOGIN", content: data.user});
            } else {
                store.dispatch({type: "USER_LOGOUT"});
            }
            callback();
        });
    }

    const rootRoute = {
        path: '/',
        title: 'Node.js Monitor',
        component: AppFrame,
        onEnter: enterCheck,
        indexRoute: {
            title: null,
            component: AppHome,
            //onEnter: enterCheck
        },
        childRoutes: [
            {
                path: "/task",
                title: "Task",
                nav: true,
                childRoutes: [
                    //{
                    //    path: "/task/myNode",
                    //    title: 'Node Task',
                    //    nav: true,
                    //    component: NodeTask,
                    //},
                    {
                        path: "/task/myBrowser",
                        title: 'Browser Task',
                        nav: true,
                        component: BrowserTask,
                    },
                ]
            },
            //{
            //    path: "/node",
            //    title: "Node",
            //    nav: true,
            //    childRoutes: [
            //        // 按需加载
            //        {
            //            path: '/node/performance',
            //            title: 'Live Performance',
            //            nav: true,
            //            getComponent(nextState, cb) {
            //                require.ensure([], (require) => {
            //                    cb(null, require('../components/NodeDashboard').default)
            //                }, 'vendor');
            //            }
            //        },
            //        {
            //            path: "/node/error",
            //            title: 'Error',
            //            nav: true,
            //            component: NodeError,
            //        },
            //        {
            //            path: "/node/exception",
            //            title: 'Exception',
            //            nav: true,
            //            component: NodeException,
            //        },
            //    ],
            //},
            {
                path: "/browser",
                title: "Browser",
                nav: true,
                childRoutes: [
                    {
                        path: "/browser/performance",
                        title: 'Performance',
                        nav: true,
                        component: BrowserDashboard,
                    },
                    {
                        path: "/browser/exception",
                        title: 'Exception',
                        nav: true,
                        component: BrowserException,
                    },
                    {
                        path: "/browser/exception/detail/:id",
                        title: 'Exception Detail',
                        component: BrowserExceptionDetail,
                    },
                    {
                        path: "/browser/business",
                        title: 'Business',
                        nav: true,
                        component: BrowserBusiness,
                    },
                    {
                        path: "/browser/entries",
                        title: 'Entries',
                        nav: true,
                        component: BrowserEntries,
                    },
                    //{
                    //    path: "/browser/echart",
                    //    title: 'Browser Echart',
                    //    nav: true,
                    //    component: BrowserEchart,
                    //},
                    //{
                    //    path: "/browser/map",
                    //    title: 'Browser Map',
                    //    nav: true,
                    //    component: BrowserMap,
                    //},
                    //{
                    //    path: "/browser/dynamic",
                    //    title: 'Browser Dynamic',
                    //    nav: true,
                    //    component: BrowserDynamic,
                    //}
                ]
            },
            //{
            //    path: "/analysis",
            //    title: "Analysis",
            //    nav: true,
            //    childRoutes: [
            //        {
            //            path: "/analysis/node",
            //            title: 'Node Analysis',
            //            nav: true,
            //            component: NodeAnalysis,
            //        },
            //        {
            //            path: "/analysis/browser",
            //            title: 'Browser Analysis',
            //            nav: true,
            //            component: BrowserAnalysis,
            //        }
            //    ]
            //},
            //{
            //    path: "/components",
            //    title: "Components",
            //    nav: true,
            //    childRoutes: [
            //        // {
            //        //     path: "/components/test",
            //        //     title: 'test',
            //        //     nav: true,
            //        //     component: AppTest,
            //        // },
            //        {
            //            path: "/components/map",
            //            title: 'Browser Map',
            //            nav: true,
            //            component: BrowserMap,
            //        },
            //    ]
            //}
        ]
    };


    return ()=>{
        return (
            <Router history={browserHistory} render={applyRouterMiddleware(useScroll())} routes={rootRoute} />
        );
    }

}