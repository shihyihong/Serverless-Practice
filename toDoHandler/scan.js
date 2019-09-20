"use strict";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.DYNAMODB_TABLE
};
module.exports.scan = async event => {
  try {
    const result = await dynamoDb.scan(params).promise();
    if (result.Items.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: "There is no matters. Please insert one !"
          },
          null,
          2
        )
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: "get all matters!!",
            matters: result.Items
          },
          null,
          2
        )
      };
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(err.message)
    };
  }
};
