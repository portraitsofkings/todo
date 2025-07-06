import SectionManager from './SectionManager.js'
import Renderer from './Renderer.js'

export default class App {
  constructor(container, detailsContainer) {
    this.manager = new SectionManager()
    this.renderer = new Renderer(container, detailsContainer)
    this.load()
    this.update()
  }

  load() {
    const sectionsString = localStorage.getItem('sections')
    const sections = JSON.parse(sectionsString)
    if (sections === null) {
      // Default data
      this.addSection('Default section')
      this.addTask(0, {
        title: 'Normal',
        description: "This is the first\ntask's description",
      })
      return
    }
    sections.forEach(section => {
      const tasks = section.tasks
      const sectionObj = this.manager.addSection(section.title)
      tasks.forEach(task => {
        sectionObj.addTask(task)
      })
    })
  }

  save() {
    const sections = [...this.manager.toJSON()]
    localStorage.setItem('sections', JSON.stringify(sections))
  }

  update() {
    this.renderer.render(this)
  }

  addSection(title) {
    this.manager.addSection(title)
    this.save()
    this.update()
  }

  removeSection(sectionId) {
    this.manager.removeSection(sectionId)
    this.save()
    this.update()
  }

  addTask(sectionId, taskData) {
    this.manager.addTask(sectionId, taskData)
    this.save()
    this.update()
  }

  removeTask(sectionId, taskId) {
    this.manager.removeTask(sectionId, taskId)
    this.save()
    this.update()
  }

  getTask(sectionId, taskId) {
    this.manager.getTask(sectionId, taskId)
  }

  getSections() {
    return this.manager.getSections()
  }
}
