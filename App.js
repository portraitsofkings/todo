import Checklist from './components/Checklist.js'

class Task {
  constructor(title = 'Untitled') {
    this.title = title
    this.components = {}
  }

  addComponent(type, component) {
    if (!this.components[type]) {
      this.components[type] = []
    }

    this.components[type].push(component)
  }

  getComponents() {
    return this.components
  }

  // getComponentsOfType(type) {
  //   return this.components[type]
  // }

  removeComponent(type, componentId) {
    this.components[type].splice(componentId)
  }
}

class Section {
  constructor(title = 'Untitled') {
    this.title = title
    this.tasks = []
  }

  addTask(title) {
    this.tasks.push(new Task(title))
  }

  removeTask(id) {
    this.tasks.splice(id, 1)
  }

  getTasks() {
    return this.tasks
  }

  getTask(taskId) {
    // FIXME: validate that requested task exists
    return this.tasks[taskId]
  }
}

class Renderer {
  constructor(container, registry) {
    this.container = container
    this.registry = registry
  }

  render(sectionsObj) {
    // Clearing before render
    this.container.replaceChildren()

    const sections = document.createElement('div')
    sections.className = 'sections'
    this.container.appendChild(sections)

    const dialog = document.createElement('dialog')
    dialog.className = 'details'
    this.container.appendChild(dialog)

    sectionsObj.forEach((sectionObj, sectionId) => {
      const section = document.createElement('div')
      section.className = 'section'
      sections.appendChild(section)

      const sectionHeader = document.createElement('div')
      sectionHeader.className = 'section__header'
      section.appendChild(sectionHeader)

      const sectionTitle = document.createElement('span')
      sectionTitle.textContent = sectionObj.title
      sectionTitle.className = 'section__title'
      sectionHeader.appendChild(sectionTitle)

      const sectionDelete = document.createElement('button')
      sectionDelete.className = 'section__delete'
      sectionDelete.textContent = 'X'
      sectionDelete.addEventListener('click', () => {
        sectionsObj.splice(sectionId, 1)
        this.render(sectionsObj)
      })
      sectionHeader.appendChild(sectionDelete)

      const sectionTasks = document.createElement('div')
      sectionTasks.className = 'section__tasks'
      section.appendChild(sectionTasks)

      sectionObj.getTasks().forEach((taskObj, taskId) => {
        const taskContainer = document.createElement('div')
        taskContainer.className = 'task'
        taskContainer.dataset.id = taskId
        sectionTasks.appendChild(taskContainer)

        const taskTitle = document.createElement('div')
        taskTitle.textContent = taskObj.title
        taskTitle.className = 'task__title'
        taskContainer.appendChild(taskTitle)

        const taskDelete = document.createElement('button')
        taskDelete.className = 'task__delete'
        taskDelete.textContent = 'X'
        taskDelete.addEventListener('click', () => {
          sectionsObj[sectionId].removeTask(taskId)
          this.render(sectionsObj)
        })
        taskContainer.appendChild(taskDelete)
      })

      const taskAdd = document.createElement('div')
      taskAdd.className = 'add-task'
      taskAdd.textContent = '+'
      taskAdd.addEventListener('click', () => {
        // another reason to make SectionManager class or something similar
        sectionObj.addTask()
        this.render(sectionsObj)
      })
      sectionTasks.appendChild(taskAdd)

      section.addEventListener('click', event => {
        const clickedElement = event.target

        const isDeleteTaskButton = clickedElement.className === 'task__delete'
        const taskElement = clickedElement.closest('.task')

        const isTaskElement = taskElement && !isDeleteTaskButton
        if (isTaskElement) {
          const taskId = taskElement.dataset.id
          const taskObj = sectionObj.getTask(taskId)
          this.renderDetails(dialog, taskObj)
        }
      })
    })
    const sectionAdd = document.createElement('div')
    sectionAdd.className = 'add-section'
    sectionAdd.textContent = '+'
    sectionAdd.addEventListener('click', () => {
      // another reason to make SectionManager class or something similar
      sectionsObj.push(new Section())
      this.render(sectionsObj)
    })
    sections.appendChild(sectionAdd)
  }

  renderDetails(dialog, taskObj) {
    // Clear before rendering
    dialog.replaceChildren()

    const title = document.createElement('h1')
    title.textContent = taskObj.title
    dialog.appendChild(title)

    const renderOrder = this.registry.getRenderOrder()
    renderOrder.forEach(type => {
      const components = taskObj.getComponents()[type]
      const COMPONENTS_ARRAY_EXISTS = typeof components === 'undefined'
      if (COMPONENTS_ARRAY_EXISTS) {
        return
      }

      components.forEach(component => {
        dialog.appendChild(component.render())
      })
    })

    dialog.showModal()
  }
}

class ComponentRegistry {
  validTypes = new Set()
  renderOrder = []
  componentClasses = new Map()

  add(type, component) {
    if (!this.validTypes.has(type)) {
      this.renderOrder.push(type)
      this.componentClasses.set(type, component)
    }
    this.validTypes.add(type)
  }

  isTypeValid(type) {
    return this.validTypes.has(type)
  }

  getClass(type) {
    return this.componentClasses.get(type)
  }

  remove(type) {
    this.validTypes.delete(type)
    this.componentClasses.delete(type)
    this.renderOrder.splice(this.renderOrder.indexOf(type), 1)
  }

  getRenderOrder() {
    return this.renderOrder
  }
}

export default class App {
  constructor(container) {
    this.componentRegistry = new ComponentRegistry()
    this.renderer = new Renderer(container, this.componentRegistry)
    this.sections = []
    // Render order is determined here
    this.componentRegistry.add('checklist', Checklist)
  }

  update = () => {
    // implicitly binds the function to App
    this.renderer.render(this.sections)
  }

  addSection(title) {
    this.sections.push(new Section(title))
    this.update()
  }

  removeSection(sectionId) {
    this.sections.splice(sectionId, 1)
    this.update()
  }

  addTask(sectionId, title) {
    this.sections[sectionId].addTask(title)
    this.update()
  }

  removeTask(sectionId, taskId) {
    this.sections[sectionId].removeTask(taskId)
    this.update()
  }

  getSection(sectionId) {
    return this.sections[sectionId]
  }

  addTaskComponent(sectionId, taskId, type, options) {
    // FIXME: check if section and task exist
    if (!this.componentRegistry.isTypeValid(type)) {
      console.log(`addTaskComponent: Invalid component type '${type}'`)
      return
    }
    const ComponentClass = this.componentRegistry.getClass(type)
    const component = new ComponentClass(options ?? {}, this.update)
    this.sections[sectionId].getTask(taskId).addComponent(type, component)
    this.update()
    return component
  }

  getTaskComponent(sectionId, taskId, componentType, componentId) {
    return this.getSection(sectionId).getTask(taskId).getComponents()[
      componentType
    ][componentId]
  }

  removeTaskComponent(sectionId, taskId, componentType, componentId) {
    this.getSection(sectionId)
      .getTask(taskId)
      .removeComponent(componentType, componentId)
  }
}
