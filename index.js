import App from './App.js'
// import Checklist from './components/Checklist.js'

const app = new App(
  document.querySelector('.container'),
  document.querySelector('.details')
)

app.addSection('Default section')

app.addTask(0, {
  title: 'Normal',
  description: "This is the first\ntask's description",
})

// app.addTaskComponent(0, 0, {
//   type: 'checklist',
//   component: new Checklist('Checklist'),
// })

app.addTask(0, {
  title: 'Low priority',
  description: 'I have low priority',
  priority: 1,
})

app.addTask(0, {
  title: 'High priority',
  description: 'I have high priority',
  priority: 3,
})
