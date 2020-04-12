/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/
'use strict';

const bunyan = require('bunyan');
const crypto = require('crypto');

const decrypt = require('./decrypt');
const ENCRYPTION_ALGORITHM = process.env.ENCRYPTION_ALGORITHM;

const log = bunyan.createLogger(
    {
        name: 'compare',
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
    compare
};

async function compare(original_text, encrypted_text, ENCRYPTION_KEY) {
    try {
        const decryption = await decrypt.decrypt(encrypted_text, ENCRYPTION_KEY);

        return String(original_text).toLowerCase() === String(decryption).toLowerCase();
    } catch(error) {
        log.error(error);
        throw new Error(error);
    }
}
