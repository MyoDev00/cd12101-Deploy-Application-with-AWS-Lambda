import cors from '@middy/http-cors'

export const handler = middy()
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    // TODO: Get all TODO items for a current user
    return undefined
  })
