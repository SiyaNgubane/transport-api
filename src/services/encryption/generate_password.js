/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/
'use strict';

const bunyan = require('bunyan');

const log = bunyan.createLogger(
    {
        name: 'generate-password',
        streams: [
            {
                level: 'debug',
                stream: process.stdout
            },
            {
                level: 'info',
                path: '/var/tmp/logs.json'
            }
        ]
    }
);

module.exports = {
    generate_password:generate_password,
    generate_key:generate_key,
    generate_caps_key:generate_caps_key
};

/**
 * 
 * @param {Integer} length of the generated password
 */
async function generate_password(length) {
    var generated_password = "";
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (var i = 0; i < length; i++)
        generated_password += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return generated_password;
}

/**
 * 
 * @param {Integer} the generated key
 */
async function generate_key(min, max) {
    var generated_key = "";
    const length = Math.random() * (max - min) + min;
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (var i = 0; i < length; i++)
        generated_key += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return generated_key;
}

/**
 * 
 * @param {Integer} length of the generated fiat reference
 */
async function generate_caps_key(length) {
    var generated_key = "";
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    for (var i = 0; i < length; i++)
    generated_key += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return generated_key;
}