# Fields

## Generic Field Definition Examples


To define a field:
`someString: String` or `someString: {type: String}`

To define a required field:
`someString: {type: String, required: true}`

To define a String field that should be inputed with a textarea in the admin:
`someString: {type: String, meta:{ widget: 'textarea'} }`

All Default Javascript primitive types are supported as field types i.e String, Number, Boolean, Date.


## Other Special Fields
When defining a field, Besides the Javascript primitive types, Jollof supports special field types.

If you looked at the user model, You should see the email field defined using one of such special Field types.

```

const types = data.types;

const schema = {
   ...
    structure: {
        ...
        email: types.Email(),
        ...
    },

    ...

}

```

The special field types are listed below:

### Email

`somefield: types.Email(),`

for required: `somefield: types.Email({required: true}),`

### Password

`somefield: {type: String, meta:{widget: 'password'}}`

for required: `somefield: {type: String, required: true, meta:{widget: 'password'}}`

### Textarea

`somefield: types.Textarea(),` (prefferred) or `somefield: {type: String, widget: 'textarea' } `

for required: `somefield: types.Textarea({required: true}),`


### RichText
This gives you a nice WYSIWYG HTML editor to work with in the admin for this field.

`somefield: types.RichText(),`

for required: `somefield: types.RichText({required: true}),`

### File
Use to upload a single file.
`somefield: types.File()`

The structure this takes in the database is that of a HTML5 file object.


### Location
Use to represent a location. The widget used in the admin for this field is a map with a draggable pointer (set long/lat) with place search and address field entry.

`someLocation: types.Location()`

### Collections

A field can also be an array or object of any combination of other fields. ex:


A string array: `tags: [String]` or `tags: [{type: String}]`
An array of file fields: `files: [ types.File() ]`
An array of locations: `geoBreadCrumb: [types.Location()]`

Here's an object with a string and a location
```
geoMessage: {
    text: String,
    location: types.Location()
}
```

And of-course, you can make an array out of that too!

```
geoMessages: [{
    text: String,
    location: types.Location()
}]
```

The possibilities are endless.
Enjoy what it feels like to have Total schema freedom and an admin UI that intelligently keep up with your imagination/structure.