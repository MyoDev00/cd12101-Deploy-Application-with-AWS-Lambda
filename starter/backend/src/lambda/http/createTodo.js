import cors from '@middy/http-cors'

export const handler = middy()
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const newTodo = JSON.parse(event.body)

    // TODO: Implement creating a new TODO item
    return undefined
  })
