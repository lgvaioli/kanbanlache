import React from 'react';
import styles from './Board.module.css'
import { Section, SectionPosition } from './Section';
import cloneDeep from 'lodash/cloneDeep';
import { useMediaQuery } from 'react-responsive';


/**
 * Section list settings.
 * 
 * GAP: Adjust this variable to increase/decrease the gap between sections.
 * 
 * WIDTH_BREAKPOINT: Section list width breakpoint.
 *  Screens >= to this breakpoint will have a horizontal section layout.
 *  Screens < to this breakpoint will have a vertical section layout.
 * 
 * MAX_WIDTH: Max width of each section (only applies to horizontal layout).
 */
const SECTION_LIST_SETTINGS = {
  GAP: 4,
  WIDTH_BREAKPOINT: 900,
  MAX_WIDTH: 80,
};


/**
 * Section list functional component.
 * 
 * Sections are arranged according to the following:
 * 
 * First section: Tasks are editable and are not demotable.
 * Middle sections: Tasks are not editable, and are both demotable and promotable.
 * Last section: Tasks are not editable, and are not promotable.
 * 
 * In other words: You can only edit a Task in the first section and you can't move
 * a Task "to the left" if it is in the left-most Section, mutatis mutandis
 * for movement to the right.
 * 
 * Required props:
 *  - sectionModels: A section models array.
 *  - sectionMaxWidth: The max width a section will have (applies only to horizontal layout).
 *  - widthBreakpoint: The breakpoint (in pixels) which determines when to switch between horizontal
 *  and vertical layouts.
 *  - sectionsGap: The gap percentage between sections (applies only to horizontal layout).
 *  - App: The App inteface which the Board component inherits. This is a hack which clearly
 *  breaks encapsulation and separation of concerns, but whatcha gonna do, life ain't perfect.
 */
const SectionList = (props) => {
  // Check whether screen is wide.
  const isWideScreen = useMediaQuery({ minDeviceWidth: props.widthBreakpoint });

  /**
   * Set section width according to screen size.
   * If screen is wide, width is evenly distributed according to the number of sections.
   * If screen isn't wide, each section takes up the whole horizontal width (i.e. 100%).
   */
  const sectionWidthPercentage = isWideScreen ?
    ((100 / props.sectionModels.length) - props.sectionsGap) : props.sectionMaxWidth;

  const sectionList = props.sectionModels.map((currSection, index) => {
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
    let Board = cloneDeep(props.App);
    Board.addTask = (taskText) => props.App.addTask(index, taskText);
    Board.onTaskPromote = (taskIndex) => props.App.onTaskPromote(index, taskIndex);
    Board.onTaskDemote = (taskIndex) => props.App.onTaskDemote(index, taskIndex);
    Board.onTaskRemove = (taskIndex) => props.App.onTaskRemove(index, taskIndex);
    Board.onTaskUpdate = (taskIndex, text) => props.App.onTaskUpdate(index, taskIndex, text);

    // Create Section config
    const isFirstSection = (index === 0);
    const isLastSection = (index === props.sectionModels.length - 1);

    const sectionConfig = {
      hasTaskAdder: isFirstSection,
      position: isFirstSection ? SectionPosition.FIRST :
                isLastSection ? SectionPosition.LAST :
                SectionPosition.MIDDLE,
    };

    return (
      <div key={currSection.name} style={{ width: `${sectionWidthPercentage.toString()}%`, }}>
          <Section
            Board={Board}
            model={currSection}
            tasks={currSection.tasks}
            config={sectionConfig}
          />
      </div>
    );
  });

  /**
   * Set section list container display dynamically.
   * If the screen is wide, stack sections horizontally (by disallowing wrapping); otherwise,
   * stack them vertically (by allowing wrapping).
   */
  const layout = {
    display: 'flex',
    flexWrap: isWideScreen ? 'nowrap' : 'wrap',
    justifyContent: 'space-around',
  };

  const sectionListContainer = <div style={layout}>{sectionList}</div>

  return sectionListContainer;
} 


/**
 * Board component. Contains and manages sections.
 * 
 * Required props:
 * - App (Object): The interface of the app to which this section belongs.
 * - model (Object): An object { id, name } representing the model of this Board.
 * - sections (Array): An array of sections [{ name: 'first section', tasks: ['first task', ...] }, ...].
 */
class Board extends React.Component {
  /**
   * Renders component.
   */
  render() {
    let sectionList = null;

    // An empty board is valid, so we gotta check this.
    if (this.props.sectionModels && this.props.sectionModels.length > 0) {
      sectionList = <SectionList
                      sectionModels={this.props.sectionModels}
                      sectionMaxWidth={SECTION_LIST_SETTINGS.MAX_WIDTH}
                      widthBreakpoint={SECTION_LIST_SETTINGS.WIDTH_BREAKPOINT}
                      sectionsGap={SECTION_LIST_SETTINGS.GAP}
                      App={this.props.App}
                    />
    }

    return (
      <div className={styles.Board}>
        <h2>{this.props.model.name}</h2>
        {sectionList}
      </div>
    );
  }
}

export default Board;
