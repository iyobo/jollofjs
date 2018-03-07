# JollofJS

The tastiest **NodeJS Application Framework** you ever ate.

![jollof Logo](https://raw.github.com/iyobo/jollofjs/master/images/jollof.png)


## Key Features


- **Convention over configuration**
...Because you have better things to do with your time. But JollofJS is still very configurable.

- **Full support for ES7 Async/Await**
Free yourself from the oppressive/convoluted regime of callbacks and use awesome yieldables/awaitables
through ES6 Promises, and Async Await. Powered by KoaJS.


- **Built-in Admin User Interface**
Ever wondered why something like Django Admin doesn't exist for NodeJS? Well with JollofJS, it does now.
Administer your site's data with the built-in Jollof Admin (built from scratch using React).
E.g You could whip up a blog for your Application and use Jollof Admin as a simple CMS backend for that blog.
The options are endless!

- **Data Abstraction Done Right**
JollofJS has a custom-built data abstraction layer that makes it possible to use any database (or REST API) as a datasource by creating an adapter.

- **And More!...**

*This doc is a Work-in-Progress*


## Officially Supported DataSources

- MongoDB
- ArangoDB

It is very easy to make yours!


## Getting Started

```
npm i -g jollofjs
```
You also need to have `mongoDB` and `Redis` installed and running.
Redis is used for sessions, and mongoDB is the default data adapter your skeleton app will come with.
However you are notYou can change that adapter to that of another datasource later.


Create your JollofJS app with:
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

You should now be able to see jollof running at `localhost:3000`.\]


![jollof home](https://raw.github.com/iyobo/jollofjs/master/images/home.png)


### App structure
You are highly advised to study the structure of this new app, starting from index.js.


## Jollof Admin

To enter the Jollof admin, login and go to [http://localhost:3001/admin](http://localhost:3001/admin).
You have to login with that admin user you created previously with the createAdmin command.

![jollof admin](https://raw.github.com/iyobo/jollofjs/master/images/admin.png)

Editing an item in the Admin...

![jollof edit](https://raw.github.com/iyobo/jollofjs/master/images/edit.png)


The Jollof Admin is, quite frankly, the Saber's edge of any NodeJS framework in existence today. 
Jollof Admin automatically creates a user interface to administer all your models, as well as in-built models.
It supports all the usual field types you find in an other admins, *and then some!* Including:
* Arrays (Of ANY field type)
* Objects, (Of ANY combination of field types)
* Files, 
* GeoLocations


Right now, the app you just created has 3 direct models `User`.

See the [Jollof docs](http://jollofjs.com) for how to work with Models.
