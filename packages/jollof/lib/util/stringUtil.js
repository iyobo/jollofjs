const figlet = require('figlet');

exports.labelize = (str) => {
    return str.replace(/(^[a-z]+)|[0-9]+|[A-Z][a-z]+|[A-Z]+(?=[A-Z][a-z]|[0-9])/g
        , function (match, first) {
            if (first) match = match[0].toUpperCase() + match.substr(1);
            return match + ' ';
        }
    )
}

exports.capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.toStringArt = async (str) => {
    return await new Promise((resolve, reject) => {
        figlet(str, function(err, data) {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}