import Section from './Section.js'
export default class SectionManager {
  #sections = []

  addSection(title) {
    // const onChange = data.onChange
    this.#sections.push(new Section(title))
    // onChange()
  }

  getSection(sectionId) {
    const section = this.#sections[sectionId]
    return section
      ? section
      : console.error(
          `SectionManager:getSection: Incorrect sectionId '${sectionId}'`
        )
  }

  getSections() {
    // FIXME: return copy of this?
    return this.#sections
  }

  addTask(sectionId, taskData) {
    const section = this.getSection(sectionId)
    return section
      ? section.addTask(taskData)
      : console.error('SectionManager:addTask: Incorrect sectionId', taskData)
  }

  getTask(sectionId, taskId) {
    const section = this.getSection(sectionId)
    const task = section.getTask(taskId)

    return task
  }
}
