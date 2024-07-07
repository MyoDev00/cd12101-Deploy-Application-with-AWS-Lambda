import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = new createLogger('Todos')

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
    console.log(`Getting all todos from ${this.todosTable}`)

    try {
      const result = await this.dynamoDbClient.query({
        TableName: this.todosTable,
        IndexName: process.env.TODO_USER_ID_INDEX,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      logger.info('Get Todos')
      return result.Items
    } catch (err) {
      console.log('Error getting todos', err)
      logger.error('Error getting todos', err)
    }
  }

  async createTodo(todo) {
    console.log(`Creating a to with id ${todo.todoId}`)

    try {
      await this.dynamoDbClient.put({
        TableName: this.todosTable,
        Item: todo
      })
      logger.info('Create Todo')
      return todo
    } catch (err) {
      console.log(`Create failed ${err}`)
      logger.error('Created failed', err)
      return undefined
    }
  }

  async updateTodo(todo) {
    console.log(`Updating todo with id ${todo.todoId}`)
    try {
      await this.dynamoDbClient.update({
        TableName: this.todosTable,
        Key: { todoId: todo.todoId },
        UpdateExpression: 'set name = :nameValue, completed = :completedValue',
        ExpressionAttributeValues: {
          ':nameValue': todo.name,
          ':completedValue': todo.complete
        },
        ReturnValues: 'UPDATED_NEW'
      })
      logger.info('Update Todo')
      return todo
    } catch (err) {
      console.log(`Update failed ${err}`)
      logger.error('Update failed', err)
      return undefined
    }
  }

  async updateAttachment(todoId, url) {
    try {
      await this.dynamoDbClient.update({
        TableName: this.todosTable,
        Key: { todoId },
        UpdateExpression: 'set attachmentUrl = :url',
        ExpressionAttributeValues: {
          ':url': url
        }
      })
      logger.info('Update Attachment')
    } catch (err) {
      console.log(`Update attachment failed ${err}`)
      logger.error('Update attachment failed', err)
    }
  }

  async deleteTodo(todoId) {
    console.log(`Deleting todo with todoId ${todoId}`)
    const params = {
      TableName: this.todosTable
    }

    try {
      await this.dynamoDbClient.delete({
        TableName: this.todosTable,
        Key: {
          todoId: todoId
        }
      })
      logger.info('Delete Todo')
      return {}
    } catch (err) {
      console.log(`Delete failed ${err}`)
      logger.error('Delete failed', err)
      return undefined
    }
  }
}
