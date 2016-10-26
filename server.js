var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var uuid = require('uuid');

var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});

var docClient = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();

var tableName = 'dynamo-test-table';
var PORT = 3000;

// Permit the app to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// Use body-parser as middleware for the app.
app.use(bodyParser.json());

app.post('/createItem', function (req, res) {
    if (req.body) {
        var params = {
            TableName: tableName,
            Item: {
                id: uuid.v1(),
                category: req.body.category,
                name: req.body.name,
                createDate: (new Date()).toLocaleString()
            }
        }
        docClient.put(params, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send('create item success.');
            }
        });
    } else {
        res.send('no request data');
    }
    
});

app.post('/readItem', function (req, res) {
    if (req.body) {
        var params = {
            TableName: tableName,
            Key: {
                id: req.body.id,
                category: req.body.category
            }
        }
        docClient.get(params, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    } else {
        res.send('no request data');
    }
});

app.post('/updateItem', function (req, res) {
    if (req.body) {
        var params = {
            TableName: tableName,
            Key: {
                id: req.body.id,
                category: req.body.category
            },
            UpdateExpression: 'set #m=:n',
            ExpressionAttributeNames: {
                '#m': 'name'
            },
            ExpressionAttributeValues: {
                ':n': req.body.name
            },
            ReturnValues: 'UPDATED_NEW'
        };
        docClient.update(params, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    } else {
        res.send('no request data');
    }
});

app.post('/deleteItem', function (req, res) {
    if (req.body) {
        var params = {
            TableName: tableName,
            Key: {
                id: req.body.id,
                category: req.body.category
            }
        }
        docClient.delete(params, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    } else {
        res.send('no request data');
    }
});

app.listen(PORT, function () {
    console.log('server is running on localhost:' + PORT);
});
