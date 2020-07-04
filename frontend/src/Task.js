import React from 'react';
import styles from './Task.module.css'

/**
 * Task component. Implements the front-end of Tasks.
 * 
 * props:
 *  - text (String): Required. A string which describes this task.
 *  - index (Integer): Required. The index of the Task in the containing section.
 *  - onTaskPromote (Callback): Required. Callback of the form (taskIndex) => { } which is
 * called when the "Promote" button is clicked.
 *  - onTaskDemote (Callback): Required. Callback of the form (taskIndex) => { } which is
 * called when the "Demote" button is clicked.
 *  - onTaskRemove (Callback): Required. Callback of the form (taskIndex) => { } which is
 * called when the "Remove" button is clicked.
 *  - editable (Boolean): Optional. Indicates whether the task is editable or not. Defaults to false.
 *  - removable (Boolean): Optional. Indicates whether the task is removable or not. Defaults to true.
 *  - promotable (Boolean): Optional. Indicates whether the task is promotable or not. Defaults to true.
 *  - demotable (Boolean): Optional. Indicates whether the task is demotable or not. Defaults to true.
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
              {this.props.editable
                && <button onClick={this.toggleEditMode}>Edit</button>}
              {this.props.removable
                && <button onClick={() => this.props.onTaskRemove(this.props.index)}>Remove</button>}
              {this.props.promotable &&
                <button onClick={() => this.props.onTaskPromote(this.props.index)}>Promote</button>}
              {this.props.demotable &&
                <button onClick={() => this.props.onTaskDemote(this.props.index)}>Demote</button>}
              <h2>{this.props.text}</h2>
            </div>
          }
      </div>
    );
  }
}

Task.defaultProps = {
  editable: false,
  removable: true,
  promotable: true,
  demotable: true,
};

export default Task;
