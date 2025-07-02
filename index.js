// title, description, dueDate, priority, notes, checklist

class ToDo {
  constructor(title) {
    this.title = title
  }

  setTitle(newTitle) {
    this.title = newTitle
  }

  getTitle() {
    return this.title
  }

  setDescription(newDescription) {
    this.description = newDescription
  }

  getDescription() {
    return this.description
  }

  setDate(newDate) {
    this.date = newDate
  }

  getDate() {
    return this.date
  }

  setPriority(newPriority) {
    this.priority = newPriority
  }

  getPriority() {
    return this.priority
  }
}

class List {
  #todos = []

  constructor(title) {
    this.title = title
  }

  addTodo(title) {
    const todo = new ToDo(title)
    this.#todos.push(todo)
  }

  getTodo(index) {
    return this.#todos[index]
  }

  getTodos() {
    return [...this.#todos]
  }

  removeTodo(index) {
    this.#todos.splice(index, 1)
  }

  getTitle() {
    return this.title
  }
}

class Renderer {
  constructor(container) {
    this.container = container
  }

  render(lists) {
    this.container.replaceChildren()
    lists.forEach((list, listIndex) => {
      const listElement = document.createElement('div')
      listElement.dataset.index = listIndex

      const listTitle = document.createElement('h1')
      listTitle.textContent = list.getTitle()
      listElement.appendChild(listTitle)

      // use when actually needed
      // listElement.addEventListener('click', event => {
      //   const listElement = event.currentTarget
      //   const listIndex = listElement.dataset.index

      //   const todoElement = event.target

      //   console.log(event, todoElement.hasAttribute('data-index'))
      // })

      const todos = list.getTodos()
      todos.forEach((todo, todoIndex) => {
        const todoElement = document.createElement('div')
        todoElement.dataset.index = todoIndex
        todoElement.textContent = `${todoIndex} ${todo.getTitle()}`
        listElement.appendChild(todoElement)
      })

      this.container.appendChild(listElement)
    })
  }
}

class TodoController {
  #lists = []

  addList(title) {
    this.#lists.push(new List(title))
  }

  removeList(index) {
    this.#lists.splice(index, 1)
  }

  getLists() {
    return [...this.#lists]
  }

  addTodo(listIndex, title) {
    // if list exists then=>>
    this.#lists[listIndex].addTodo(title)
  }

  removeTodo(listIndex, todoIndex) {
    this.#lists[listIndex].removeTodo(todoIndex)
  }
}

class App {
  constructor(container) {
    this.renderer = new Renderer(container)
    this.controller = new TodoController()
  }

  addList(title) {
    this.controller.addList(title)
    this.renderer.render(this.controller.getLists())
  }

  removeList(index) {
    this.controller.removeList(index)
    this.renderer.render(this.controller.getLists())
  }

  addTodo(listIndex, title) {
    this.controller.addTodo(listIndex, title)
    this.renderer.render(this.controller.getLists())
  }

  removeTodo(listIndex, todoIndex) {
    this.controller.removeTodo(listIndex, todoIndex)
    this.renderer.render(this.controller.getLists())
  }

  // add/edit checklist/notes/date/description
  // editTodo(listIndex, todoIndex, )
}

const app = new App(document.querySelector('.lists'))
app.addList('Default List')
app.addTodo(0, 'Default Todo')

// const renderer = new Renderer(document.querySelector('.lists'))
// const listManager = new ListManager()

// const firstList = listManager.addList('List 1')
// firstList.addTodo(new ToDo('First todo in the first list'))
// firstList.addTodo(new ToDo('Second todo in the first list'))

// renderer.render(listManager.getLists())

// // Initial config
// const lists = [new List('List 1'), new List('List 2')]
// const defaultList = lists[0]
// defaultList.addToDo(new ToDo('Finish assignment'))
// defaultList.addToDo(new ToDo('Do errands'))

// const secondaryList = lists[1]
// secondaryList.addToDo(new ToDo('This is a test'))

// const addListButton = document.querySelector('.add-list')
// addListButton.addEventListener('click', () => {})
// // Render
// const renderer = new Renderer(document.querySelector('.lists'))
// renderer.render(lists)
