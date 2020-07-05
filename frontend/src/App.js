import React from 'react';
import styles from './App.module.css';
import Board from './Board';
import axios from 'axios';


const BASE_URL = window.location.href;
const LOGOUT_URL = `${BASE_URL}accounts/logout`;
const LOGOUT_SUCCESS_REDIRECT_URL = BASE_URL;
const BOARD_URL = `${BASE_URL}board/`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Board name
      board: '',

      /**
       * Sections. An array of the form
       * [
       *  { name: 'first section', tasks: ['task 1', ..., 'last task'] },
       *  ...
       *  { name: 'last section', tasks: ['task 1', ..., 'last task'] }
       * ]
       */
      sections: [],
    };
  }

  /**
   * Logout button callback. Redirects to the login page.
   */
  onLogout = () => {
    axios
      .get(LOGOUT_URL)
      .then(() => {
        /**
         * I know this is a hack, but look, the alternative is overriding django's auth default
         * behavior, basically copy-and-pasting it but slightly modifying it so instead of returning
         * a stupid 200 (OK) with data, it returns a 301 (redirect) with data pointing to the right
         * URL as configured in backend/backend/settings.py. I think that's FAR worse than just
         * manually "redirecting" here by changing the window location. This URL doesn't even need
         * to be hardcoded: The program can be eventually refactored so that both this file (App.js)
         * and backend/backend/settings.py read the LOGOUT_REDIRECT_URL variable from some common
         * config file.
         */
        window.location.replace(LOGOUT_SUCCESS_REDIRECT_URL);
      })
      .catch((err) => {
        alert(`Error while logging out: ${err.message}`);
      });
  }

  /**
   * Promotes (moves to the next section) a task.
   * @param {Integer} sectionIndex The index of the section where the task to be promoted currently lives.
   * @param {Integer} taskIndex The index of the task to be promoted.
   */
  onTaskPromote = (sectionIndex, taskIndex) => {
    // Can't promote tasks of the last section
    if (sectionIndex === this.state.sections.length - 1) {
      return;
    }

    // Get copy of sections to enforce data immutability
    const sections = this.state.sections.slice();

    // Get task which will be promoted
    const promotedTask = sections[sectionIndex].tasks[taskIndex];

    // Remove promoted task from its previous section
    sections[sectionIndex].tasks.splice(taskIndex, 1);

    // Add promoted task to its new section
    sections[sectionIndex + 1].tasks.push(promotedTask);

    // Update state
    this.setState({
      sections: sections,
    });
  }

  /**
   * Demotes (moves to the previous section) a task.
   * @param {Integer} sectionIndex The index of the section where the task to be demoted currently lives.
   * @param {Integer} taskIndex The index of the task to be demoted.
   */
  onTaskDemote = (sectionIndex, taskIndex) => {
    // Can't demote tasks of the first section
    if (sectionIndex === 0) {
      return;
    }

    // Get copy of sections to enforce data immutability
    const sections = this.state.sections.slice();

    // Get task which will be demoted
    const demotedTask = sections[sectionIndex].tasks[taskIndex];

    // Remove demoted task from its previous section
    sections[sectionIndex].tasks.splice(taskIndex, 1);

    // Add demoted task to its new section
    sections[sectionIndex - 1].tasks.push(demotedTask);

    // Update state
    this.setState({
      sections: sections,
    });
  }

  /**
   * Removes a task.
   * @param {Integer} sectionIndex The index of the section where the task to be removed currently lives.
   * @param {Integer} taskIndex The index of the task to be removed.
   */
  onTaskRemove = (sectionIndex, taskIndex) => {
    // Show confirm dialogue first
    if (!window.confirm('Are you sure you want to remove this task?')) {
      return;
    }

    // Get copy of sections to enforce data immutability
    const sections = this.state.sections.slice();

    // Remove task
    sections[sectionIndex].tasks.splice(taskIndex, 1);

    // Update state
    this.setState({
      sections: sections,
    });
  }

  /**
   * Updates the text of a task.
   * @param {Integer} sectionIndex The index of the section where the task to be updated currently lives.
   * @param {Integer} taskIndex The index of the task to be updated.
   * @param {String} text New text.
   */
  onTaskUpdate = (sectionIndex, taskIndex, text) => {
    // Get copy of sections to enforce data immutability
    const sections = this.state.sections.slice();

    // Update task
    sections[sectionIndex].tasks[taskIndex] = text;

    // Update state
    this.setState({
      sections: sections,
    });
  }

  /**
   * Adds a task to the model.
   * @param {Integer} sectionIndex Index of the section where the task will be added.
   * @param {String} taskText Text of the task to be added.
   */
  addTask = (sectionIndex, taskText) => {
    const sections = this.state.sections.slice();
    sections[sectionIndex].tasks.push(taskText);

    this.setState({
      sections: sections,
    });
  }

  /**
   * Initializes Board with AJAX data.
   */
  componentDidMount() {
    axios
      .get(BOARD_URL)
      .then((res) => {
        /**
         * res.data =
         *  {
         *    'boardName': 'Awesome Board Name',
         *    'sectionNames': ['TODO', 'DOING', 'DONE'],
         *    'taskTexts': [ ['TODO', 'program stuff'], ['DOING', 'testing stuff'] ]
         *  }
         */
        this.setState({
          board: res.data.board,
          sections: res.data.sections,
        });
      })
      .catch((err) => {
        alert(`Error while getting board data: ${err.message}`);
      });
  }

  render() {
    return (
      <div className={styles.App}>
        <button onClick={this.onLogout}>Logout</button>
        <h1>Kanbanlache</h1>
        <Board
          name={this.state.board}
          sections={this.state.sections}
          addTask={this.addTask}
          onTaskPromote={this.onTaskPromote}
          onTaskDemote={this.onTaskDemote}
          onTaskRemove={this.onTaskRemove}
          onTaskUpdate={this.onTaskUpdate}
        />
      </div>
    );
  }
}

export default App;
