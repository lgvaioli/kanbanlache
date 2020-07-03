import React from 'react';
import styles from './Board.module.css'
import Section from './Section';

/** 
 * Adjust this variable to increase/decrease the gap between sections.
 */
const SECTIONS_GAP = 4;

/**
 * Board component. Contains and manages Sections and their Tasks. 
 * 
 * Props:
 *  - name (String): Optional. A name to display atop the Board. Defaults to 'Board'.
 *  - sectionNames (Array of Strings): Required. The names of the sections this board contains.
 */
class Board extends React.Component {
  constructor(props) {
    super(props);

    // Create and initialize empty 2D array.
    const tasks = new Array(props.sectionNames.length);
    for (let i = 0; i < tasks.length; i++) {
      tasks[i] = [];
    }

    // Create array of empty strings.
    const taskInput = new Array(props.sectionNames.length).fill('');

    this.state = {
      // Array of sections tasks. tasks[0] are the tasks of the first (left-most)
      // section, tasks[1] are the tasks of the second section, and so on.
      // tasks[0][0] is the first task of the first section.
      tasks: tasks,

      // Tasks inputs, taskInput[0] is the <input>'s value of the first section and so on.
      taskInput: taskInput,
    };
  }

  onAddTask = (sectionIndex) => {
    const tasks = this.state.tasks.slice();
    tasks[sectionIndex].push(this.state.taskInput[sectionIndex]);

    const taskInput = this.state.taskInput.slice();
    taskInput[sectionIndex] = '';

    this.setState({
      tasks: tasks,
      taskInput: taskInput,
    });
  }

  onTaskPromote = (sectionIndex, taskIndex) => {
    // Can't promote tasks of the last section
    if (sectionIndex === this.props.sectionNames.length - 1) {
      return;
    }

    const tasks = this.state.tasks.slice();
    const promotedTask = tasks[sectionIndex][taskIndex];
    tasks[sectionIndex].splice(taskIndex, 1);
    tasks[sectionIndex + 1].push(promotedTask);

    this.setState({
      tasks: tasks,
    });
  }

  onTaskDemote = (sectionIndex, taskIndex) => {
    // Can't demote tasks of the first section
    if (sectionIndex === 0) {
      return;
    }

    const tasks = this.state.tasks.slice();
    const demotedTask = tasks[sectionIndex][taskIndex];
    tasks[sectionIndex].splice(taskIndex, 1);
    tasks[sectionIndex - 1].push(demotedTask);

    this.setState({
      tasks: tasks,
    });
  }

  onTaskRemove = (sectionIndex, taskIndex) => {
    const tasks = this.state.tasks.slice();
    tasks[sectionIndex].splice(taskIndex, 1);

    this.setState({
      tasks: tasks,
    });
  }

  // Callback used by Sections to update their taskInputs.
  updateTaskInput = (sectionIndex, value) => {
    const taskInput = this.state.taskInput.slice();
    taskInput[sectionIndex] = value;
    this.setState({
      taskInput: taskInput,
    });
  }

  /**
   * Builds sections from an array of names (strings).
   * @param {Array} sectionNames An array of strings which are the names of the sections.
   * @returns An HTML object with the sections, where only the first section has a
   * 'task adder' (i.e. a text input and a button for adding a task).
   */
  buildSections(sectionNames) {
    // Calculate width (percentage) dynamically and set it with inline CSS.
    const sectionWidth = (100 / sectionNames.length) - SECTIONS_GAP;

    const sectionsContainer = sectionNames.map((name, index) =>
      <div key={name} style={{ width: `${sectionWidth.toString()}%`, }}>
        <Section
          name={name}
          tasks={this.state.tasks[index]}
          hasTaskAdder={index === 0}
          taskInput={this.state.taskInput[index]}
          updateTaskInput={(value) => this.updateTaskInput(index, value)}
          onAddTask={() => this.onAddTask(index)}
          onTaskPromote={(taskIndex) => this.onTaskPromote(index, taskIndex)}
          onTaskDemote={(taskIndex) => this.onTaskDemote(index, taskIndex)}
          onTaskRemove={(taskIndex) => this.onTaskRemove(index, taskIndex)}
        />
      </div>);

    return sectionsContainer;
  }

  render() {
    const sections = this.buildSections(this.props.sectionNames);

    const sectionsContainerLayout = {
      display: 'flex',
      justifyContent: 'space-around',
    };

    const sectionsContainer = <div style={sectionsContainerLayout}>{sections}</div>

    return (
      <div className={styles.Board}>
        <h2>{this.props.name}</h2>
        {sectionsContainer}
      </div>
    );
  }
}

export default Board;
