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
        onTaskUpdate={this.props.onTaskUpdate}
        editable={this.props.taskEditable}
        removable={this.props.taskRemovable}
        promotable={this.props.taskPromotable}
        demotable={this.props.taskDemotable}
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
