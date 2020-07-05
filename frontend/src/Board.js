import React from 'react';
import styles from './Board.module.css'
import Section from './Section';


/** 
 * Adjust this variable to increase/decrease the gap between sections.
 */
const SECTIONS_GAP = 4;


class Board extends React.Component {
  /**
   * FIXME: document function
   */
  buildSectionsWidget(sections) {
    /**
     * Sections are created with the following attributes:
     * First section: Tasks are editable and are not demotable.
     * Middle sections: Tasks are not editable, and are both demotable and promotable.
     * Last section: Tasks are not editable, and are not promotable.
     * 
     * In other words: You can only edit a Task in the first section and you can't move
     * a Task "to the left" if it is in the left-most Section, mutatis mutandis
     * for movement to the right.
     * 
     * The way this is implemented is by checking the Section index to determine whether
     * the current Section is the first/last or a middle Section.
     */

    // Calculate width (percentage) dynamically and set it with inline CSS.
    const sectionWidth = (100 / sections.length) - SECTIONS_GAP;

    const sectionsContainer = sections.map((currSection, index) => {
      const isFirstSection = (index === 0);
      const isLastSection = (index === sections.length - 1);

      return (
        <div key={currSection.name} style={{ width: `${sectionWidth.toString()}%`, }}>
          <Section
            name={currSection.name}
            tasks={currSection.tasks}
            hasTaskAdder={isFirstSection}
            addTask={(taskText) => this.props.addTask(index, taskText)}
            onTaskPromote={(taskIndex) => this.props.onTaskPromote(index, taskIndex)}
            onTaskDemote={(taskIndex) => this.props.onTaskDemote(index, taskIndex)}
            onTaskRemove={(taskIndex) => this.props.onTaskRemove(index, taskIndex)}
            onTaskUpdate={(taskIndex, text) => this.props.onTaskUpdate(index, taskIndex, text)}
            taskEditable={isFirstSection}
            taskRemovable={true}
            taskPromotable={!isLastSection}
            taskDemotable={!isFirstSection}
          />
        </div>
      );
    });

    return sectionsContainer;
  }

  render() {
    let sectionsWidget = null;

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
