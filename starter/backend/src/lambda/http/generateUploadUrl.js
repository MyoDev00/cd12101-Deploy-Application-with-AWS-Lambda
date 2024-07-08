import cors from '@middy/http-cors'
import middy from '@middy/core'
import { generateUploadUrl } from '../../businessLogic/todo.mjs'
import { getUserId } from '../auth/utils.mjs'

export const handler = middy()
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId

    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const uploadUrl = await generateUploadUrl(todoId, userId)
    if (!uploadUrl) return { statusCode: 500 }

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  })
