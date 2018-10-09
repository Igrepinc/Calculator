import React, { Component } from 'react';
import CalcButton from '../Components/Buttons/calcButton';
import './Calculator.css';
import '../Components/Buttons/calcButton.css';

class Calculator extends Component {

    state = {
        result: '0',
        isNumberLast : false,
        shouldCalculate: false,
        hasDot: false,
    };

    getClassName = (buttonVal) => {
        switch(buttonVal){
            case 'AC':
            case '+/-':
            case '%':
              return 'Button light-gray';
            case '/':
            case '-':
            case '+':
            case '*':
            case '=':
              return 'Button yellow';
            case 0:
              return 'Button dark gray extended';
            default:
              return 'Button dark-gray';
        };
    };

    checkInput = (inputValues) => { //provjeravam trenutni input i postavljam state prije slijedećeg inputa
        let allValues = inputValues.split(' ').filter(val => val !== "");      
        const last = allValues[allValues.length - 1];

        let numLast = (last !== '/' && last !== '*' && last !== '+' && 
        last !== '-' && last !== '%' && last !== ' ') ? true : false;

        let shdCalc = allValues.length > 2 ? true : false;

        let hDot = last.includes('.') ? true : false;

        this.setState(
          {
            isNumberLast: numLast,
            shouldCalculate: shdCalc,
            hasDot: hDot
          });        
    };

    checkPrefix = (inputValue) => { // Provjeravam da li postoji - za gumb +/-
        if(inputValue.charAt(0) !== '-'){
          return '-' + inputValue
        }
        else {
          return inputValue.substring(1);
        }
    }

    calculate = (inputValues) => { // Kalkulacija. Ako input broj sadrži točku koristi parseFloat
      const allValues = inputValues.split(' ');
      let res = 0;
         if(allValues[1] === '/'){
           if(allValues[2] === '0'){
            res = 'Cannot divide by zero';
           }
           else{
            res = allValues[0].includes('.') || allValues[2].includes('.') ? 
            parseFloat(allValues[0]) / parseFloat(allValues[2]) : 
            parseInt(allValues[0]) / parseInt(allValues[2]);
           }         
         }
         else if(allValues[1] === '*'){
             res = allValues[0].includes('.') || allValues[2].includes('.') ? 
             parseFloat(allValues[0]) * parseFloat(allValues[2]) : 
             parseInt(allValues[0]) * parseInt(allValues[2]);
         }
         else if(allValues[1] === '+'){
             res = allValues[0].includes('.') || allValues[2].includes('.') ? 
             parseFloat(allValues[0]) + parseFloat(allValues[2]) : 
             parseInt(allValues[0]) + parseInt(allValues[2]);
         }
         else if(allValues[1] === '-'){
             res = allValues[0].includes('.') || allValues[2].includes('.') ? 
             parseFloat(allValues[0]) - parseFloat(allValues[2]) : 
             parseInt(allValues[0]) - parseInt(allValues[2]);
         }
 
         if(res.toString().length > 12 && res !== 'Cannot divide by zero'){
             res =res.toFixed(12).toString(); // ide na 12 decimala kako ukupan broj ne bi ispao iz okvira kalkulatora
         }
         else{
           res = res.toString();
         }

      this.setState({ result: res });
      return res;
    };

    onButtonClickHandler = (event) => {
      event.preventDefault();
      var res = this.state.result;

      if(res === 'Cannot divide by zero'){ //Ako je ovo trenutni state, izbriši sve prije dodavanja novog inputa
        res = '';  
      }

      switch(event.target.value){
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            if(res === '0'){ res = ''; } //mičem nulu sa početka
            res += event.target.value;
            break;
          case '.':
            if(!this.state.hasDot){  //Ako vrijednost već sadrži točku ne dodavaj novu
              res += event.target.value;
            }
            break;
          case '/':
          case '*':
          case '-':
          case '+':
            if(this.state.shouldCalculate){ // Ako imam 2 broja i operator izvodim kalkulaciju prije dodavanja novog operatora
              res = this.calculate(res)
              if(res !== 'Cannot divide by zero'){
                res += " " + event.target.value + " ";
              }        
            }
            else if(this.state.isNumberLast){  
              res += " " + event.target.value + " ";
            }
            else{
              res = res.substr(0, res.length - 3); // mijenjanje operatora kad se klikaju jedan za drugim, ostali načini nisu radili kak spada pa nek ostane ovak
              res += " " + event.target.value + " ";
            }
            break;
          case '%':
            if(this.state.shouldCalculate){
              res = this.calculate(res);
              res /= 100;
              res = res.toString().length > 12 ? res.toFixed(12).toString() : res.toString();
            }
            else if(this.state.isNumberLast){ 
              res /= 100;
              res = res.toString().length > 12 ? res.toFixed(12).toString() : res.toString();
            }
            break;
          case '+/-':
            res = this.checkPrefix(res);
            break;
          case 'AC':
            res = '0';
            break;
          case '=':
            res = this.calculate(res);    
            break;
          default:
            res = '0';    
      }

      this.setState({result: res});
      this.checkInput(res);
    };

    render(){

      const options = ['AC', '+/-', '%', '/', 7, 8, 9, '*', 4, 5, 6,
                   '-', 1, 2, 3, '+', 0, '.', '='];

       return(
           <div className="Calculator">
            <input className="Input" id="summary" type = "text" readOnly value={this.state.result} />
            <div className="Buttons">
                {options.map((num, index) => {
                    return <CalcButton clsName = {this.getClassName(num)}
                     key={index} buttonValue={num} 
                     click = {this.onButtonClickHandler}>{num}</CalcButton>
                })}
            </div>
           </div>
       );
    };
};

export default Calculator;