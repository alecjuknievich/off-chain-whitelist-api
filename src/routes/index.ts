import {Router} from 'express';

import allowList from './allow-list'

export default (app) => {

    // @ts-ignore
    const routes = new Router({})

    routes.use('/allow-list', allowList());

    app.use('/', routes);
}
