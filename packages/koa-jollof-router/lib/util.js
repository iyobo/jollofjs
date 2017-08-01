/**
 * Created by iyobo on 2017-05-14.
 */

const KRouter = require('koa-router');

function isPath(it) {

    return it.startsWith('/')
}

exports.makeRoute = (router, method, path, flow, children) => {

    if (flow && !Array.isArray(flow))
        flow = [flow];

    //error handling try/catch wrap
    if (flow) {
        flow = flow.map((it) => {
            return async function (ctx, next) {
                try {
                    return await it(ctx, next)
                } catch (err) {
                    console.error(err.stack);

                    if (err.isBoom && !err.isServer) {
                        ctx.status = err.output.statusCode;
                        ctx.body = err.output.payload;
                    } else {
                        ctx.throw(err);
                    }

                }
            }
        });
    }


    if (!children) {
        if (flow)
            router = router[method](path, ...flow)
        //else
        //    router = router[method](path, ...flow)
        //console.log('route:',method,path, flow.length||1)
    } else {
        //has children
        let subRouter = KRouter();
        subRouter = exports.digestRouteMap(subRouter, children)

        if (flow)
            router.use(path, ...flow, subRouter.routes(), subRouter.allowedMethods());
        else
            router.use(path, subRouter.routes(), subRouter.allowedMethods());

    }


    return router;
}

exports.digestRouteMap = (router, routes) => {

    const keys = Object.keys(routes);

    for (let i in keys) {

        let key = keys[i];
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