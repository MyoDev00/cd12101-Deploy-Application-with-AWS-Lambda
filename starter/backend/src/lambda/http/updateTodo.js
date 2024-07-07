import cors from '@middy/http-cors'
import middy from '@middy/core'
import { updateTodo } from '../../businessLogic/todo.mjs'
import { getUserId } from '../auth/utils.mjs'

export const handler = middy()
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    var result = await updateTodo(updatedTodo, todoId)

    if (!result) {
      return {
        statusCode: 500
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: {
          name: result.name,
          dueDate: result.dueDate,
          done: result.done
        }
      })
    }
  })
