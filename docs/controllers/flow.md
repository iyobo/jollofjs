# Flows / Middleware

In jollofJS, the term `flow` is another term for middleware.

There are 2 types of flow items: constraints and controller Actions.

Constraints basically just block or allow access down the chain of flow/middleware.
Controller actions are the leaf-level or tail-level of the flow where the actual route is satisfied.


See koa-controller-jollof for more details.