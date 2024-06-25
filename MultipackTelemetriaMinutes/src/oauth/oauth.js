const CryptoJS = require('crypto-js');
const {consumerKey, accessToken, signingKey} = require('./credentials')

module.exports = (endpoint, timestamp) => {
    // create random oauth_nonce string
    const random_source = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var oauth_nonce = '';
    for (let i = 0; i < 32; i++) {
        oauth_nonce += random_source.charAt(Math.floor(Math.random() * random_source.length));
    };

    const oauth_parameter_string_object = {};
    oauth_parameter_string_object.oauth_consumer_key = consumerKey;
    oauth_parameter_string_object.oauth_token = accessToken;
    const oauth_nonce_array = CryptoJS.enc.Utf8.parse(oauth_nonce);
    oauth_parameter_string_object.oauth_nonce = encodeURIComponent(CryptoJS.enc.Base64.stringify(oauth_nonce_array));
    oauth_parameter_string_object.oauth_signature_method = 'HMAC-SHA1';
    oauth_parameter_string_object.oauth_version = '1.0';
    oauth_parameter_string_object.oauth_timestamp = Math.round((new Date()).getTime() / 1000);

    // for Authorization request header (copy object)
    const oauth_authorization_header_object = {};
    for (var key in oauth_parameter_string_object) {
        oauth_authorization_header_object[key] = oauth_parameter_string_object[key];
    }

    // convert query string into object (+ encode)
    const url_query_string = timestamp;
    const url_query_string_array = url_query_string.split('&');
    let url_query_string_object = {};
    if (url_query_string !== "") {
        url_query_string_object = JSON.parse(`{"${url_query_string.replace(/&/g, '","').replace(/=/g,'":"')}"}`, function(key, value) {return key === "" ? value : encodeURIComponent(value)});
    }

    // parse request.params
    for (var key in url_query_string_object) {
        oauth_parameter_string_object[key] = url_query_string_object[key];
    }

    // sort object by key
    const oauth_parameter_string_object_ordered = {};
    Object.keys(oauth_parameter_string_object).sort().forEach(function(key) {
        oauth_parameter_string_object_ordered[key] = oauth_parameter_string_object[key];
    });

    // convert object into array
    const oauth_parameter_string_array = [];
    for (var key in oauth_parameter_string_object_ordered) {
        oauth_parameter_string_array.push(`${key}=${oauth_parameter_string_object_ordered[key]}`);
    }

    // generate parameter string
    const oauth_parameter_string = oauth_parameter_string_array.join('&');

    // replace dynamic variables
    let base_host = endpoint;

    // generate base string
    const oauth_base_string = `GET&${encodeURIComponent(base_host)}&${encodeURIComponent(oauth_parameter_string)}`;

    // generate signature
    const oauth_signature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(oauth_base_string, signingKey));

    oauth_authorization_header_object.oauth_signature = encodeURIComponent(oauth_signature);

    // convert object into array (for Authorization header string)
    const oauth_authorization_header_array = [];
    for (var key in oauth_authorization_header_object) {
        oauth_authorization_header_array.push(`${key}="${oauth_authorization_header_object[key]}"`);
    }

    const oauth_authorization_header = oauth_authorization_header_array.join(', ');

    return oauth_authorization_header;
}


