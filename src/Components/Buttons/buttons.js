import React from 'react';
import CalcButton from '../Buttons/Button/calcButton';

const buttons = (props) => props.buttons.map((num, index) => {
    return <CalcButton 
     clsName = {props.className(num)}
     key={index} 
     buttonValue={num} 
     click = {props.buttonClick}>{num}</CalcButton>
});

export default buttons;