import axios from 'axios';


const BASE_URL = window.location.href;

export const URLS = {
  LOGOUT: `${BASE_URL}accounts/logout`,
  LOGOUT_SUCCESS_REDIRECT: BASE_URL,
  BOARD: `${BASE_URL}board/`,
};

/**
  * Necessary for Django AJAX.
  * More info on: https://docs.djangoproject.com/en/3.0/ref/csrf/
  */
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';


/**
 * Backend class. Manages requests/responses to/from the backend server.
 */
class Backend {
  /**
   * Gets all board data.
   */
  getBoardData(successCallback, failureCallback) {
    axios
      .get(URLS.BOARD)
      .then((res) => {
        successCallback(res.data);
      })
      .catch((err) => {
        failureCallback(err.message);
      });
  }

  /**
   * Mock getBoardData to quickly test the frontend without the backend.
   * The jarring mock_* naming convention is intentionally annoying, as you
   * most certainly don't want to include this code in production by accident.
   */
  mock_getBoardData(successCallback, failureCallback) {
    const mockBoard = {
      id: 1,
      name: 'Default board',
      sections: [
        { id: 1, name: 'TODO',
          tasks: [
            { id: 1, text: 'something to do #1', },
            { id: 2, text: 'something to do #2', },
            { id: 3, text: 'something to do #3', },
          ] },
        { id: 2, name: 'DOING',
          tasks: [
            { id: 4, text: 'something in progress #1', },
            { id: 5, text: 'something in progress #2', },
            { id: 6, text: 'something in progress #3', },
          ] },
        { id: 3, name: 'DONE',
          tasks: [
            { id: 7, text: 'something already done #1', },
            { id: 8, text: 'something already done #2', },
            { id: 9, text: 'something already done #3', },
          ] },
      ],
    };

    successCallback(mockBoard);
  }

  /**
   * Adds a task to the backend.
   * @param {Integer} sectionId 
   * @param {String} taskText 
   * @param {Function} successCallback 
   * @param {Function} failureCallback 
   */
  addTask(sectionId, taskText, successCallback, failureCallback) {
    // FIXME: We should think of a better way of managing these URLs
    axios
      .post(`${URLS.BOARD}section/${sectionId}/task`, {
        text: taskText,
      })
      .then((res) => {
        successCallback(res.data);
      })
      .catch((err) => {
        failureCallback(err.message);
      });
  }
  
  /**
   * Updates a task in the backend.
   * @param {Integer} sectionId 
   * @param {Integer} taskId 
   * @param {String} taskUpdatedText 
   * @param {Function} successCallback 
   * @param {Function} failureCallback 
   */
  updateTask(sectionId, taskId, taskUpdatedText, successCallback, failureCallback) {
    axios
      .put(`${URLS.BOARD}section/${sectionId}/task/${taskId}`, {
        text: taskUpdatedText,
      })
      .then((res) => {
        successCallback(res.data);
      })
      .catch((err) => {
        failureCallback(err.message);
      });
  }
  
  /**
   * Deletes a task in the backend.
   * @param {Integer} sectionId 
   * @param {Integer} taskId 
   * @param {Function} successCallback 
   * @param {Function} failureCallback 
   */
  deleteTask(sectionId, taskId, successCallback, failureCallback) {
    axios
      .delete(`${URLS.BOARD}section/${sectionId}/task/${taskId}`)
      .then((res) => {
        successCallback(res.data);
      })
      .catch((err) => {
        failureCallback(err.message);
      });
  }

  /**
   * Promotes a task in the backend.
   * @param {Integer} sectionId 
   * @param {Integer} taskId 
   * @param {Function} successCallback 
   * @param {Function} failureCallback 
   */
  promoteTask(sectionId, taskId, successCallback, failureCallback) {
    axios
      .post(`${URLS.BOARD}section/${sectionId}/task/${taskId}/promote`)
      .then((res) => {
        successCallback(res.data);
      })
      .catch((err) => {
        failureCallback(err.message);
      });
  }

  /**
   * Promotes a task in the backend.
   * @param {Integer} sectionId 
   * @param {Integer} taskId 
   * @param {Function} successCallback 
   * @param {Function} failureCallback 
   */
  demoteTask(sectionId, taskId, successCallback, failureCallback) {
    axios
      .post(`${URLS.BOARD}section/${sectionId}/task/${taskId}/demote`)
      .then((res) => {
        successCallback(res.data);
      })
      .catch((err) => {
        failureCallback(err.message);
      });
  }

  /**
   * Logouts user.
   */
  logout(successCallback, failureCallback) {
    axios
      .get(URLS.LOGOUT)
      .then((res) => {
        successCallback(res);
      })
      .catch((err) => {
        failureCallback(err.message);
      });
  }
}

export default Backend;
