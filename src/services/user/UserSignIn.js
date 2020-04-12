/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/
'use strict';
const user = require('../../../test/dummy/user.json');

const bunyan = require('bunyan');

const Auth = require('../Auth');

const log = bunyan.createLogger(
    {
        src: true,
        name: 'UserSignIn.js',
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

class UserSignIn {
    constructor(credentials) {
        this.credentials = credentials;
    }

    async authUser() {
        try {
            const auth = new Auth();
            const user = await this.retrieveUser();
            const token = await auth.authUser(user, this.credentials);

            /* temp password - vJb0pAJNlWlCApCxmdqY */
            delete user.user_password;

            return {
                user,
                token
            }
        } catch(error) {
            throw new Error(error.message);
        }
    }

    async retrieveUser() {
        const user_profile = user;

        if(!user_profile) {
            throw new Error('User does not exist');
        } else {
            delete user_profile.create_date;
            delete user_profile.update_date;
            return user_profile;
        }
    }
}
  
module.exports = UserSignIn;