import React from 'react';
import {ReactSpoon} from 'react-spoon';
import DashboardPage from './pages/DashboardPage';
import store from './data/store';
import AppLayout from './layouts/appLayout';
import {Provider} from 'mobx-react';
import ModelLayout from './layouts/modelLayout';
import ModelListPage from './pages/models/ModelListPage';
import ModelEditPage from './pages/models/ModelEditPage';
import ModelCreatePage from './pages/models/ModelCreatePage';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

store.models.fetchModels().then(() => {

    new ReactSpoon([
            {
                name: '',
                path: '*',
                handler: AppLayout,
                children: [
                    { path: '', redirectTo: 'dashboard' },
                    { path: 'dashboard', name: 'dashboard', handler: DashboardPage },
                    {
                        path: 'models/:modelName*', name: 'models', handler: ModelLayout, children: [
                        { path: 'models/:modelName', name: 'models.list', handler: ModelListPage },
                        { path: 'models/:modelName/create', name: 'models.create', handler: ModelCreatePage },
                        { path: 'models/:modelName/:id', name: 'models.edit', handler: ModelEditPage }
                    ]
                    }
                ]
            }
        ],
        {
            domId: 'app', providers: [
            { component: MuiThemeProvider },
            { component: Provider, props: { store } }
        ]
        });

    require('../../../jollofstatic/lightdash/assets/js/light-bootstrap-dashboard.js');
});
