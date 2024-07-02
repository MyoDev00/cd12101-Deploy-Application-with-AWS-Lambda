import cors from '@middy/http-cors'
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
    if (!uploadUrl) return undefined

    return {
      uploadUrl: uploadUrl
    }
  })
