import cors from '@middy/http-cors'

export const handler = middy()
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId

    // TODO: Remove a TODO item by id
    return undefined
  })
