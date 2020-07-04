import React from 'react';
import styles from './Task.module.css'

/**
 * Task component. Implements the front-end of Tasks.
 * 
 * props:
 *  - text (String): Required. A string which describes this task.
 *  - index (Integer): Required. The index of this Task in the
 * containing section.
 *  - onTaskPromote (Callback): Required. Callback of the form (taskIndex) => { } which is
 * called when the "Promote" button is clicked.
 *  - onTaskDemote (Callback): Required. Callback of the form (taskIndex) => { } which is
 * called when the "Demote" button is clicked.
 *  - onTaskRemove (Callback): Required. Callback of the form (taskIndex) => { } which is
 * called when the "Remove" button is clicked.
 */
class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      text: this.props.text,
    };
  }

  toggleEditMode = () => {
    this.setState({
      editMode: !this.state.editMode,
    });
  }

  onUpdate = () => {
    if (this.state.text === '') {
      return alert("Can't update task: Text is empty!");
    }

    this.props.onTaskUpdate(this.props.index, this.state.text);
    this.toggleEditMode();
  }

  onTextareaChange = (event) => {
    this.setState({
      text: event.target.value,
    });
  }

  render() {
    return (
      <div className={styles.Task}>
        {this.state.editMode
          ?
            <div>
              <button onClick={this.toggleEditMode}>Cancel</button>
              <button onClick={this.onUpdate}>Update</button>
              <textarea onChange={this.onTextareaChange} defaultValue={this.props.text} />
            </div>
          :
            <div>
              <button onClick={this.toggleEditMode}>Edit</button>
              <button onClick={() => this.props.onTaskRemove(this.props.index)}>Remove</button>
              <button onClick={() => this.props.onTaskPromote(this.props.index)}>Promote</button>
              <button onClick={() => this.props.onTaskDemote(this.props.index)}>Demote</button>
              <h2>{this.props.text}</h2>
            </div>
          }
      </div>
    );
  }
}

export default Task;
