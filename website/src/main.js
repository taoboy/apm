/**
 * Created by lenovo on 2017/7/17.
 */
// module
import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import initApp from './components/App';
import injectTapEventPlugin from 'react-tap-event-plugin';
import reducer from './redux/reducers'

import './style/scroll.scss'

const store = createStore(reducer);
const App = initApp(store);

injectTapEventPlugin();

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);


if(module.hot){
    module.hot.accept('./components/App', () => {
        const NextApp = (require('./components/App').default)(store);
        render(
            <Provider store={store}>
                <NextApp />
            </Provider>,
            document.getElementById('app')
        );
    });
}