import React, {useRef, useEffect} from 'react';
import {evaluate, isOperator} from './calculator.js';

let logo = "https://raw.githubusercontent.com/BP-Portfolio/BP-Portfolio.github.io/main/Images/Logo/PersonalLogo_Circle.png";

function setCursorPos(ctrl, pos) {
  if(ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  } else if(ctrl.createTextRange) {
    var range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}

const Button = ({value, onClick}) => {
  return (
    <td>
      <button className = "calc-button" onClick={onClick}>{value}</button>
    </td>
  );
}

export default function App() {
  const ref = useRef(null);

  const onClear = () => {
    ref.current.value = "";
  };

  useEffect(() => {
    const keyDown = e => {
      /*if(e.key === 'Backspace' && !isNumeric(ref.current.value)) {
        e.preventDefault();
        ref.current.value = "";
      }*/

      if(e.key === 'Enter') {
        e.preventDefault();
        solve();
      }
    }

    document.addEventListener('keydown', keyDown);
    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, []);

  const update = (value) => {
    ref.current.focus();

    if(value === '()') {
      let input = document.getElementById("input-id");
      setCursorPos(input, input.value.length - 1);
    }

    if(isOperator(value)) {
      ref.current.value += (' ' + value + ' ');
    } else {
      ref.current.value += value;
    }
  };

  const format = () => {
    const copy = ref.current.value.slice();
    let value = "";
    
    for(let i = 0; i < copy.length; i++) {
      if(copy[i] === '+' || copy[i] === '-' || copy[i] === '*' || copy[i] === '/' || copy[i] === '^') {        
        value += (" " + copy[i] + " ");
      } else {
        value += copy[i];
      }
    }

    ref.current.value = value.trim().replace(/\s+/g, " ");
  }

  const solve = () => {
    ref.current.value = evaluate(ref.current.value);
  };

  return (
    <div className='body'>
      <div className='header'>
        <h1>Just A Very Simple Calculator</h1>
        <h2>Creator: Brian Pham</h2>
        <button className = "home-button">
          <a href = "https://bp-portfolio.github.io/" target='_blank' rel="noopener noreferrer">HOME PAGE</a>
        </button>
      </div>
      
      <table className='calc-container'>
        <tbody>
          <tr>
            <td colSpan={3}>
              <input 
                ref = {ref}
                className = 'calc-display' 
                type = 'text' 
                onChange = {format}
                autoFocus
                id = "input-id"
              >
              </input>              
            </td>
            <Button value = {'C'} onClick={onClear} />
          </tr>
          <tr>
            <Button value = {'()'} onClick = {e => update('()')}/>
            <Button value = {'e'} onClick = {e => update('e')}/>
            <Button value = {'π'} onClick={e => update('π')} />
            <Button value = {'^'} onClick = {e => update('^')}/>
          </tr>
          <tr>
            <Button value = {'7'} onClick = {e => update(7)}/>
            <Button value = {'8'} onClick = {e => update(8)}/>
            <Button value = {'9'} onClick = {e => update(9)}/>
            <Button value = {'/'} onClick = {e => update('/')}/>
          </tr>
          <tr>
            <Button value = {'4'} onClick = {e => update(4)}/>
            <Button value = {'5'} onClick = {e => update(5)}/>
            <Button value = {'6'} onClick = {e => update(6)}/>
            <Button value = {'*'} onClick = {e => update('*')}/>
          </tr>
          <tr>
            <Button value = {'1'} onClick = {e => update(1)}/>
            <Button value = {'2'} onClick = {e => update(2)}/>
            <Button value = {'3'} onClick = {e => update(3)}/>
            <Button value = {'-'} onClick = {e => update('-')}/>
          </tr>
          <tr>
            <Button value = {'0'} onClick = {e => update(0)}/>
            <Button value = {'.'} onClick = {e => update('.')}/>
            <Button value = {'='} onClick = {e => solve()}/>
            <Button value = {'+'} onClick = {e => update('+')}/>
          </tr>
        </tbody>
      </table>  
      <div className='logo'>
        <img 
          src = {logo} 
          alt = "Logo" 
          style = {{
            width: "25px", 
            height: "25px"
          }}
        />
      </div>
    </div>
    
  );
}

