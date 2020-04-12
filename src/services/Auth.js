/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/
'use strict';

const bunyan = require('bunyan');
const jwt = require('jsonwebtoken');

const decrypt = require('./encryption/decrypt');
const compare = require('./encryption/compare');

const log = bunyan.createLogger(
    {
        src: true,
        name: 'Auth.js',
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

class Auth {
    constructor() {}
    
    async authUser(user, credentials) {
        try {    
            const is_comparable = await compare.compare(credentials.user_password, user.user_password, process.env.PASSWORD_ENCRYPTION_KEY)
            if(is_comparable) {
                const payload = {
                    email:user.user_email,
                    secret:user.user_email
                }

                return await this.generateToken(payload);
            } else {
                throw new Error(`Auth failed.`);
            }
        } catch(error) {
            log.error(error.message);
            throw new Error(`Auth failed.`);
        }
    }

    async generateToken(payload) {
        return jwt.sign({
            email:String(payload.email).toLowerCase(),
        }, String(payload.secret).toLowerCase(), { expiresIn: '1h' });
    }

    async isUser(token, email) {
        try {
            const decoded = jwt.verify(token, String(email).toLowerCase());
            return true;
        } catch(err) {
            return false;
        }
    }
}
  
module.exports = Auth;