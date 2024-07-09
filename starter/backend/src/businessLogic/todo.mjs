import * as uuid from 'uuid'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import { getUploadUrl } from '../fileStorage/attachmentUtils.mjs'

const todoAccess = new TodosAccess()

export async function getAllTodos(userId) {
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(createTodoRequest, userId) {
  const itemId = uuid.v4()
  if (createTodoRequest?.name && createTodoRequest?.name.length > 0) {
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
  return undefined
}

export async function updateTodo(updateTodoRequest, todoId, userId) {
  return await todoAccess.updateTodo({
    todoId: todoId,
    userId: userId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    attachmentUrl: updateTodoRequest.attachmentUrl,
    completed: updateTodoRequest.completed
  })
}

export async function deleteTodo(todoId, userId) {
  return await todoAccess.deleteTodo(todoId, userId)
}

export async function generateUploadUrl(todoId, userId) {
  const uploadUrl = await getUploadUrl(todoId)
  const attachmentUrl = uploadUrl.split('?')[0]

  await todoAccess.updateAttachment(todoId, userId, attachmentUrl)

  console.log(`Generated and saved image url ${attachmentUrl}`)
  return uploadUrl
}
