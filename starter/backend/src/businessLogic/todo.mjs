import * as uuid from 'uuid'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodosAccess()

export async function getAllTodos(userId) {
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(createTodoRequest, userId) {
  const itemId = uuid.v4()
  return todoAccess.createTodo({
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
  return todoAccess.updateTodo({
    todoId: todoId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    attachmentUrl: updateTodoRequest.attachmentUrl,
    completed: updateTodoRequest.completed
  })
}

export async function deleteTodo(todoId) {
  return todoAccess.deleteTodo(todoId)
}
