import App from './App.js'

const app = new App(document.querySelector('body'))
app.addSection('Section 0')
app.addTask(0, 'Task 0-0')
app.addTask(0, 'Task 0-1')
app.addSection('Section 1')
app.addTask(1, 'Task 1-0')
app.addTask(1, 'Task 1-1')

/**
 * Example of how to use addTaskComponent
 * @param {number} sectionId  - Section ID
 * @param {number} taskId  - Task ID
 * @param {string} type - Component type
 * @param {Object} [options] - Component specific options
 * @returns {Object} Created component
 */
const defaultChecklist = app.addTaskComponent(0, 0, 'checklist', {
  title: 'Title',
  items: [
    { name: 'Item 1', checked: true },
    { name: 'Item 2', checked: false },
  ],
})

defaultChecklist.addItem('Item 3', false)

// use to get the component
// app.getTaskComponent(0, 0, 'checklist', 0)

// expose for testing
window.app = app
