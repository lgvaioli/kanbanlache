import React from 'react';
import styles from './App.module.css';
import Board from './Board';
import Backend from './Backend';
import { URLS } from './Backend';


const APP_NAME = 'Kanbanlache';


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

    this.backend = new Backend();

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
    this.backend.logout(
      () => {
      // Succesfully logged out, redirect

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
      window.location.replace(URLS.LOGOUT_SUCCESS_REDIRECT);
    },
    (errorMessage) => {
      // Could not log out, show error message
      alert(`Could not log out: ${errorMessage}`);
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

    /**
     * First, try to promote task in the backend. If that succeeds, update
     * the frontend, otherwise show an error message.
     */
    this.backend.promoteTask(
      this.state.sectionModels[sectionIndex].id,
      this.state.sectionModels[sectionIndex].tasks[taskIndex].id,
      () => {
        // Task was successfully promoted in the backend, update frontend

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
      },
      (errorMessage) => {
        // Task could not be promoted in the backend, show error message
        alert(`Could not promote task: ${errorMessage}`);
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

    /**
     * First, try to demote task in the backend. If that succeeds, update
     * the frontend, otherwise show an error message.
     */
    this.backend.demoteTask(
      this.state.sectionModels[sectionIndex].id,
      this.state.sectionModels[sectionIndex].tasks[taskIndex].id,
      () => {
        // Task was successfully demoted in the backend, update frontend

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
      },
      (errorMessage) => {
        // Task could not be demoted in the backend, show error message
        alert(`Could not demote task: ${errorMessage}`);
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

    /**
     * Try to remove task from backend. If successful, remove it also from
     * frontend, otherwise show an error message.
     */
    this.backend.deleteTask(
      this.state.sectionModels[sectionIndex].id,
      this.state.sectionModels[sectionIndex].tasks[taskIndex].id,
      () => {
        /**
         * Task was successfully deleted from backend; update frontend.
         */

        // Get copy of sections to enforce data immutability
        const sectionModelsNew = this.state.sectionModels.slice();

        // Remove task
        sectionModelsNew[sectionIndex].tasks.splice(taskIndex, 1);

        // Update state
        this.setState({
          sectionModels: sectionModelsNew,
        });

      },
      (errorMessage) => {
        /**
         * Task could not be removed from backend; show error message.
         */
        alert(`Could not remove task: ${errorMessage}`);
      });    
  }

  /**
   * Updates the text of a task.
   * @param {Integer} sectionIndex The index of the section where the task to be updated currently lives.
   * @param {Integer} taskIndex The index of the task to be updated.
   * @param {String} text New text.
   */
  onTaskUpdate = (sectionIndex, taskIndex, text) => {
    /**
     * Try to update task in backend; if successful, update frontend, otherwise
     * show an error message.
     */
    this.backend.updateTask(
      this.state.sectionModels[sectionIndex].id,
      this.state.sectionModels[sectionIndex].tasks[taskIndex].id,
      text,
      (taskModel) => {
        /**
         * Task was succesfully updated in backend; update frontend.
         */

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
        sectionModelsNew[sectionIndex].tasks[taskIndex].text = taskModel.text;

        // Update state
        this.setState({
          sectionModels: sectionModelsNew,
        });
      },
      (errorMessage) => {
        /**
         * Could not update task in backend; show error message.
         */
        alert(`Could not update task: ${errorMessage}`);
      });
  }

  /**
   * Adds a task to the model.
   * @param {Integer} sectionIndex Index of the section where the task will be added.
   * @param {String} taskText Text of the task to be added.
   * @param {Function} successCallback Callback to execute when the task is successfully added in the backend.
   * The signature of this callback must be: successCallback()
   * @param {Function} failureCallback Callback to execute when the task failed to be added in the backend.
   * The signature of this callback must be: failureCallback()
   */
  addTask = (sectionIndex, taskText, successCallback, failureCallback) => {
    /**
     * Basic flow: First we try to add the task to backend. We only add the
     * task to the frontend if the backend operation was succesful.
     */
    
    // Make backend request
    this.backend.addTask(
      this.state.sectionModels[sectionIndex].id,
      taskText,
      (taskModel) => {
        // Task was added successfully to backend; call successCallback and update frontend.
        successCallback();

        // Get copy of sections to enforce data immutability
        const sectionModelsNew = this.state.sectionModels.slice();

        // Push new task into tasks array (BTW, we should probably abstract these operations
        // into a separate TaskModel class or whatever)
        sectionModelsNew[sectionIndex].tasks.push({
          id: taskModel.id,
          text: taskModel.text,
        });

        // Update state
        this.setState({
          sectionModels: sectionModelsNew,
        });
      },
      (errorMessage) => {
        // Task could not be added to backend; call failureCallback and show error message.
        failureCallback();
        alert(`Could not add task: ${errorMessage}`);
      });
  }

  /**
   * Initializes Board with AJAX data.
   */
  componentDidMount() {
    this.backend.getBoardData(
      (boardData) => {
        // Got data successfully; update frontend with it

        /**
         * Take a look at backend/backend/views.py to see res.data's layout.
         * I *could* describe it here, but then I would have to maintain this comment and
         * reflect any changes I make in that file, which ain't gonna happen.
         */
        this.setState({
          boardModel: {
            id: boardData.id,
            name: boardData.name,
          },
          sectionModels: boardData.sections,
        });
      },
      (errorMessage) => {
        // Could not get data; show an error message
        alert(`Could not get board data: ${errorMessage}`);
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
          model={this.state.boardModel}
          sectionModels={this.state.sectionModels}
        />
      </div>
    );
  }
}

export default App;
