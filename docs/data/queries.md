# Queries

Still using the USer model as an example

## Simple (By-Equality) queries

```
//Finds
await jollof.models.User.findBy({firstName: 'foo', lastName: 'bar'}, opts)
await jollof.models.User.findOneBy({firstName: 'foo', lastName: 'bar'}, opts)

//Counts
await jollof.models.User.countBy({firstName: 'foo', lastName: 'bar'})

//Updates
await jollof.models.User.updateBy({id: '...'}, newValues)

//Remove
await jollof.models.User.removeBy({id: '...'})

```

## JFQL queries
JFQL is the data language of JollofJS.

It is a simple language that consists of arrays, where each condition in the array is ANDED.

Each condition follows the convention `[FIELD_NAME, COMPARATOR, VALUE ]`.
You can also explicitly define AND or OR conditions by wrapping the condition groups in {and: conditions} or {or: conditions}

```
const date1 = new Date('...');
const date2 = new Date('...');

const query= [
    [ 'firstName', '=', 'Patrick' ],
    [ 'lastName', '=', 'Squid' ],
    {
     or:[
        [ 'dateCreated', '<=', date1],
        [ 'dateCreated', '>=', date2]
    ]}

]


//Finds
await jollof.models.User.find(query, opts)
await jollof.models.User.findOne(query, opts)

//Counts
await jollof.models.User.count(query)

//Updates
await jollof.models.User.update(query, newValues)

//Remove
await jollof.models.User.remove(query)

```

You can use this right in the admin backend as well to explore your app's data. (skip `const query=`)

### JFQL comparators
These are the supported comparators for JFQL.

=
!=
>
>=
<
>=
in
nin

## Native queries
See the Models section on Native functions.

## Querying Ref fields

Each database has it's own way of storing Id fields or fields that "ref" to other entities.
E.g MongoDB uses the ObjectID object type to store id fields.

Given this, it is important to make sure you are using the right Id type when constructing conditions involving Ref fields.
i.e checking an ObjectID ref field with a string value (as is what you would most likely get from server request params/queries/etc) will not match!

The recommended way to do this is to use `Model.wrapId(yourId)`.
This will convert the id value you are checking with to the right Id type.

```
//in some controller
var stringId = req.params.id;

...

//somewhere down the execution path, where you need to make a jollofJS query with this Id
const User = jollof.models.User;
const id = User.wrapId(stringId);

//Now you can use it to build conditions
await User.find([ ['someRefField', '=', id] ]);
await User.findBy({someOtherRef: id});

```

Doing it this way (instead of manually casting it yourself) ensures that you don't have to worry about this later if the Model's datasource changes to another database entirely that handles Ids differently.