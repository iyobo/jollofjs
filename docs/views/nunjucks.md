# Nunjucks for Server-side rendering

JollofJS uses nunjucks for server-side views.
The nunjucks root for JollofJS is `app/views`.

Please see [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html) for how to create your own views and layouts.

Filters can be created by creating them in `app/views/filters/index.js` .


An example filter index file:


```
const moment = require('moment');
const flattenGeo = require('../../util/util').flattenGeo;
const config = require('jollof').config;

module.exports = function (nunjucksEnv) {

    nunjucksEnv.addFilter('shorten', function (str, count) {
        return str.slice(0, count || 5);
    });

    nunjucksEnv.addFilter('showError', function (str) {
        if (str) {
            return '<span class="error">' + str + '</span>'
        }
        else
            return ""
    });

    nunjucksEnv.addFilter('stringify', function (obj) {
        return JSON.stringify(obj);
    });

    nunjucksEnv.addFilter('quickTime', function (date) {
        return moment(date).format('ddd MMM D, hA')
    });

    nunjucksEnv.addFilter('timeOnly', function (date) {
        return moment(date).format('hA')
    });

    /**
     * Turns an object to a json string
     */
    nunjucksEnv.addFilter('stringify', function (obj) {
        return JSON.stringify(obj)
    });

    /**
     * output symbol for currency
     */
    nunjucksEnv.addFilter('currencySymbol', function (currency) {
        let symbol = '$';

        if (currency === 'NGN') symbol = 'N'

        return symbol;
    });

    nunjucksEnv.addFilter('flattenGeo', function (location) {
        return flattenGeo(location);
    });

    nunjucksEnv.addFilter('googleMapEmbed', function (location) {

        const flattened = flattenGeo(location);
        let html = `
        <iframe
          width="100%"
          height="300"
          frameborder="0" style="border:0"
          src="https://www.google.com/maps/embed/v1/place?key=${config.thirdParty.google.maps.embedApiKey}
            &q=${flattened}" allowfullscreen>
        </iframe>
        `;


        return html;
    });


}

```
