import express from 'express'
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.db.end();
  res.status(200).json({
    'Status': 200,
    'Routes': {
        'POST /reset': {
            'Description': 'Wipes all data',
            'Request Body': {},
            'Response': {},
            'Response Status': 200
        },
        'POST /populate': {
            'Description': 'Populates database with test data',
            'Request Body': {},
            'Response': {},
            'Response Status': 200
        },
        'GET /users': {
            'Description': 'Returns the user with the requested username',
            'Query Parameters': ['username:string'],
            'Response': [{
                'id': 'int',
                'username': 'string',
                'avatar': 'string:url',
                'created': 'string:timestamp'
            }],
            'Response Status': 200
        },
        'POST /login': {
            'Description': 'Login user request',
            'Request Body': {
                'username': 'string',
                'password': 'string'
            },
            'Response': {
                'message': 'Login successful'
            },
            'Response Status': 200,
            'Errors': [
                {
                    'message': 'Missing parameter: username',
                    'status': 400
                },
                {
                    'message': 'Incorrect username or password',
                    'status': 400
                }
            ]
        },
        'POST /users': {
            'Description': 'Create user request',
            'Request Body': {
                'username': 'string',
                'password': 'string',
                'avatar': 'string:url (optional)'
            },
            'Response': {
                'id': 'int',
                'username': 'string',
                'avatar': 'string:url',
                'created': 'string:timestamp'
            },
            'Response Status': 201,
            'Errors': [
                {
                    'message': 'Missing parameter: username',
                    'status': 400
                },
                {
                    'message': 'Invalid password <password>',
                    'status': 400
                }
            ]
        },
        'POST /posts': {
            'Description': 'Create post request',
            'Request Body': {
                'userId': 'int',
                'title': 'string',
                'content': 'string',
                'image': 'string:url (optional)'
            },
            'Response': {
                'id': 'int',
                'title': 'string',
                'content': 'string',
                'image': 'string:url',
                'userId': 'int',
                'created': 'string:timestamp'
            },
            'Response Status': 201,
            'Errors': [
                {
                    'message': 'Missing parameter: title',
                    'status': 400
                },
                {
                    'message': 'Missing parameter: content',
                    'status': 400
                },
                {
                    'message': 'User does not exist',
                    'status': 404
                }
            ]
        },
        'GET /posts': {
            'Description': 'Returns posts that comply with query parameters',
            'Query Parameters': [
                'title:string',
                'userId:string',
                'from:string(date)',
                'to:string(date)'
            ],
            'Response': [{
                'id': 'int',
                'title': 'string',
                'content': 'string',
                'image': 'string:url',
                'userId': 'int',
                'created': 'string:timestamp'
            }],
            'Response Status': 200
        },
        
    }
    });
});

export default router;
