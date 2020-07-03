import React from 'react';
import styles from './App.module.css';
import Board from './Board';


class App extends React.Component {
  render() {
    return (
      <div className={styles.App}>
        <h1>Kanbanlache</h1>
        <Board name='Board' sectionNames={['TODO', 'DOING', 'DONE']} />
      </div>
    );
  }
}

export default App;
