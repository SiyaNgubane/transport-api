/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/
'use strict';

const bunyan = require('bunyan');
const crypto = require('crypto');

const ENCRYPTION_ALGORITHM = process.env.ENCRYPTION_ALGORITHM;
const IV_LENGTH = 16; //process.env.IV_LENGTH; For AES, this is always 16

const log = bunyan.createLogger(
    {
        name: 'encrypt',
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
    encrypt
};

async function encrypt(text, ENCRYPTION_KEY) {
    try {
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch(error) {
        log.error(error);
        throw error;
    }
}
