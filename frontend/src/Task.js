import React from 'react';
import styles from './Task.module.css'

function Task(props) {
  return (
    <div className={styles.Task}>
      <button>Edit</button>
      <button onClick={() => props.onTaskRemove(props.index)}>Remove</button>
      <button onClick={() => props.onTaskPromote(props.index)}>Promote</button>
      <button onClick={() => props.onTaskDemote(props.index)}>Demote</button>
      <h2>{props.text}</h2>
    </div>
  );
}

export default Task;
