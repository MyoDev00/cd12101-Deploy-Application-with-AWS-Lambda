import cors from '@middy/http-cors'
import middy from '@middy/core'
import { getUploadUrl } from '../../fileStorage/attachmentUtils.mjs'

export const handler = middy()
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const uploadUrl = getUploadUrl(todoId)
    if (!uploadUrl) return { statusCode: 500 }

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  })
