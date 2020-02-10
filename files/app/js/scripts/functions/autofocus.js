function autofocusElement(selector = '.js-autofocus', delay = 0) {
  setTimeout(() => {
    $(selector).focus();
  }, delay);
}

export default autofocusElement;
