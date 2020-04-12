/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/
'use strict';

const bunyan = require('bunyan');

const KnexConfig = require('../config/KnexConfig');

const log = bunyan.createLogger(
    {
        src: true,
        name: 'User.js',
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

class User extends KnexConfig {
    constructor(schema, table) {
        super(schema, table);

        this.data = {
            id:'',
            user_email:'',
            user_name:'',
            user_cell_number:'',
            user_password:'',
            create_date:'',
            update_date:''
        };
    }
    
    async createData(user_details) {
        this.data.user_email = String(user_details.user_email).toLowerCase();
        this.data.user_name = user_details.user_name;
        this.data.user_cell_number = user_details.user_cell_number;
        this.data.user_password = user_details.user_password;
    }

    async getData() {
        return this.data;
    }
}
  
module.exports = User;