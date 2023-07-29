/* eslint-disable no-unused-expressions */
// @fileoverview html.js provides a set of functions to create HTML elements.


// create HTML element of type tagName (e.g. 'div' or 'img')
function createElement(parent, className, tagName) {
  let element = document.createElement(tagName);
  className ? element.className = className : null;
  parent ? parent.appendChild(element) : null;
  return element;
}

function createBr(parent) {
  let element = createElement(parent, null, 'br');
  return element;
}


function createDiv(parent, className, text) {
  let element = createElement(parent, className, 'div');
  text ? element.insertAdjacentText('beforeend', text) : null;
  return element;
}


function createH2(parent, className, text) {
  let element = createElement(parent, className, 'H2');
  text ? element.insertAdjacentText('beforeend', text) : null;
  return element;
}


function createImg(parent, className, url) {
  let element = createElement(parent, className, 'img');
  url ? element.src = url : null;
  return element;
}


export {
  createBr,
  createDiv,
  createElement,
  createH2,
  createImg,
};
