// This file is intended to throttle our XHR requests
export default (func, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) { clearTimeout(timeout) }
    timeout = setTimeout(() => func(...args), delay);
  };
};