/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/
'use strict';

const bunyan = require('bunyan');

const User = require('../../models/user/User');
const encrypt = require('../encryption/encrypt');
const generate_password = require('../encryption/generate_password');

const log = bunyan.createLogger(
    {
        src: true,
        name: 'CreateUser.js',
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

class CreateUser {
    constructor(user_data) {
        this.user_data = user_data;
    }

    async createNewUser() {
        const password = await this.createPassword();
        this.user_data.user_password = password.hash;

        const user =  new User();
        await user.createData(this.user_data);
        const new_user = await user.getData();
        return new_user;
    }

    async createPassword() {
        const password = await generate_password.generate_password(20);
        const hash = await encrypt.encrypt(password, process.env.PASSWORD_ENCRYPTION_KEY);

        return {
            hash:hash,
            password:password
        }
    }
}
  
module.exports = CreateUser;