import React from 'react';
import styles from './Section.module.css'
import Task from './Task'


class Section extends React.Component {
  handleChange = (event) => {
    this.props.updateTaskInput(event.target.value);
  }

  render() {
    const tasks = this.props.tasks.map((task, index) =>
      <Task
        key={index}
        index={index}
        text={task}
        onTaskPromote={this.props.onTaskPromote}
        onTaskDemote={this.props.onTaskDemote}
        onTaskRemove={this.props.onTaskRemove}
      />);

    return (
      <div>
        <div className={styles.Section}>
          <h2>{this.props.name}</h2>
          {tasks}
        </div>
        {this.props.hasTaskAdder && <input type='text' value={this.props.taskInput} onChange={this.handleChange}/>}
        {this.props.hasTaskAdder && <button onClick={this.props.onAddTask}>Add task</button>}
      </div>
    );
  }
}

Section.defaultProps = {
  name: 'Section',
  hasTaskAdder: false,
};

export default Section;
