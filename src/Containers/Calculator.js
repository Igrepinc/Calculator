import React, { Component } from 'react';
import Buttons from '../Components/Buttons/buttons';
import './Calculator.css';
import '../Components/Buttons/Button/calcButton.css';

class Calculator extends Component {

    state = {
        result: '0',
        inputLength: 0,
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
        const allValues = inputValues.split(' ').filter(val => val !== "");      
        const last = allValues[allValues.length - 1];

        const numLast = (last !== '/' && last !== '*' && last !== '+' && 
        last !== '-' && last !== '%' && last !== ' ') ? true : false;

        const shdCalc = allValues.length > 2 ? true : false;

        const hDot = last.includes('.');

        this.setState(
          {
            isNumberLast: numLast,
            shouldCalculate: shdCalc,
            hasDot: hDot,
            inputLength: allValues.toString().length
          });        
    };

    checkPrefix = (inputValue) => { // Provjeravam da li postoji - ispred broja za gumb +/-
      if(this.state.isNumberLast && this.state.inputLength < 20){
        const allValues = inputValue.split(' ').filter(val => val !== "");  
        const last = allValues[allValues.length - 1]; 

        if(allValues.length > 1 && last.charAt(0) !== '-'){
          return allValues[0] + " " + allValues[1] + " -" + allValues[2];
        }
        else if(allValues.length > 1 && last.charAt(0) === '-'){
          return allValues[0] + " " + allValues[1] + " " + allValues[2].substring(1);
        }
        else if(allValues.length === 1 && last.charAt(0) !== '-'){
          return "-" + allValues[0];
        }
        else{
          return allValues[0].substring(1);
        }
      }
      return inputValue;
    }

    checkZero = (inputValue) => { // Provjeravam nule na kraju decimalnog broja
      var result = inputValue;
      while(result[result.length -1] === '0'){
        result = result.slice(0, - 1); 
      }
      return result;
    }

    calculate = (inputValues) => { // Izvršavam kalkulaciju akom imam 2 broja i operator
      const allValues = inputValues.split(' ').filter(val => val !== "");  ;
      const firstNum = parseFloat(allValues[0]);
      const operator = allValues[1];
      const secondNum = parseFloat(allValues[2]);  
      let res = 0;

      if(allValues.length < 3){ // Zbog gumba jednako koji može izvršit kalkulaciju i ako nema drugu vrijednost
        return firstNum.toString();
      }

      if(operator === '/'){
        if(secondNum === 0){
          res = 'Cannot divide by zero';
        }
        else{
         res = firstNum / secondNum;
        }         
      }
      else if(operator === '*'){
         res = firstNum * secondNum;
      }
      else if(operator === '+'){
        res = firstNum + secondNum;
      }
      else if(operator === '-'){
        res = firstNum - secondNum;
      }

      if(res.toString().length > 6 && res.toString().includes('.') && res !== 'Cannot divide by zero'){
          res =res.toFixed(6).toString(); // ide na 6 decimala kako ukupan broj ne bi ispao iz okvira kalkulatora
      }
      else{ 
        res = res.toString();
      }

      if(res.includes('.')){
        res = this.checkZero(res); // Ako je rezultat izračuna decimalni broj, mičem nule (ako postoje) s kraja jer nisu potrebne
      } 

      this.setState({ result: res });
      return res;
    }

    getResultForOperator = (eventValue, result) => {
      if(this.state.inputLength < 22){
        if(this.state.shouldCalculate){ // Ako imam 2 broja i operator izvodim kalkulaciju prije dodavanja novog operatora
          result = this.calculate(result)
          if(result !== 'Cannot divide by zero'){
            result += " " + eventValue + " ";
          }        
        }
        else if(this.state.isNumberLast){  
          result += " " + eventValue + " ";
        }
        else{
          result = result.substr(0, result.length - 3); // mijenjanje operatora kad se klikaju jedan za drugim, ostali načini nisu radili kak spada pa nek ostane ovak
          result += " " + eventValue + " ";
        }
      }
      return result
    }

    getResultForPercent = (result) => {
      if(result === '0'){
        return '0';
      }
      if(this.state.inputLength < 22){
        if(this.state.shouldCalculate){
          result = this.calculate(result);
        }
        else if(!this.state.isNumberLast){
          result = result.substr(0, result.length - 3);
        }
        result /= 100;
        result = result.toString().length > 6 ? result.toFixed(6).toString() : result.toString();
        
        if(result.includes('.')){
          result = this.checkZero(result); // Ako je rezultat izračuna decimalni broj, mičem nule s kraja jer nisu potrebne
        } 
      }   
      return result;
    }

    getResultForDot = (eventValue, result) => {
      if(!this.state.hasDot){ //Ako vrijednost već sadrži točku ne dodavaj novu
        if(result.slice(-1) === " "){ // Ako ispred točke nije broj nego praznina, dodaj nulu isped točke
          result += "0";
        }
        if(this.state.inputLength < 22){
          result += eventValue;
        }
      }
      return result;
    }

    onButtonClickHandler = (event) => {
      event.preventDefault();
      let res = this.state.result;

      if(res === 'Cannot divide by zero'){ //Ako je ovo trenutni state, postavi na nulu prije dodavanja novog inputa
        res = '0';  
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
            if(this.state.inputLength < 22){
              res += event.target.value;
            }   
            break;
          case '.':
            res = this.getResultForDot(event.target.value, res);
            break;
          case '/':
          case '*':
          case '-':
          case '+':
            res = this.getResultForOperator(event.target.value, res);
            break;
          case '%':
            res = this.getResultForPercent(res);
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
                <Buttons buttons={options} className={this.getClassName} buttonClick ={this.onButtonClickHandler} />
            </div>
           </div>
       );
    };
};

export default Calculator;