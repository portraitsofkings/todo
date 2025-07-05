import SectionManager from './SectionManager.js'
import Renderer from './Renderer.js'

export default class App {
  constructor(container, detailsContainer) {
    this.manager = new SectionManager()
    this.renderer = new Renderer(container, detailsContainer)
  }

  update() {
    this.renderer.render(this)
  }

  addSection(title) {
    // data.onChange = () => {
    //   this.renderer.render(this)
    // }
    this.manager.addSection(title)
    this.update()
  }

  addTask(sectionId, taskData) {
    // data.onChange = () => {
    //   this.renderer.render(this)
    // }
    this.manager.addTask(sectionId, taskData)
    this.update()
  }

  getTask(sectionId, taskId) {
    this.manager.getTask(sectionId, taskId)
  }

  getSections() {
    return this.manager.getSections()
  }
}
