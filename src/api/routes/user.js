/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/
'use strict';

const bunyan = require('bunyan');

const Auth = require('../../services/Auth');
const UserSignIn = require('../../services/user/UserSignIn');
const CreateUser = require('../../services/user/CreateUser');

const auth = new Auth();

const log = bunyan.createLogger(
    {
        src: true,
        name: 'user-routes',
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

module.exports = function(app) {
    /**
     * @swagger
     * tags:
     *   name: User
     *   description: User Management
    */

    /**
     * @swagger
     * /user_sign_in:
     *   post:
     *     summary: User sign in
     *     tags: [User]
     *     requestBody:
     *       description: Transport's user sign in details
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserSignIn'
     *     responses:
     *        '200':
     *          description: User succesfully signed in
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                $ref: '#/components/schemas/DashSignInResponse'
     *        '400':
     *          description: Error while signing in
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                $ref: '#/components/schemas/DefaultError'
     */
    app.post('/user_sign_in', async (req, res) => {
        try {
            const credentials = req.body;
            const userSignIn = new UserSignIn(credentials);

            res.status(200).json({
                success:true,
                auth:await userSignIn.authUser()
            });
        } catch (error) {
            res.status(400).json({
                success:false,
                message:error.message
            });
        }
    });
  
    /**
     * @swagger
     * /create_user:
     *   post:
     *     summary: Create a new user
     *     tags: [User]
     *     requestBody:
     *       description: User details
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       '200':
     *         description: Successfully created user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               $ref: '#/components/schemas/User'
     *       '400':
     *         description: Error while creating user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               $ref: '#/components/schemas/DefaultError'
     */
    app.post('/create_user', async (req, res) => {
        try {
            const user_details = req.body;
            const createUser =  new CreateUser(user_details);
            const new_user = await createUser.createNewUser();

            res.status(200).json({
                success: true,
                new_user
            });
        } catch (error) {
            log.error(error);
            res.status(400).json({
                success:false,
                message:'Error creating user, please contact support.'
            });
        }
    });
  
    /**
     * @swagger
     * /update_user:
     *    put:
     *      summary: Update user details
     *      tags: [User]
     *      parameters:
     *        - name: token
     *          in: header
     *          description: auth token
     *          required: true
     *          schema: 
     *            type: string
     *        - name: email
     *          in: header
     *          description: email
     *          required: true
     *          schema: 
     *            type: string
     *      requestBody:
     *        description: User details
     *        required: true
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/User'
     *      responses:
     *        '200':
     *          description: Successfully updated user
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                $ref: '#/components/schemas/User'
     *        '400':
     *          description: Error while updating user
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                $ref: '#/components/schemas/DefaultError'
     */
    app.put('/update_user', async (req, res) => {
        try {
            const token = req.headers.token;
            const email = req.headers.email;
            const user_details = req.body;

            if(await auth.isUser(token, email)) {
                user_details.user_email = email;
                res.status(200).json({
                    success:true,
                    user_details}
                );
            } else {
                res.status(401).json({
                    success:false,
                    message:'Unauthorised.'
                });
            }
        } catch (error) {
            log.error(error);
            res.status(400).json({
                success:false,
                message:'Error updating user, please contact support.'
            });
        }
    });

    /**
     * @swagger
     *  components:
     *    schemas:
     *      UserSignIn:
     *        type: object
     *        properties:
     *          user_email:
     *            type: string
     *            description: User's email address.
     *          user_password:
     *            type: string
     *            description: User's password.
     *      User:
     *        type: object
     *        required:
     *          - user_email
     *          - user_name
     *          - user_surname
     *          - user_cell_number
     *          - user_2fa_secret
     *          - device_id
     *        properties:
     *          user_email:
     *            type: string
     *            format: email
     *            description: User's email address.
     *          user_name:
     *            type: string
     *            description: User's name.
     *          user_surname:
     *            type: string
     *            description: User's surname.
     *          user_cell_number:
     *            type: string
     *            description: User's cellphone number.
     *          user_password:
     *            type: string
     *            description: User's account password.
     *          user_2fa_secret:
     *            type: string
     *            description: User's 2fa secret.
     *          device_id:
     *            type: string
     *            description: User's device id.
     *        example:
     *           user_email: John.Doe@transport.com
     *           user_name: John
     *           user_surname: Doe
     *           user_cell_number: 0831239876
     *      DefaultSuccess:
     *        type: object
     *        properties:
     *          success:
     *            type: boolean
     *            description: Success boolean.
     *          message:
     *            type: string
     *            description: Success message.
     *        example:
     *           success: true
     *           message: Successfully Executed
     *      DefaultError:
     *        type: object
     *        properties:
     *          success:
     *            type: boolean
     *            description: Success boolean.
     *          error_message:
     *            type: string
     *            description: Error message.
     *        example:
     *           success: false
     *           error_message: Error
     */
};
