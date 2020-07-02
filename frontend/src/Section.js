import React from 'react';
import styles from './Section.module.css'
import Task from './Task'


class Section extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      tasks: [],
    };
  }

  onClick = () => {
    const tasks = this.state.tasks.slice();
    tasks.push('new task');
    this.setState({
      tasks: tasks,
    });
  }

  render() {
    const tasks = this.state.tasks.map((el) => <Task text={el}/>)

    return (
      <div>
        <div className={styles.Section}>
          <h2>{this.state.name}</h2>
          {tasks}
        </div>
        <button onClick={this.onClick}>Add task</button>
      </div>
    );
  }
}

export default Section;
