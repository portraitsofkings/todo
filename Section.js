import Task from './Task.js'
export default class Section {
  #tasks = []
  constructor(title = 'Untitled', tasks) {
    this.title = title
    this.#tasks = tasks ?? []
  }

  addTask(data = {}) {
    this.#tasks.push(new Task(data))
  }

  removeTask(taskId) {
    this.#tasks.splice(taskId, 1)
  }

  toJSON() {
    return { title: this.title, tasks: this.#tasks }
  }

  getTasks() {
    return this.#tasks
  }

  getTask(taskId) {
    return this.#tasks[taskId]
  }
}
