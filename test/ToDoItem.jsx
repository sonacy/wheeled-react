import React from '../src'
import './ToDoList.css'

class ToDoItem extends React.Component {

  inputRef = React.createRef()

  state = {
    edit: false
  }

  handleChange = e => {
    console.log(e.target.value)
  }

  showEdit = (e) => {
    if (!this.state.edit) {
      this.setState({
        edit: true
      }, () => {
        this.inputRef.current.focus()
      })
    }
  }

  toggleComplete = (e) => {
    const item = Object.assign({}, this.props.item, {
      isCompleted: !this.props.item.isCompleted
    })
    this.props.changeItem(item)
  }

  deleteItem = (e) => {
    this.props.delItem(this.props.item.id)
  }

  stop = e => {
    e.stopPropagation()
  }

  handleSubmit = e => {
    const value = e.target.value
    if (value && value !== this.props.item.value) {
      const item = Object.assign({}, this.props.item, {
        value
      })

      this.setState({
        edit: false
      }, () => {
        this.props.changeItem(item)
      })
    } else {
      this.setState({
        edit: false
      })
    }
  }

  handleEnter = e => {
    if (e.keyCode === 13) {
      this.handleSubmit(e)
    }
  }

  render() {
    const {item} = this.props
    const {edit} = this.state
    return (
      <li className={item.isCompleted ? 'completed' : edit ? 'editing' : ''}>
        <div className="view" onDoubleClick={this.showEdit}>
          <input checked={item.isCompleted} onDoubleClick={this.stop} onChange={this.toggleComplete} className="toggle" type="checkbox" />
          <label>{item.value}</label>
          <button onDoubleClick={this.stop} className="destroy" onClick={this.deleteItem}></button>
        </div>
        <input ref={this.inputRef} onKeyUp={this.handleEnter} onBlur={this.handleSubmit} className="edit" defaultValue={item.value} />
      </li>
    )
  }
}

export default ToDoItem
