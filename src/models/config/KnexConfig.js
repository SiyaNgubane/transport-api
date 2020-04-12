/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/
'use strict';

const bunyan = require('bunyan');

const log = bunyan.createLogger(
    {
        src: true,
        name: 'KnexConfig.js',
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

class KnexConfig {
    constructor() {
        this.config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        };

        this.knex = require('knex')({
            client: 'pg',
            connection: this.config,
            pool: {
                min: 0, max: 50
            }
        });
    }
    
    getKnex() {
        return this.knex;
    }
    
    async insertData() {
        const knex = this.getKnex();
        delete this.data.id;

        try {
            return await knex(`${this.schema}.${this.table}`)
            .insert(this.data)
            .returning('create_date')
            .catch(function(error) {
                log.error(error.message);
                throw new Error(`could not save into ${this.table}`);
            });
        } catch(error) {
            log.error(error.message);
            throw new Error(`could not save into ${this.table}`);
        }
    }

    async insertData(returning) {
        const knex = this.getKnex();
        delete this.data.id;

        try {
            return await knex(`${this.schema}.${this.table}`)
            .insert(this.data)
            .returning(returning)
            .catch(function(error) {
                log.error(error.message);
                throw new Error(`could not save into ${this.table}`);
            });
        } catch(error) {
            log.error(error.message);
            throw new Error(`could not save into ${this.table}`);
        }
    }

    async deleteData(condition) {
        const knex = this.getKnex();

        try {
            return await knex(`${this.schema}.${this.table}`)
            .where(condition)
            .del()
            .catch(function(error) {
                log.error(error.message);
                throw new Error(`could not delete from ${this.table}`);
            });
        } catch(error) {
            log.error(error.message);
            throw new Error(`could not delete from ${this.table}`);
        }
    }
    
    async queryTable(condition) {
        const knex = this.getKnex();

        try {
            const result = await knex.withSchema(this.schema)
            .select('*')
            .from(this.table)
            .where(condition)
            .catch(function(error) {
                log.error(error.message);
                throw new Error(`could not query ${this.table}`);
            });

            if(result) {
                return result;
            } else {
                return false;
            }
        } catch(error) {
            log.error(error.message);
            throw new Error(`could not query ${this.table}`);
        }
    }
    
    async updateData(data, condition) {
        const knex = this.getKnex();

        try {
            return await knex(`${this.schema}.${this.table}`)
            .where(condition)
            .update(data)
            .returning('update_date')
            .catch(function(error) {
                log.error(error.message);
                throw new Error(`could not update ${this.table}`);
            });
        } catch(error) {
            log.error(error.message);
            throw new Error(`could not update ${this.table}`);
        }
    }
}
  
module.exports = KnexConfig;