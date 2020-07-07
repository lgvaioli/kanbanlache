import React from 'react';
import styles from './Section.module.css'
import Task from './Task'
import cloneDeep from 'lodash/cloneDeep';


/**
 * Valid section positions.
 */
export const SectionPosition = {
  FIRST: 0,
  MIDDLE: 1,
  LAST: 2,
};


/**
 * Section component. Contains and manages Tasks.
 * 
 * Required props:
 *  - Board (Object): The interface of the board to which this section belongs.
 *  - name (String): The name to display on top of this section.
 *  - tasks (Array of Strings): The tasks this section contains.
 * 
 * Optional props:
 *  - config (Object): An object with the optional configuration of this section. See
 *  Section.defaultProps (in this file) to know the valid config options.
 */
export class Section extends React.Component {
  /**
   * Component constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      // Controlled <input> for adding tasks
      taskInput: '',
    };
  }

  /**
   * Callback called when the "Add task" button is pressed.
   * Adds a task to the section.
   */
  onAddTaskButtonPressed = () => {
    // Tasks can't be empty
    if (this.state.taskInput === '') {
      return alert("You can't add an empty task!");
    }

    // Update section model with a callback passed from above
    this.props.Board.addTask(this.state.taskInput);

    // Reset task input
    this.setState({
      taskInput: '',
    });
  }

  /**
   * Callback called when the "Add task" input changes.
   * Updates the section's state.
   */
  onTaskInputChange = (event) => {
    this.setState({
      taskInput: event.target.value,
    });
  }

  /**
   * Builds tasks widgets.
   * @param {Array} tasks An array of strings representing the tasks.
   */
  buildTasksWidget(tasks) {
    return tasks.map((task, index) => {
      /**
       * Create Section interface dynamically through closure.
       */
      let Section = cloneDeep(this.props.Board);
      Section.onTaskUpdate = (taskText) => this.props.Board.onTaskUpdate(index, taskText);
      Section.onTaskRemove = () => this.props.Board.onTaskRemove(index);
      Section.onTaskDemote = () => this.props.Board.onTaskDemote(index);
      Section.onTaskPromote = () => this.props.Board.onTaskPromote(index);

      // Create Task config
      const taskConfig = {
        editable: this.props.config.position === SectionPosition.FIRST ? true : false,
        removable: true,
        promotable: this.props.config.position !== SectionPosition.LAST ? true : false,
        demotable: this.props.config.position !== SectionPosition.FIRST ? true: false,
      };

      return (
        <Task
          Section={Section}
          key={index}
          text={task}
          config={taskConfig}
        />
      );
    });
  }

  /**
   * Renders component.
   */
  render() {
    let tasksWidget = null;

    // An empty section is valid, so we gotta check this.
    if (this.props.tasks && this.props.tasks.length > 0) {
      tasksWidget = this.buildTasksWidget(this.props.tasks);
    }

    return (
      <div>
        <div className={styles.Section}>
          <h2>{this.props.name}</h2>
          {tasksWidget}
        </div>
        {this.props.config.hasTaskAdder &&
          <input type='text' value={this.state.taskInput} onChange={this.onTaskInputChange}/>}
        {this.props.config.hasTaskAdder &&
          <button onClick={this.onAddTaskButtonPressed}>Add task</button>}
      </div>
    );
  }
}

/**
 * Default props of this component.
 */
Section.defaultProps = {
  config: {
    hasTaskAdder: false,
    position: SectionPosition.MIDDLE,
  },
};

export default Section;
