exports.hijackConsole = () => {
    var origlog = console.log;

    console.log = function (obj, ...placeholders) {
        if (typeof obj === 'string')
            placeholders.unshift(new Date() + " " + obj);
        else {
            // This handles console.log( object )
            placeholders.unshift(obj);
            placeholders.unshift(Date.now() + " %j");
        }

        origlog.apply(this, placeholders);
    };

    var origerr = console.err;

    console.err = function (obj, ...placeholders) {
        if (typeof obj === 'string')
            placeholders.unshift(new Date() + " " + obj);
        else {
            // This handles console.log( object )
            placeholders.unshift(obj);
            placeholders.unshift(Date.now() + " %j");
        }

        origerr.apply(this, placeholders);
    };
}