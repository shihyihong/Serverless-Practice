"use strict";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = async event => {
  try {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    if (typeof data.name !== "string" || typeof data.state !== "boolean") {
      throw new Error("data type error");
    }
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.pathParameters.id
      },
      ConditionExpression: "attribute_exists(id)",
      ExpressionAttributeNames: {
        "#todo_name": "name",
        "#todo_state": "state"
      },
      ExpressionAttributeValues: {
        ":name": data.name,
        ":state": data.state,
        ":updatedAt": timestamp
      },
      UpdateExpression:
        "SET #todo_name = :name, #todo_state = :state, updatedAt = :updatedAt",
      ReturnValues: "ALL_NEW"
    };
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "update successfully!",
          matters: result
        },
        null,
        2
      )
    };
  } catch (err) {
    console.error(
      "Unable to update item. Error JSON:",
      JSON.stringify(err.message, null, 2)
    );
    return {
      statusCode: err.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(err.message)
    };
  }
};
