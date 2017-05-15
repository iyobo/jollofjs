/**
 * Created by iyobo on 2017-05-14.
 */

const KRouter = require('koa-router');

function isPath(it) {

    return it.startsWith('/')
}

exports.makeRoute= (router, method, path, flow, children) =>{

    if (!children) {
        router = router[method](path, flow)
    } else {
        //has children
        let subRouter = KRouter();
        subRouter = digestRouteMap(subRouter, children)

        if(flow)
            router.use(path, flow, subRouter.routes(), subRouter.allowedMethods());
        else
            router.use(path, subRouter.routes(), subRouter.allowedMethods());

    }


    return router;
}

exports.digestRouteMap = (router, routes) => {

    const keys = Object.keys(routes);

    for (let key in keys) {

        const value = routes[key];

        //flow and children are the currently supported route fields
        const flow = value.flow;
        const children = value.children;

        //key contains method and path
        key = key.trim();
        let methPath = key.split(' ');
        let method = 'get';
        let path;

        methPath.forEach((it) => {
            it = it.trim();
            if (isPath(it)) {
                path = it;
            } else {
                method = it.toLowerCase();
            }
        });

        //At this point we should have a path!
        if (!path) {
            throw new Error('No path defined for route:', key)
        }

        router = exports.makeRoute(router, method, path, flow, children);

    }

    return router;
}