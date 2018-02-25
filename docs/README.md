# JollofJS

The tastiest **NodeJS Application Framework** you'll ever eat.

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
JollofJS has a custom-built data abstraction layer that makes it possible to use any database (or REST API) as a datasource so long as an adapter exists for it.

- **And More!...**

*This doc is a Work-in-Progress*

## Getting Started

```
npm i -g jollofjs
```
You also need to have mongoDB and Redis up and running.


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

You should now be able to see jollof running at [http://localhost:3001](http://localhost:3001).

![jollof home](https://raw.github.com/iyobo/jollofjs/master/images/home.png)


### App structure
You are highly advised to study the structure of this new app, starting from index.js.


## Jollof Admin

To enter the Jollof admin, you have to login with that admin user you created **before** launching the app.

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


Right now, the app you created has only one used model: `User`.

See [Jollof Models](/data/models) for how to work with Models.
