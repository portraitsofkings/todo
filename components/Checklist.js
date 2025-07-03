export default class Checklist {
  constructor({ title = 'Checklist', items = [] }, update) {
    this.title = title
    this.items = items
    this.update = update
  }

  setTitle(newTitle) {
    this.title = newTitle
  }

  addItem(name, checked) {
    this.items.push({ name, checked })
    this.update()
  }

  removeItem(itemId) {
    this.items.splice(itemId, 1)
    this.update()
  }

  render() {
    const component = document.createElement('div')
    component.className = 'checklist'

    const title = document.createElement('h2')
    title.textContent = this.title
    title.className = 'checklist__title'
    component.appendChild(title)

    const itemContainer = document.createElement('div')
    itemContainer.className = 'checklist__items'
    this.items.forEach(itemObj => {
      const text = document.createElement('p')
      text.textContent = itemObj.name
      itemContainer.appendChild(text)

      const checkbox = document.createElement('input')
      checkbox.setAttribute('type', 'checkbox')
      checkbox.checked = itemObj.checked
      itemContainer.appendChild(checkbox)
    })
    component.appendChild(itemContainer)

    return component
  }
}
