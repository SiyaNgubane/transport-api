/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/
'use strict';

const bunyan = require('bunyan');

const User = require('../../models/user/User');

const log = bunyan.createLogger(
    {
        src: true,
        name: 'UpdateUser.js',
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

class UpdateUser {
    constructor(user_details) {
        this.user_details = user_details;
    }

    async update() {
        const user = new User();
        await user.createData(this.user_data);

        delete this.user_data.id;
        delete this.user_data.user_email;
        delete this.user_data.user_password;
        delete this.user_data.create_date;
        delete this.user_data.update_date;

        if(false) {
            throw new Error('User not updated');
        } else {
            return this.user_details;
        }
    }
}
  
module.exports = UpdateUser;