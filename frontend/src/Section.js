import React from 'react';
import styles from './Section.module.css'
import Task from './Task'
import cloneDeep from 'lodash/cloneDeep';


/**
 * Task text max length.
 * 
 * FIXME: Maybe we should pick this up from a common backend/frontend
 * config file.
 */
const TASK_TEXT_MAXLENGTH = 250;

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
 *  - model (Object): An object { id, name } representing the model of this Section.
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
      textareaValue: '',

      // Characters left counter
      charsLeft: TASK_TEXT_MAXLENGTH,
    };
  }

  /**
   * Callback called when the "Add task" button is pressed.
   * Adds a task to the section.
   */
  onAddTaskButtonPressed = () => {
    // Tasks can't be empty
    if (this.state.textareaValue === '') {
      return alert("You can't add an empty task!");
    }

    // Update section model
    this.props.Board.addTask(this.state.textareaValue,
      () => {
        // Success callback: Reset task input and chars left counter
        this.setState({
          textareaValue: '',
          charsLeft: TASK_TEXT_MAXLENGTH,
        });
      },
      () => {
        // Failure callback: Do nothing
      });
  }

  /**
   * Callback called when the "Add task" input changes.
   * Updates the section's state.
   */
  onTextareaValueChange = (event) => {
    const textareaValue = event.target.value;
    const charsLeft = TASK_TEXT_MAXLENGTH - textareaValue.length;

    this.setState({
      textareaValue: textareaValue,
      charsLeft: charsLeft,
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
          key={task.id}
          model={task}
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
          <h2>{this.props.model.name}</h2>
          {tasksWidget}
        </div>
          {this.props.config.hasTaskAdder &&
            <div className={styles.TaskAdder}>
              <span>{this.state.charsLeft} characters left</span>
              <textarea onChange={this.onTextareaValueChange} value={this.state.textareaValue} maxLength={TASK_TEXT_MAXLENGTH} />
              <button className={styles.AddTaskBtn} onClick={this.onAddTaskButtonPressed}>Add task</button>
            </div>
          }
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
