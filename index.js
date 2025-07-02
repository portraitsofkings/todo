// title, description, dueDate, priority, notes, checklist

class Todo {
  #features = []

  constructor(title) {
    this.title = title
    this.description = ''
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

  addFeature(feature) {
    this.#features.push(feature)
  }

  getFeatures() {
    // shallow copy, objects inside are still the same though
    // prevents removing/deleting features from outside, but allows mutating each one inside
    return [...this.#features]
  }

  removeFeature(featureIndex) {
    this.#features.splice(featureIndex, 1)
  }
}

class List {
  #todos = []

  constructor(title) {
    this.title = title
  }

  addTodo(title) {
    const todo = new Todo(title)
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

  #featureRenderers = {
    checklist: this.renderChecklist,
  }

  renderFeature(feature, update) {
    const renderFunction = this.#featureRenderers[feature.type]
    return renderFunction
      ? renderFunction(feature, update)
      : document.createTextNode('Unknown feature used ❌')
  }

  renderChecklist(feature, update) {
    feature.title ??= 'Untitled'
    feature.items ??= []

    const checklist = document.createElement('div')
    checklist.className = 'checklist'
    const title = document.createElement('h2')
    title.textContent = feature.title
    checklist.appendChild(title)

    feature.items.forEach((item, index) => {
      const itemWrapper = document.createElement('div')
      itemWrapper.className = 'checklist-items'

      const checkbox = document.createElement('input')
      checkbox.setAttribute('type', 'checkbox')
      checkbox.checked = item.checked
      checkbox.addEventListener('change', () => {
        feature.items[index].checked = checkbox.checked
        update()
      })
      itemWrapper.appendChild(checkbox)

      const text = document.createElement('div')
      text.textContent = item.text
      itemWrapper.appendChild(text)

      const removeItem = document.createElement('button')
      removeItem.textContent = 'x'
      removeItem.addEventListener('click', () => {
        feature.items.splice(index, 1)
        update()
      })

      itemWrapper.appendChild(removeItem)
      checklist.appendChild(itemWrapper)
    })

    const addItem = document.createElement('button')
    addItem.textContent = '+ New Item'
    addItem.addEventListener('click', () => {
      feature.items.push({ text: 'Added Item', checked: false })
      update()
    })
    checklist.appendChild(addItem)

    return checklist
  }

  renderMain(lists, update) {
    this.container.replaceChildren()
    lists.forEach((list, listIndex) => {
      const listElement = document.createElement('div')

      listElement.className = 'list'
      listElement.dataset.index = listIndex

      const listTitle = document.createElement('h1')
      listTitle.textContent = list.getTitle()
      listElement.appendChild(listTitle)

      listElement.addEventListener('click', event => {
        const clickedElement = event.target.closest('.todo')

        if (clickedElement === null) {
          return
        }
        const listIndex = event.currentTarget.dataset.index
        const todoIndex = clickedElement.dataset.index
        this.renderDetailsDialog(lists, listIndex, todoIndex)
      })

      const todos = list.getTodos()
      todos.forEach((todo, todoIndex) => {
        const todoElement = document.createElement('div')
        todoElement.className = 'todo'
        todoElement.dataset.index = todoIndex

        const todoTitle = document.createElement('p')
        todoTitle.textContent = `ID: ${todoIndex} ${todo.getTitle()}`
        todoElement.appendChild(todoTitle)

        // const todoDescription = document.createElement('p')
        // todoDescription.textContent = `description: ${todo.getDescription()}`
        // todoElement.appendChild(todoDescription)

        // todo.getFeatures().forEach(feature => {
        //   todoElement.appendChild(this.renderFeature(feature, update))
        // })

        listElement.appendChild(todoElement)
      })

      const addTodoButton = document.createElement('button')
      addTodoButton.textContent = '+ New Todo'
      addTodoButton.addEventListener('click', event => {
        // create new todo with default values
        list.addTodo('Added Todo')
        update()
        // figure out how to make title editable, but when not being edited, show regular text
      })
      listElement.appendChild(addTodoButton)

      this.container.appendChild(listElement)
    })
  }

  renderDetailsDialog(lists, listIndex, todoIndex) {
    const dialog = document.querySelector('dialog')

    const update = () => {
      dialog.replaceChildren()
      const list = lists[listIndex]
      const todo = list.getTodo(todoIndex)
      const todoTitle = document.createElement('h1')
      todoTitle.textContent = todo.getTitle()
      dialog.appendChild(todoTitle)

      todo.getFeatures().forEach(feature => {
        dialog.appendChild(this.renderFeature(feature, update))
      })
    }

    update()
    dialog.showModal()
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
    const list = this.#lists[listIndex]
    if (list) {
      list.addTodo(title)
    } else {
      alert(`addTodo: List '${listIndex}' doesn't exist`)
    }
  }

  removeTodo(listIndex, todoIndex) {
    this.#lists[listIndex].removeTodo(todoIndex)
  }

  addTodoFeature(listIndex, todoIndex, feature) {
    this.#lists[listIndex].getTodo(todoIndex).addFeature(feature)
  }
}

class App {
  constructor(container) {
    this.renderer = new Renderer(container)
    this.controller = new TodoController()
    this._init()
  }

  // capture 'this' using arrow function for future uses of update() down the line
  update = () => {
    this.renderer.renderMain(this.controller.getLists(), this.update)
  }

  addList(title) {
    this.controller.addList(title)
    this.update()
  }

  removeList(index) {
    this.controller.removeList(index)
    this.update()
  }

  addTodo(listIndex, title) {
    this.controller.addTodo(listIndex, title)
    this.update()
  }

  addTodoFeature(listIndex, todoIndex, feature) {
    this.controller.addTodoFeature(listIndex, todoIndex, feature)
    this.update()
  }

  removeTodoFeature(listIndex, todoIndex, featureIndex) {
    this.controller.removeTodoFeature(listIndex, todoIndex, featureIndex)
    this.update()
  }

  removeTodo(listIndex, todoIndex) {
    this.controller.removeTodo(listIndex, todoIndex)
    this.update()
  }

  showDetails(listIndex, todoIndex) {
    renderDetailsDialog()
  }

  _init() {
    const addListButton = document.querySelector('.add-list')
    addListButton.addEventListener('click', () => {
      this.addList('New list')
      this.update()
    })
  }
}

const app = new App(document.querySelector('.lists'))
app.addList('Default List')
app.addTodo(0, 'Default Todo')
app.addTodoFeature(0, 0, {
  type: 'checklist',
  title: 'Checklist',
  items: [{ text: 'test', checked: true }],
})
