/* eslint-disable no-undef */
/* eslint-disable func-names */
(function (window, document) {
  const file = '../img/svg/min/svg.svg';
  const revision = 1;

  const elementNS = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

  if (!document.createElementNS || !elementNS) { return true; }

  const isLocalStorage = 'localStorage' in window && window.localStorage !== null;
  let request;
  let data;
  const insertIT = function () {
    document.querySelector('.svg-sprite').insertAdjacentHTML('afterbegin', data);
  };
  const insert = function () {
    if (document.body) insertIT();
    else document.addEventListener('DOMContentLoaded', insertIT);
  };

  if (isLocalStorage && localStorage.getItem('inlineSVGrev') === revision) {
    data = localStorage.getItem('inlineSVGdata');
    if (data) {
      insert();
      return true;
    }
  }

  try {
    request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        data = request.responseText;
        insert();
        if (isLocalStorage) {
          localStorage.setItem('inlineSVGdata', data);
          localStorage.setItem('inlineSVGrev', revision);
        }
      }
    };
    request.send();

  // eslint-disable-next-line no-empty
  } catch (e) {}
}(window, document));
