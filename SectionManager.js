import Section from './Section.js'
export default class SectionManager {
  #sections = []

  addSection(title) {
    const section = new Section(title)
    this.#sections.push(section)
    return section
  }

  removeSection(sectionId) {
    this.#sections.splice(sectionId, 1)
  }

  getSection(sectionId) {
    const section = this.#sections[sectionId]
    return section
      ? section
      : console.error(
          `SectionManager:getSection: Incorrect sectionId '${sectionId}'`
        )
  }

  toJSON() {
    const sections = []
    this.#sections.forEach(section => {
      sections.push(section.toJSON())
    })
    return sections
  }

  getSections() {
    return this.#sections
  }

  addTask(sectionId, taskData) {
    const section = this.getSection(sectionId)
    return section
      ? section.addTask(taskData)
      : console.error('SectionManager:addTask: Incorrect sectionId', taskData)
  }

  removeTask(sectionId, taskId) {
    const section = this.getSection(sectionId)
    return section.removeTask(taskId)
  }

  getTask(sectionId, taskId) {
    const section = this.getSection(sectionId)
    const task = section.getTask(taskId)

    return task
  }
}
