import React from 'react';
import styles from './App.module.css';
import Board from './Board';


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.App}>
        <h1>Kanbanlache</h1>
        <Board name='Board' sections={['TODO', 'DOING', 'DONE']} />
      </div>
    );
  }
}

export default App;
