import React from 'react';
import styles from './Section.module.css'
import Task from './Task'


class Section extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange = (event) => {
    this.props.updateTaskInput(event.target.value);
  }

  render() {
    const tasks = this.props.tasks.map((el) => <Task text={el}/>)

    return (
      <div>
        <div className={styles.Section}>
          <h2>{this.props.name}</h2>
          {tasks}
        </div>
        <input type='text' value={this.props.taskInput} onChange={this.handleChange}/>
        <button onClick={this.props.onAddTask}>Add task</button>
      </div>
    );
  }
}

export default Section;
