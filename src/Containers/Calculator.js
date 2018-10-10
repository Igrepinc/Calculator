import React, { Component } from 'react';
import CalcButton from '../Components/Buttons/calcButton';
import './Calculator.css';
import '../Components/Buttons/calcButton.css';

// Riješiti history
// Broj inputa ograničiti da ne ispada iz okvira

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
            hasDot: hDot
          });        
    };

    checkPrefix = (inputValue) => { // Provjeravam da li postoji - ispred broja za gumb +/-
      if(this.state.isNumberLast){
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
    }

    checkZero = (inputValue) => { // Provjerava nule na kraju decimalnog broja
      var result = inputValue;
      while(result[result.length -1] === '0'){
        result = result.slice(0, - 1); 
      }

      return result;
    }

    calculate = (inputValues) => { // Izvršavam kalkulaciju
      const allValues = inputValues.split(' ');
      let res = 0;

      if(allValues[1] === '/'){
        if(allValues[2] === '0'){
         res = 'Cannot divide by zero';
        }
        else{
         res = parseFloat(allValues[0]) / parseFloat(allValues[2]);
        }         
      }
      else if(allValues[1] === '*'){
         res = parseFloat(allValues[0]) * parseFloat(allValues[2]);
      }
      else if(allValues[1] === '+'){
         res = parseFloat(allValues[0]) + parseFloat(allValues[2]);
      }
      else if(allValues[1] === '-'){
         res = parseFloat(allValues[0]) - parseFloat(allValues[2]);
      }

      if(res.toString().length > 12 && res !== 'Cannot divide by zero'){
          res =res.toFixed(12).toString(); // ide na 12 decimala kako ukupan broj ne bi ispao iz okvira kalkulatora
      }
      else{
        res = res.toString();
      }

      if(res.includes('.')){
        res = this.checkZero(res); // Ako je rezultat izračuna decimalni broj, mičem nule (ako postoje) s kraja jer nisu potrebne
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
            }
            else if(!this.state.isNumberLast){
              res = res.substr(0, res.length - 3);
            }
            res /= 100;
            res = res.toString().length > 12 ? res.toFixed(12).toString() : res.toString();
            
            if(res.includes('.')){
              res = this.checkZero(res); // Ako je rezultat izračuna decimalni broj, mičem nule s kraja jer nisu potrebne
            } 
            break;
          case '+/-':
            if(this.state.isNumberLast){
              res = this.checkPrefix(res);
            }    
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