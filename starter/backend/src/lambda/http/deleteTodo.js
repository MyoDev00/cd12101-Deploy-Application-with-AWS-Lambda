import cors from '@middy/http-cors'
import { deleteTodo } from '../../businessLogic/todo.mjs'
import { getUserId } from '../auth/utils.mjs'

export const handler = middy()
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId

    const result = await deleteTodo(todoId)

    return result
  })
