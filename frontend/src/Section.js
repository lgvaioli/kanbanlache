import React from 'react';
import styles from './Section.module.css'
import Task from './Task'

/**
 * Section component. Contains Tasks.
 * 
 * Props:
 *  - name (String): Optional. A name to display atop the Section. Defaults to 'Section'.
 *  - tasks (Array of Strings): Required. The tasks this Section contains.
 *  - hasTaskAdder (Boolean): Optional. Whether this section has a controlled input and button to
 * add a task. Defaults to false.
 *  - taskInput (String): Required. The string which represents the value of the controlled input.
 *  - updateTaskInput (Callback): Required. Callback of the form (value) => { } which is called when
 * the controlled input is updated.
 *  - onAddTask (Callback): Required. Callback of the form () => { } which is called when the "Add task"
 * button is clicked.
 * 
 *  The following props are just drilling for Task.
 * 
 *  - onTaskPromote (Callback): Required. Callback of the form (taskIndex) => { } which is passed on
 * to Tasks.
 *  - onTaskDemote (Callback): Required. Callback of the form (taskIndex) => { } which is passed on
 * to Tasks.
 *  - onTaskRemove (Callback): Required. Callback of the form (taskIndex) => { } which is passed on
 * to Tasks.
 *  - onTaskUpdate (Callback): Required. Callback of the form (taskIndex, text) => { } which is passed on
 * to Tasks.
 *  - taskEditable (Boolean): Optional. Indicates whether the Tasks in this Section are editable.
 *  - taskRemovable (Boolean): Optional. Indicates whether the Tasks in this section are removable.
 *  - taskPromotable (Boolean): Optional. Indicates whether the Tasks in this section are promotable.
 *  - taskDemotable (Boolean): Optional. Indicates whether the Tasks in this section are demotable.
 */
class Section extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Controlled <input> for adding tasks
      taskInput: '',
    };
  }

  onAddTaskButtonPressed = () => {
    // Tasks can't be empty
    if (this.state.taskInput === '') {
      return alert("You can't add an empty task!");
    }

    // Update section model with a callback passed from above
    this.props.addTask(this.state.taskInput);

    // Reset task input
    this.setState({
      taskInput: '',
    });
  }

  onTaskInputChange = (event) => {
    this.setState({
      taskInput: event.target.value,
    });
  }

  buildTasksWidget(tasks) {
    return tasks.map((task, index) =>
      <Task
        key={index}
        index={index}
        text={task}
        onTaskPromote={this.props.onTaskPromote}
        onTaskDemote={this.props.onTaskDemote}
        onTaskRemove={this.props.onTaskRemove}
        onTaskUpdate={this.props.onTaskUpdate}
        editable={this.props.taskEditable}
        removable={this.props.taskRemovable}
        promotable={this.props.taskPromotable}
        demotable={this.props.taskDemotable}
      />);
  }

  render() {
    let tasksWidget = null;

    if (this.props.tasks && this.props.tasks.length > 0) {
      tasksWidget = this.buildTasksWidget(this.props.tasks);
    }

    return (
      <div>
        <div className={styles.Section}>
          <h2>{this.props.name}</h2>
          {tasksWidget}
        </div>
        {this.props.hasTaskAdder && <input type='text' value={this.state.taskInput} onChange={this.onTaskInputChange}/>}
        {this.props.hasTaskAdder && <button onClick={this.onAddTaskButtonPressed}>Add task</button>}
      </div>
    );
  }
}

Section.defaultProps = {
  name: 'Section',
  hasTaskAdder: false,
};

export default Section;
