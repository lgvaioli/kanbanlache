import React from 'react';
import styles from './Task.module.css'

function Task(props) {
  return (
    <div className={styles.Task}>
      <button>Edit</button>
      <button>Remove</button>
      <button>Promote</button>
      <button>Demote</button>
      <h2>{props.text}</h2>
    </div>
  );
}

export default Task;
