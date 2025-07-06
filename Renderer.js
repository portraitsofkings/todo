export default class Renderer {
  constructor(container, detailsContainer) {
    this.container = container
    this.detailsContainer = detailsContainer
  }

  render(app) {
    const sectionsData = app.getSections()

    this.container.replaceChildren()

    const sectionsContainer = document.createElement('div')
    sectionsContainer.className = 'sections'
    this.container.appendChild(sectionsContainer)

    sectionsData.forEach((sectionData, sectionId) => {
      // ======================================
      const section = document.createElement('div')
      section.className = 'section'
      sectionsContainer.appendChild(section)
      // ======================================
      const sectionHeader = document.createElement('div')
      sectionHeader.className = 'section__header'

      section.appendChild(sectionHeader)
      // ======================================
      const sectionTitle = document.createElement('h2')
      sectionTitle.textContent = sectionData.title
      sectionTitle.className = 'section__title'
      sectionHeader.appendChild(sectionTitle)

      sectionTitle.addEventListener('click', () => {
        sectionTitle.style.display = 'none'
        const sectionTitleInput = document.createElement('input')
        sectionTitleInput.value = sectionTitle.textContent
        sectionTitle.after(sectionTitleInput)
        sectionTitleInput.focus()

        function stopEdit() {
          if (!sectionTitleInput) return
          sectionData.title = sectionTitleInput.value
          sectionTitle.style.display = 'block'
          sectionTitleInput.remove()
          app.save()
          app.update()
        }

        sectionTitleInput.addEventListener('blur', () => {
          stopEdit()
        })

        sectionTitleInput.addEventListener('keydown', event => {
          if (event.key === 'Enter') {
            sectionTitleInput.blur()
          }
        })
      })
      // ======================================
      const sectionDelete = document.createElement('button')
      sectionDelete.textContent = 'X'
      sectionDelete.className = 'section__delete'
      sectionDelete.addEventListener('click', () => {
        app.removeSection(sectionId)
      })
      sectionHeader.appendChild(sectionDelete)
      // ======================================
      const sectionTasks = document.createElement('div')
      sectionTasks.className = 'section__tasks'
      section.appendChild(sectionTasks)

      sectionTasks.addEventListener('click', event => {
        const clickedElement = event.target
        const taskElement = clickedElement.closest('.task')
        if (taskElement === null) {
          return
        }
        if (clickedElement.classList.contains('task__delete')) {
          return
        }
        const taskId = taskElement.getAttribute('data-id')
        const taskData = sectionData.getTask(taskId)
        this.renderDetails(taskData, app)
      })
      // ======================================
      sectionData
        .getTasks()
        .sort((a, b) => b.priority - a.priority)
        .forEach((taskData, taskId) => {
          const task = document.createElement('div')
          task.className = 'task'
          task.dataset.id = taskId

          switch (taskData.priority) {
            case 1:
              task.classList.add('low-priority')
              break
            case 2:
              task.classList.add('normal-priority')
              break
            case 3:
              task.classList.add('high-priority')
              break
          }

          sectionTasks.appendChild(task)

          const taskTitle = document.createElement('h3')
          taskTitle.className = 'task__title'
          taskTitle.textContent = taskData.title
          task.appendChild(taskTitle)

          const taskDelete = document.createElement('button')
          taskDelete.className = 'task__delete'
          taskDelete.textContent = 'X'
          taskDelete.addEventListener('click', () => {
            app.removeTask(sectionId, taskId)
          })
          task.appendChild(taskDelete)
        })
      const taskAdd = document.createElement('button')
      taskAdd.className = 'task-add'
      taskAdd.textContent = '+ New Task'
      taskAdd.addEventListener('click', () => {
        app.addTask(sectionId)
      })
      sectionTasks.appendChild(taskAdd)
    })

    const sectionAdd = document.createElement('button')
    sectionAdd.className = 'section-add'
    sectionAdd.textContent = '+ New Section'
    sectionAdd.addEventListener('click', () => {
      app.addSection()
    })
    sectionsContainer.appendChild(sectionAdd)
  }

  renderDetails(taskData, app) {
    const dialog = this.detailsContainer
    dialog.replaceChildren()

    const form = document.createElement('form')
    form.setAttribute('method', 'dialog')
    form.className = 'details__form'
    dialog.appendChild(form)

    const titleLabel = document.createElement('label')
    titleLabel.textContent = 'Title:'
    titleLabel.htmlFor = 'title'
    form.appendChild(titleLabel)

    const titleInput = document.createElement('input')
    titleInput.value = taskData.title
    titleInput.id = 'title'
    form.appendChild(titleInput)

    const descriptionLabel = document.createElement('label')
    descriptionLabel.textContent = 'Description:'
    descriptionLabel.htmlFor = 'description'
    form.appendChild(descriptionLabel)

    const descriptionInput = document.createElement('textarea')
    descriptionInput.value = taskData.description
    descriptionInput.id = 'description'
    form.appendChild(descriptionInput)

    const priorityLabel = document.createElement('label')
    priorityLabel.textContent = 'Priority:'
    priorityLabel.htmlFor = 'priority'
    form.appendChild(priorityLabel)

    const priority = document.createElement('select')
    priority.textContent = 'Description:'
    priority.id = 'priority'
    form.appendChild(priority)

    const priorityHigh = document.createElement('option')
    priorityHigh.textContent = 'High'
    priorityHigh.value = '3'
    priority.appendChild(priorityHigh)

    const priorityNormal = document.createElement('option')
    priorityNormal.textContent = 'Normal'
    priorityNormal.value = '2'
    // priorityNormal.selected = true
    priority.appendChild(priorityNormal)

    const priorityLow = document.createElement('option')
    priorityLow.textContent = 'Low'
    priorityLow.value = '1'
    priority.appendChild(priorityLow)

    priority.value = taskData.priority

    const dueDateLabel = document.createElement('label')
    dueDateLabel.textContent = 'Due date:'
    dueDateLabel.htmlFor = 'due-date'
    form.appendChild(dueDateLabel)

    const dueDateInput = document.createElement('input')
    const date = taskData.dueDate
    console.log(taskData)
    dueDateInput.value = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    dueDateInput.type = 'date'
    dueDateInput.id = 'due-date'
    form.appendChild(dueDateInput)

    const cancel = document.createElement('button')
    cancel.textContent = 'Cancel'
    cancel.type = 'button'
    cancel.addEventListener('click', () => {
      dialog.close()
    })
    form.appendChild(cancel)

    const submit = document.createElement('button')
    submit.textContent = 'OK'
    submit.type = 'submit'
    form.appendChild(submit)

    form.addEventListener('submit', () => {
      const newTitle = titleInput.value
      const newDescription = descriptionInput.value
      const newPriority = Number(priority.value)
      let newDueDate = new Date(dueDateInput.value)
      if (newDueDate.toString() === 'Invalid Date') {
        newDueDate = new Date()
      }
      taskData.setTitle(newTitle)
      taskData.setDescription(newDescription)
      taskData.setPriority(newPriority)
      taskData.setDueDate(newDueDate)
      app.save()
      app.update()
    })

    dialog.showModal()
  }
}
