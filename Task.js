export default class Task {
  constructor({
    title = 'Untitled',
    description = '',
    priority = 2,
    dueDate = new Date(),
  }) {
    this.title = title
    this.description = description
    this.priority = priority
    this.dueDate = new Date(dueDate)
  }

  setTitle(newTitle) {
    this.title = newTitle
  }

  setDescription(newDescription) {
    this.description = newDescription
  }

  setPriority(newPriority) {
    this.priority = newPriority
  }

  setDueDate(newDueDate) {
    this.dueDate = newDueDate
  }

  update({ title, description, components }) {
    if (title !== undefined) {
      this.title = title
    }
    if (description !== undefined) {
      this.description = description
    }
    if (components !== undefined) {
      this.components = components
    }
  }
}
