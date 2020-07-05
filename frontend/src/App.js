import React from 'react';
import styles from './App.module.css';
import Board from './Board';
import axios from 'axios';


class App extends React.Component {
  /**
   * Logout button callback. Redirects to the login page.
   */
  onLogout = () => {
    const baseUrl = window.location.href;
    const logoutUrl = 'accounts/logout/'; // FIXME: read from config file
    const fullUrl = `${baseUrl}${logoutUrl}`;
    const logoutRedirectUrl = baseUrl;

    axios
      .get(fullUrl)
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
        window.location.replace(logoutRedirectUrl);
      })
      .catch((err) => {
        alert(`Error while logging out: ${err.message}`);
      });
  }

  render() {
    return (
      <div className={styles.App}>
        <button onClick={this.onLogout}>Logout</button>
        <h1>Kanbanlache</h1>
        <Board name='Board' sectionNames={['TODO', 'DOING', 'DONE',]} />
      </div>
    );
  }
}

export default App;
