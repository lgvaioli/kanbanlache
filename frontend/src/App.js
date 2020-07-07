import React from 'react';
import styles from './App.module.css';
import Board from './Board';
import axios from 'axios';


const APP_NAME = 'Kanbanlache';
const BASE_URL = window.location.href;

const AppUrls = {
  LOGOUT: `${BASE_URL}accounts/logout`,
  LOGOUT_SUCCESS_REDIRECT: BASE_URL,
  BOARD: `${BASE_URL}board/`,
};


/**
 * App component. Contains and manages a Board, including communication
 * with the backend.
 * 
 * Props: This component has no props.
 */
class App extends React.Component {
  /**
   * Component constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      board: '',
      sections: [],
    };

    /**
     * Interface this component offers to its children.
     */
    this.App = {
      addTask: this.addTask,
      onTaskPromote: this.onTaskPromote,
      onTaskDemote: this.onTaskDemote,
      onTaskRemove: this.onTaskRemove,
      onTaskUpdate: this.onTaskUpdate,
    };
  }

  /**
   * Logouts user and redirects him to the login page.
   */
  onLogout = () => {
    axios
      .get(AppUrls.LOGOUT)
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
        window.location.replace(AppUrls.LOGOUT_SUCCESS_REDIRECT);
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
      .get(AppUrls.BOARD)
      .then((res) => {
        /**
         * res.data layout:
         * {
         *    board: 'Board name',
         *    sections: [
         *      {
         *        name: 'First section',
         *        tasks: ['first task', ..., 'last task']
         *      },
         *      ...
         *      {
         *        name: 'Last section',
         *        tasks: ['first task', ..., 'last task']
         *      }
         *    ]
         * }
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

  /**
   * Renders component.
   */
  render() {
    return (
      <div className={styles.App}>
        <button onClick={this.onLogout}>Logout</button>
        <h1>{APP_NAME}</h1>
        <Board
          App={this.App}
          name={this.state.board}
          sections={this.state.sections}
        />
      </div>
    );
  }
}

export default App;
