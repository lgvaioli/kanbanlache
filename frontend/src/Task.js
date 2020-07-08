import React from 'react';
import styles from './Task.module.css'

/**
 * Task component. Implements the front-end of Tasks.
 * 
 * Required props:
 *  - Section (Object): The interface of the section to which this task belongs.
 *  - model (Object): An object { id: Integer, text: String } representing the Task
 * database model.
 * 
 * Optional props:
 *  - config (Object): An object with the optional configuration of this task. See
 *  Task.defaultProps (in this file) to know the valid config options.
 */
class Task extends React.Component {
  /**
   * Component constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      textareaValue: this.props.model.text,
    };
  }

  /**
   * Toggles task edit mode on/off.
   */
  toggleEditMode = () => {
    this.setState({
      editMode: !this.state.editMode,
    });
  }

  /**
   * Updates task text.
   */
  onUpdate = () => {
    if (this.state.textareaValue === '') {
      return alert("Can't update task: Text is empty!");
    }

    this.props.Section.onTaskUpdate(this.state.textareaValue);
    this.toggleEditMode();
  }

  /**
   * Updates task state from textarea.
   */
  onTextareaChange = (event) => {
    this.setState({
      textareaValue: event.target.value,
    });
  }

  /**
   * Renders component.
   */
  render() {
    return (
      <div className={styles.Task}>
        {this.state.editMode
          ?
            <div>
              <button onClick={this.toggleEditMode}>Cancel</button>
              <button onClick={this.onUpdate}>Update</button>
              <textarea onChange={this.onTextareaChange} defaultValue={this.props.model.text} />
            </div>
          :
            <div>
              {this.props.config.editable
                && <button onClick={this.toggleEditMode}>Edit</button>}
              {this.props.config.removable
                && <button onClick={() => this.props.Section.onTaskRemove()}>Remove</button>}
              {this.props.config.demotable &&
                <button onClick={() => this.props.Section.onTaskDemote()}>Demote</button>}
              {this.props.config.promotable &&
                <button onClick={() => this.props.Section.onTaskPromote()}>Promote</button>}
              <h2>{this.props.model.text}</h2>
            </div>
          }
      </div>
    );
  }
}

/**
 * Default props of this component.
 */
Task.defaultProps = {
  config: {
    editable: false,
    removable: true,
    promotable: true,
    demotable: true,
  },
};

export default Task;
