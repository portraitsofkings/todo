import Task from './Task.js'
export default class Section {
  #tasks = []
  constructor(title = 'Untitled') {
    this.title = title
  }

  addTask(data = {}) {
    this.#tasks.push(new Task(data))
  }

  getTasks() {
    return this.#tasks
  }

  getTask(taskId) {
    return this.#tasks[taskId]
  }
}
