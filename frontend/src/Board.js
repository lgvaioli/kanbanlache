import React from 'react';
import styles from './Board.module.css'
import Section from './Section';

class Board extends React.Component {
  constructor(props) {
    super(props);

    // Create and initialize empty 2D array.
    const tasks = new Array(props.sections.length);
    for (let i = 0; i < tasks.length; i++) {
      tasks[i] = [];
    }

    this.state = {
      // Array of sections tasks. tasks[0] are the tasks of the first (left-most)
      // section, tasks[1] are the tasks of the second section, and so on.
      // tasks[0][0] is the first task of the first section.
      tasks: tasks,

      // Tasks inputs, taskInput[0] is the <input>'s value of the first section and so on.
      taskInput: [],
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

  // Callback used by Sections to update their taskInputs.
  updateTaskInput = (sectionIndex, value) => {
    const taskInput = this.state.taskInput.slice();
    taskInput[sectionIndex] = value;
    this.setState({
      taskInput: taskInput,
    });
  }

  render() {
    // Calculate width dynamically and set it with inline CSS.
    // The "- 4" is just so the sections don't take the whole horizontal width.
    const widthNum = (100 / this.props.sections.length) - 4;

    const sections = this.props.sections.map((sectionName, index) =>
      <div style={{ width: `${widthNum.toString()}%`, }}>
        <Section
          name={sectionName}
          tasks={this.state.tasks[index]}
          taskInput={this.state.taskInput[index]}
          updateTaskInput={(value) => this.updateTaskInput(index, value)}
          onAddTask={() => this.onAddTask(index)}
        />
      </div>);

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
