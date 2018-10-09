import React from 'react';
import './calcButton.css';


const calcButton = (props) => (
      <button className = {props.clsName}  onClick={props.click} value={props.buttonValue}>{props.children}</button>
);

export default calcButton;