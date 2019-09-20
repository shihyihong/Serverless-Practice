"use strict";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const crypto = require("crypto");

module.exports.insert = async event => {
  try {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: crypto.randomBytes(10).toString("hex"),
        name: data.name,
        state: true,
        updatedTime: timestamp
      }
    };
    await dynamoDb.put(params).promise();
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "successfully insert",
          matters: result.Items
        },
        null,
        2
      )
    };
  } catch (err) {
    console.error(
      "Unable to add item. Error JSON:",
      JSON.stringify(err, null, 2)
    );
    return {
      statusCode: err.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(err.message)
    };
  }
};
