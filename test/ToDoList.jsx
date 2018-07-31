import React from '../src'
import { getList, updateItem } from './ToDoAsync'
import ToDoItem from './ToDoItem.jsx'
import './ToDoList.css'

const getHashType = () => {
  const hash = window.location.hash
  if (hash === '#/active') return 'active'
  else if (hash === '#/completed') return 'completed'
  else return 'all'
}

class ToDoList extends React.Component {

  state = {
    list: [],
    currentValue: '',
    isAllCompleted: false,
    type: getHashType()
  }

  toggleComplete = (e) => {
    const list = this.state.list.slice()
    list.forEach(item => {
      item.isCompleted = !this.state.isAllCompleted
    })
    updateItem(list).then(res => {
      if (res.code === 0) {
        this.setState({
          list,
          isAllCompleted: !this.state.isAllCompleted,
        })
      }
    })
  }

  handleAdd = (e) => {
    const value = e.target.value
    if (e.keyCode === 13 && value) {
      const list = this.state.list.slice()
      let maxId = list.length > 0 ? list[0].id : 0
      list.forEach(item => {
        if (item.id > maxId) maxId = item.id
      })
      const item = {
        id: maxId + 1,
        value: value,
        isCompleted: false
      }
      list.push(item)

      updateItem(list).then(res => {
        if (res.code === 0) {
          let isAllCompleted = this.checkForAllCompleted(list)
          this.setState({
            list,
            isAllCompleted,
            currentValue: ''
          })
        }
      })
    }
  }

  handleChange = e => {
    this.setState({
      currentValue: e.target.value
    })
  }

  checkForAllCompleted(list) {
    let isAllCompleted = (list && list.length > 0) ? true : false
    list.forEach(item => {
      if (!item.isCompleted) isAllCompleted = false
    })
    return isAllCompleted
  }

  changeItem = item => {
    const list = this.state.list.slice()
    const index = list.findIndex(i => i.id === item.id)
    list.splice(index, 1, item)


    updateItem(list).then(res => {
      if (res.code === 0) {
        let isAllCompleted = this.checkForAllCompleted(list)
        this.setState({
          list,
          isAllCompleted
        })
      }
    })
  }

  delItem = id => {
    const list = this.state.list.slice()
    const index = list.findIndex(i => i.id === id)
    list.splice(index, 1)

    updateItem(list).then(res => {
      if (res.code === 0) {
        let isAllCompleted = this.checkForAllCompleted(list)
        this.setState({
          list,
          isAllCompleted
        })
      }
    })
  }

  deleteCompleted = () => {
    const list = this.state.list.filter(item => !item.isCompleted)

    updateItem(list).then(res => {
      if (res.code === 0) {
        let isAllCompleted = this.checkForAllCompleted(list)
        this.setState({
          list,
          isAllCompleted
        })
      }
    })
  }

  componentDidMount() {
    getList().then(res => {
      if (res.code === 0) {
        let isAllCompleted = this.checkForAllCompleted(res.data)
        this.setState({
          list: res.data,
          isAllCompleted
        })
      }
    })
    window.onhashchange = (e) => {
      const oldType = this.state.type
      const newType = getHashType()
      if (oldType !== newType) {
         this.setState({
           type: newType
         })
      }
    }
  }

  render() {
    const type = this.state.type

    const allList = this.state.list.slice()
    const activeList = allList.filter(item => !item.isCompleted)
    const completedList = allList.filter(item => item.isCompleted)

    const len = allList.length
    const activeCount = activeList.length
    const hasCompleted = completedList.length > 0

    let list = allList
    if (type === 'active') {
      list = activeList
    } else if (type === 'completed') {
      list = completedList
    }
    return (
      <div>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <input value={this.state.currentValue} onChange={this.handleChange} onKeyUp={this.handleAdd} className="new-todo" placeholder="What needs to be done?" autoFocus />
          </header>
          {
            len > 0 &&
            <section className="main">
              <input checked={this.state.isAllCompleted} onChange={this.toggleComplete} id="toggle-all" className="toggle-all" type="checkbox" />
              <label htmlFor="toggle-all">Mark all as complete</label>
              <ul className="todo-list">
                {
                  list.map(item => <ToDoItem key={item.id} item={item} changeItem={this.changeItem} delItem={this.delItem} />)
                }
              </ul>
            </section>
          }
          {
            len > 0 &&
            <footer className="footer">
              <span className="todo-count"><strong>{activeCount}</strong> item{activeCount > 1 && 's'} left</span>
              <ul className="filters">
                <li>
                  <a className={type === 'all' ? 'selected' : ''} href="#/">All</a>
                </li>
                <li>
                  <a className={type === 'active' ? 'selected' : ''} href="#/active">Active</a>
                </li>
                <li>
                  <a className={type === 'completed' ? 'selected' : ''} href="#/completed">Completed</a>
                </li>
              </ul>
              {
                hasCompleted && <button onClick={this.deleteCompleted} className="clear-completed">Clear completed</button>
              }
            </footer>
          }
        </section>
        <footer className="info">
          <p>Double-click to edit a todo</p>
          <p>Created by <a href="http://github.com/sonacy">sonacy</a></p>
          <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
      </div>
    )
  }
}

export default ToDoList
