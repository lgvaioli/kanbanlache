import React from 'react';
import styles from './Task.module.css'
import { G_TASK_TEXT_MAXLENGTH } from './globals';


/**
 * Task component. Implements the front-end of Tasks.
 * 
 * Tasks have two modes:
 *  - Normal mode, in which they just display the task text.
 *  - Edit mode, in which they show a textarea with a chars left counter,
 * which enables the user to edit the task text.
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

    const taskText = this.props.model.text;

    this.state = {
      editMode: false,
      textareaValue: taskText,
      charsLeft: G_TASK_TEXT_MAXLENGTH - taskText.length,
    };
  }


  /**
   * Toggles task edit mode on/off.
   */
  toggleEditMode = () => {
    const taskText = this.props.model.text;

    this.setState({
      editMode: !this.state.editMode,
      charsLeft: G_TASK_TEXT_MAXLENGTH - taskText.length,
    });
  }


  /**
   * Updates task text when the "Update" button is clicked.
   */
  onUpdate = () => {
    if (this.state.textareaValue === '') {
      return alert("Can't update task: Text is empty!");
    }

    this.props.Section.onTaskUpdate(this.state.textareaValue);
    this.toggleEditMode();
  }


  /**
   * Updates task state when the edit mode's textarea is edited.
   */
  onTextareaValueChange = (event) => {
    // FIXME: Note that this code is a duplicate from Section.js.
    // We might benefit from abstracting this into a "CountedTextarea" component.
    const textareaValue = event.target.value;
    const charsLeft = G_TASK_TEXT_MAXLENGTH - textareaValue.length;

    this.setState({
      textareaValue: textareaValue,
      charsLeft: charsLeft,
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
              <span>{this.state.charsLeft} characters left</span>
              <textarea onChange={this.onTextareaValueChange} defaultValue={this.props.model.text} maxLength={G_TASK_TEXT_MAXLENGTH} />
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
              <p>{this.props.model.text}</p>
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
