import React from 'react';
import styles from './Board.module.css'
import Section from './Section';

/**
 * 
 * @param {Objects} props An object with shape { name, sections }, where 'name' is the
 * name which will be shown atop the Board, and 'sections' is an array of sections
 * names.
 */
function Board(props) {
  // Calculate width dynamically and set it with inline CSS.
  const widthNum = (100 / props.sections.length) - 4;

  const sections = props.sections.map((sectionName) =>
    <div style={{ width: `${widthNum.toString()}%`, }}>
      <Section name={sectionName}/>
    </div>);

  const sectionsContainerLayout = {
    display: 'flex',
    justifyContent: 'space-around',
  };

  const sectionsContainer = <div style={sectionsContainerLayout}>{sections}</div>

  return (
    <div className={styles.Board}>
      <h2>{props.name}</h2>
      {sectionsContainer}
    </div>
  );
}

export default Board;
