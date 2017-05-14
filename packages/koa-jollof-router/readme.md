# Koa-Jollof-Router

A router for KoaJS that makes routing in KoaJS easy to reason about and compose.
Supports Koa@2 and up.

## Features

* Nested Routing

## How to use

```
const KJRouter = require('koa-jollof-router');

const routeMap = {

    '/': { flow: asyncFunc1}, //same as 'get /'
    'get /': {flow: asyncFunc2 }, //Same path as the first one. given name. Will overwrite because it is the last path to be given to 'get /'.
    'get /contact/*': {flow: [ auth.isLoggedIn, auth.canGetContacts, asyncFunc3]}, //wildcard router. Perfect for html5 routing
    'delete /foo/:id': {flow: [ auth.isLoggedIn, auth.canDeleteFoos, asyncFunc4]},
    '/api/v1': { flow: auth.isLoggedIn, children: {
        '/': {flow: ApiIndexPage},
        'patch /post/:id': {flow: [auth.canEditPost, postControllerFunc]}
     }}

}

//
const router = new KJRouter(routeMap);

//Let's extend the routes

const anotherRouteMapFromSomeOtherModule={
    '/contact': {flow: contactPage},
    'post /contact': {flow: sendContactAction}
}

//Appends the second routemap to router's. Will overwrite
router.addRoutes(anotherRouteMapFromSomewhereElse)

// OR to ensure no overwrites

router.addRoutes({
    '/other': { children: anotherRouteMapFromSomeOtherModule}
});



//register routes with Koa. This should be the final step.
app.use(router.routes());

```