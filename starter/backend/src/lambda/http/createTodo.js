import cors from '@middy/http-cors'
import middy from '@middy/core'
import { createTodo } from '../../businessLogic/todo.mjs'
import { getUserId } from '../auth/utils.mjs'

export const handler = middy()
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const newTodo = JSON.parse(event.body)
    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)
    // TODO: Implement creating a new TODO item

    const result = await createTodo(newTodo, userId)

    if (!result) {
      return {
        statusCode: 500
      }
    }

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: {
          name: result.name,
          dueDate: result.dueDate
        }
      })
    }
  })
