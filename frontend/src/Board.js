import React from 'react';
import styles from './Board.module.css'
import { Section, SectionPosition } from './Section';
import cloneDeep from 'lodash/cloneDeep';


/** 
 * Adjust this variable to increase/decrease the gap between sections.
 */
const SECTIONS_GAP = 4;


/**
 * Board component. Contains and manages sections.
 * 
 * Required props:
 * - App (Object): The interface of the app to which this section belongs.
 * - name (String): The name to display on top of this board.
 * - sections (Array): An array of sections [{ name: 'first section', tasks: ['first task', ...] }, ...].
 */
class Board extends React.Component {
  /**
   * Builds sections widgets with the following attributes:
   * 
   * First section: Tasks are editable and are not demotable.
   * Middle sections: Tasks are not editable, and are both demotable and promotable.
   * Last section: Tasks are not editable, and are not promotable.
   * 
   * In other words: You can only edit a Task in the first section and you can't move
   * a Task "to the left" if it is in the left-most Section, mutatis mutandis
   * for movement to the right.
   * @param {Array} sections An array of sections [{ name: 'first section', tasks: ['first task',] }]
   * @returns {Object} A JSX object containing all the sections.
   */
  buildSectionsWidget(sections) {
    // Calculate width (percentage) dynamically and set it with inline CSS.
    const sectionWidth = (100 / sections.length) - SECTIONS_GAP;

    const sectionsContainer = sections.map((currSection, index) => {
      const isFirstSection = (index === 0);
      const isLastSection = (index === sections.length - 1);

      /**
       * Create Board's interface to its children. Do note that we create this interface
       * dynamically and tailored to each individual Task, because we rely on closure to
       * store specific information (viz., the section index.)
       * 
       * We use App's interface as a base, and decorate (overwrite) the appropriate methods.
       * 
       * Do note that we need to make a deep copy, otherwise we descend into circular dependency hell
       * and blow up the stack with a 'Maximum call stack size exceeded' error :^)
       */
      let Board = cloneDeep(this.props.App);
      Board.addTask = (taskText) => this.props.App.addTask(index, taskText);
      Board.onTaskPromote = (taskIndex) => this.props.App.onTaskPromote(index, taskIndex);
      Board.onTaskDemote = (taskIndex) => this.props.App.onTaskDemote(index, taskIndex);
      Board.onTaskRemove = (taskIndex) => this.props.App.onTaskRemove(index, taskIndex);
      Board.onTaskUpdate = (taskIndex, text) => this.props.App.onTaskUpdate(index, taskIndex, text);

      // Create Section config
      const sectionConfig = {
        hasTaskAdder: isFirstSection,
        position: isFirstSection ? SectionPosition.FIRST :
                  isLastSection ? SectionPosition.LAST :
                  SectionPosition.MIDDLE,
      };

      return (
        <div key={currSection.name} style={{ width: `${sectionWidth.toString()}%`, }}>
          <Section
            Board={Board}
            name={currSection.name}
            tasks={currSection.tasks}
            config={sectionConfig}
          />
        </div>
      );
    });

    return sectionsContainer;
  }

  /**
   * Renders component.
   */
  render() {
    let sectionsWidget = null;

    // An empty board is valid, so we gotta check this.
    if (this.props.sections && this.props.sections.length > 0) {
      sectionsWidget = this.buildSectionsWidget(this.props.sections);
    }

    const sectionsContainerLayout = {
      display: 'flex',
      justifyContent: 'space-around',
    };

    const sectionsContainer = <div style={sectionsContainerLayout}>{sectionsWidget}</div>

    return (
      <div className={styles.Board}>
        <h2>{this.props.name}</h2>
        {sectionsContainer}
      </div>
    );
  }
}

export default Board;
