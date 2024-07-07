import * as uuid from 'uuid'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import { getUploadUrl } from '../fileStorage/attachmentUtils.mjs'

const todoAccess = new TodosAccess()

export async function getAllTodos(userId) {
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(createTodoRequest, userId) {
  const itemId = uuid.v4()
  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    attachmentUrl: createTodoRequest.attachmentUrl,
    createdAt: new Date().toISOString(),
    completed: false
  })
}

export async function updateTodo(updateTodoRequest, todoId) {
  return await todoAccess.updateTodo({
    todoId: todoId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    attachmentUrl: updateTodoRequest.attachmentUrl,
    completed: updateTodoRequest.completed
  })
}

export async function deleteTodo(todoId) {
  return await todoAccess.deleteTodo(todoId)
}

export async function generateUploadUrl(todoId) {
  const bucketName = process.env.IMAGES_S3_BUCKET
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
  const url = await getUploadUrl(todoId)

  await todoAccess.updateAttachment(todoId, attachmentUrl)

  console.log(`Generate and saved image url ${url}`)
  return url
}
