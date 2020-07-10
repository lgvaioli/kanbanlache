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
