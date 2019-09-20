"use strict";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = async event => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.pathParameters.id
      },
      ConditionExpression: "attribute_exists(id)"
    };
    const result = await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "successfully delete!"
        },
        null,
        2
      )
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(err.message)
    };
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
