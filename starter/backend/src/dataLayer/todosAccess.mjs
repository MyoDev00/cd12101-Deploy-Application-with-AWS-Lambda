import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodosAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
  }

  async getAllTodos(userId) {
    console.log('Getting all todos')

    try {
      const result = await this.dynamoDbClient.query({
        TableName: this.todosTable,
        IndexName: process.env.TODO_USER_ID_INDEX,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      return result.Items
    } catch (err) {
      console.log('Error getting todos', err)
    }
  }

  async createTodo(todo) {
    console.log(`Creating a to with id ${todo.todoId}`)

    try {
      await this.dynamoDbClient.put({
        TableName: this.todosTable,
        Item: todo
      })
      return todo
    } catch (err) {
      console.log(`Create failed ${err}`)
      return undefined
    }
  }

  async updateTodo(todo) {
    console.log(`Updating todo with id ${todo.todoId}`)
    try {
      await this.dynamoDbClient.update({
        TableName: this.todosTable,
        Item: todo
      })
      return todo
    } catch (err) {
      console.log(`Update failed ${err}`)
      return undefined
    }
  }

  async deleteTodo(todoId) {
    console.log(`Deleting todo with todoId ${todoId}`)
    try {
      await this.dynamoDbClient.delete({
        TableName: this.todosTable,
        Key: { PrimaryKey: todoId }
      })
      return {}
    } catch (err) {
      console.log(`Delete failed ${err}`)
      return undefined
    }
  }
}
