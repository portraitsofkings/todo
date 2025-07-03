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

  render(sections) {
    // Clearing before render
    this.container.replaceChildren()

    sections.forEach((sectionObj, sectionId) => {
      const section = document.createElement('div')
      section.className = 'section'
      this.container.appendChild(section)

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
        sections.splice(sectionId, 1)
        this.render(sections)
      })
      sectionHeader.appendChild(sectionDelete)

      const sectionTasks = document.createElement('div')
      sectionTasks.className = 'section__tasks'
      section.appendChild(sectionTasks)

      sectionObj.getTasks().forEach((taskObj, taskId) => {
        const taskContainer = document.createElement('div')
        taskContainer.className = 'task'
        sectionTasks.appendChild(taskContainer)

        const taskTitle = document.createElement('div')
        taskTitle.textContent = taskObj.title
        taskTitle.className = 'task__title'
        taskContainer.appendChild(taskTitle)

        const taskDelete = document.createElement('button')
        taskDelete.className = 'task__delete'
        taskDelete.textContent = 'X'
        taskDelete.addEventListener('click', () => {
          sections[sectionId].removeTask(taskId)
          this.render(sections)
        })
        taskContainer.appendChild(taskDelete)
        // Move to details render method
        // Move to details render method
        // Move to details render method
        // const renderOrder = this.registry.getRenderOrder()
        // renderOrder.forEach(type => {
        //   const components = taskObj.getComponents()[type]
        //   const COMPONENTS_ARRAY_EXISTS = typeof components === 'undefined'
        //   if (COMPONENTS_ARRAY_EXISTS) {
        //     return
        //   }

        //   components.forEach(component => {
        //     task.appendChild(component.render())
        //   })
        // })
      })

      const taskAdd = document.createElement('div')
      taskAdd.className = 'add-task'
      taskAdd.textContent = '+'
      taskAdd.addEventListener('click', () => {
        // another reason to make SectionManager class or something similar
        sectionObj.addTask()
        this.render(sections)
      })
      sectionTasks.appendChild(taskAdd)
    })
    const sectionAdd = document.createElement('div')
    sectionAdd.className = 'add-section'
    sectionAdd.textContent = '+'
    sectionAdd.addEventListener('click', () => {
      // another reason to make SectionManager class or something similar
      sections.push(new Section())
      this.render(sections)
    })
    this.container.appendChild(sectionAdd)
  }

  renderDetails() {}
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
