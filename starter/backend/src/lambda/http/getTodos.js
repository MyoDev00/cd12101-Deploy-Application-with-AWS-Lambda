import cors from '@middy/http-cors'
import { getAllTodos } from '../../businessLogic/todo.mjs'
import { getUserId } from '../auth/utils.mjs'

export const handler = middy()
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    // TODO: Get all TODO items for a current user
    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)

    const todos = await getAllTodos(userId)
    return todos
  })
