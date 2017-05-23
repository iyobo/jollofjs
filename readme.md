# JollofJS

The tastiest **NodeJS Application Framework** you ever ate.

![jollof Logo](https://raw.github.com/iyobo/jollof/master/images/jollof.png)


## Key Features

- *Convention over configuration...*
...Because you have better things to do with your time. But JollofJS is still very configurable.

- *Full support for ES6 Generators/coroutines* 
Free yourself from the oppressive/convoluted regime of callbacks and use awesome yieldables/awaitables through ES6 Promises, Generators and Co-routines. Powered by KoaJS. ES7 Async/Await coming soon.


- *Built-in Admin User Interface*
Ever wondered why something like Django Admin doesn't exist for NodeJS? Well with JollofJS, it does now.
Administer your site's data with the built-in Jollof Admin (built from scratch using React).
E.g You could whip up a blog for your Application and use Jollof Admin as a simple CMS backend for that blog.
The options are endless!

- *Environment-based Configuration Tree*
JollofJS has a custom-built config system that makes it easy to have different configurations per node.ENV.
Base configuration can easily be overwritten by environmental configs (i.e. development, test, production, etc).

- *And More!...*

## Getting Started

```
npm i -g jollof-cli
```

Then create your JollofJS app with:
```
jollof new myApp
```

Before you run your app, create an admin user:
```
cd myApp
jollof run createAdmin test@test.com password
```

Now you are ready to run your jollof app:
```
npm start
```

You should now be able to see jollof running at `localhost:3000`.

![jollof home](https://raw.github.com/iyobo/jollof/master/images/home.png)


### App structure
You are highly advised to study the structure of this new app, starting from index.js.


## Jollof Admin

To enter the Jollof admin, you have to login with that admin user you created **before** launching the app.
