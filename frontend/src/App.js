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

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';


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
      boardModel: {
        id: -1,
        name: '',
      },
      sectionModels: [],
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
    if (sectionIndex === this.state.sectionModels.length - 1) {
      return;
    }

    // Get copy of sections to enforce data immutability
    const sectionModelsNew = this.state.sectionModels.slice();

    // Get task which will be promoted
    const promotedTask = sectionModelsNew[sectionIndex].tasks[taskIndex];

    // Remove promoted task from its previous section
    sectionModelsNew[sectionIndex].tasks.splice(taskIndex, 1);

    // Add promoted task to its new section
    sectionModelsNew[sectionIndex + 1].tasks.push(promotedTask);

    // Update state
    this.setState({
      sectionModels: sectionModelsNew,
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
    const sectionModelsNew = this.state.sectionModels.slice();

    // Get task which will be demoted
    const demotedTask = sectionModelsNew[sectionIndex].tasks[taskIndex];

    // Remove demoted task from its previous section
    sectionModelsNew[sectionIndex].tasks.splice(taskIndex, 1);

    // Add demoted task to its new section
    sectionModelsNew[sectionIndex - 1].tasks.push(demotedTask);

    // Update state
    this.setState({
      sectionModels: sectionModelsNew,
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
    const sectionModelsNew = this.state.sectionModels.slice();

    // Remove task
    sectionModelsNew[sectionIndex].tasks.splice(taskIndex, 1);

    // Update state
    this.setState({
      sectionModels: sectionModelsNew,
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
    const sectionModelsNew = this.state.sectionModels.slice();

    // Update task.
    /**
     * FIXME: I don't like how I gotta know the details of Section/Task models
     * to do this stuff here. I mean, App shouldn't in principle be concerned about
     * those kind of details. I think I'm conflating the models/views and should
     * probably separate them in a cleaner way, but for now this comment will
     * have to be enough.
     */
    sectionModelsNew[sectionIndex].tasks[taskIndex].text = text;

    // Update state
    this.setState({
      sectionModels: sectionModelsNew,
    });
  }

  /**
   * Adds a task to the model.
   * @param {Integer} sectionIndex Index of the section where the task will be added.
   * @param {String} taskText Text of the task to be added.
   */
  addTask = (sectionIndex, taskText) => {
    const sectionModelsNew = this.state.sectionModels.slice();
    sectionModelsNew[sectionIndex].tasks.push(taskText);

    this.setState({
      sectionModels: sectionModelsNew,
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
         * Take a look at backend/backend/views.py to see res.data's layout.
         * I *could* describe it here, but then I would have to maintain this comment and
         * reflect any changes I make in that file, which ain't gonna happen.
         */
        this.setState({
          boardModel: {
            id: res.data.id,
            name: res.data.name,
          },
          sectionModels: res.data.sections,
        });
      })
      .catch((err) => {
        alert(`Error while getting board data: ${err.message}`);
      });
  }

  // FIXME: Delete these *_task functions after debugging.
  add_task_to_section = () => {
    axios
      .post(`${AppUrls.BOARD}section/11/task`, {
        text: 'test text',
      })
      .then((res) => {
        alert(`${res.data}`);
      })
      .catch((err) => {
        alert(`err: ${JSON.stringify(err)}`);
      });
  }

  update_task = () => {
    axios
      .put(`${AppUrls.BOARD}section/11/task/8`, {
        text: 'test text [updated]',
      })
      .then((res) => {
        alert(`${res.data}`);
      })
      .catch((err) => {
        alert(`err: ${JSON.stringify(err)}`);
      });
  }

  delete_task = () => {
    axios
      .delete(`${AppUrls.BOARD}section/11/task/9`)
      .then((res) => {
        alert(`${res.data}`);
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
        <button onClick={this.add_task_to_section}>add_task_to_section</button>
        <button onClick={this.update_task}>update_task</button>
        <button onClick={this.delete_task}>delete_task</button>
        <h1>{APP_NAME}</h1>
        <Board
          App={this.App}
          model={this.state.boardModel}
          sectionModels={this.state.sectionModels}
        />
      </div>
    );
  }
}

export default App;
