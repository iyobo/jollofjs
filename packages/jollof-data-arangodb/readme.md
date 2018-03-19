# jollof-data-arangodb
ArangoDB data adapter for JollofJS.

With this adapter, you can now use ArangoDB (v3+) as a datasource with [The JollofJS Framework](http://jollofjs.com)!

## What is ArangoDB
ArangoDB is a modern multi-model database that merges the functionality of a Document, Key-Value, and Graphing Database system all-in-one.
It also comes with native support for joins, transactions, Materialized views, comes with it's own SQL (String Query Language) called AQL, etc.

Basically ArangoDB can handle everything you'd expect from a RDBM and MORE, all done with modern/futuristic swag.

https://www.arangodb.com/

## How to use

`npm i jollof-data-arangodb`

then

config/<env>.js
```
...
data: {
        dataSources: {
            default: {
                adapter: require('jollof-data-arangodb'),
                nativeType: 'arangodb',
                options: {
                    url: null, //uses localhost:8529 by default if this value is falsy
                    databaseName: 'funtime',
                    username: 'root',
                    password: ''
                }
            },
        }
    },
    ...
```

## What to expect

On launch, jollofJs will attempt to connect to ArangoDB and create the database named in `databaseName` if it does not exist.
Naturally, you should give any app server a limited DB account and manually create the database yourself, but JollofJS will attempt to create any missing thing anyway in case you just happened to be lazy and gave it a root-ish account :).

Next, for each model assigned to the datasource (in the case above, 'default'), it will attempt to create a collection if it does not already exist.

The JollofJS ODM (and thus the admin) can work with the document-based side of ArangoDB.
To use native features like Joins, transactions, Views, Graphs, etc, feel free to create native functions in your models....something JollofJS will always make easy for you to do.


## JollofJS loves ArangoDB

I would personally like to see more people take an interest in ArangoDB. That said, I probably won't be in a hurry to create a PostreSQL or MySQL adapter as ArangoDB more than makes up for either of those.
Give it a try!

You are, however, more than free to create any adapters you need. They are fairly simple to churn out! Hit me up if you need help/guidance creating any.
