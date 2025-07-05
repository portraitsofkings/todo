export default class Checklist {
  constructor({ title = 'Checklist', items = [] }, update) {
    this.title = title
    this.items = items
    this.update = update
  }

  setTitle(newTitle) {
    this.title = newTitle
  }

  addItem(name = 'Untitled', checked = false) {
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

    const itemsContainer = document.createElement('div')
    itemsContainer.className = 'checklist__items'
    this.items.forEach(itemObj => {
      const item = document.createElement('div')
      item.className = 'checklist__item'
      itemsContainer.appendChild(item)

      const checkbox = document.createElement('input')
      checkbox.setAttribute('type', 'checkbox')
      checkbox.checked = itemObj.checked
      checkbox.addEventListener('change', () => {
        itemObj.checked = checkbox.checked
      })
      item.appendChild(checkbox)

      const text = document.createElement('p')
      text.textContent = itemObj.name
      item.appendChild(text)
    })
    const addItem = document.createElement('button')
    addItem.textContent = '+ New Item'
    addItem.addEventListener('click', () => {
      this.addItem()
    })
    itemsContainer.appendChild(addItem)

    component.appendChild(itemsContainer)

    return component
  }
}
