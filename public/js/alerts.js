// FUNCTIONS THAT SHOW/HIDE MESSAGES

export const hideAlert = () => {
  const element = document.querySelector(".alert");

  if (element) {
    element.parentElement.removeChild(element);
  }
};

// type is 'success' or 'error'
export const showAlert = (type, message, time = 7) => {
  hideAlert();

  const markup = `<div class="alert alert--${type}">${message}</div>`;

  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

  window.setTimeout(hideAlert, time * 1000);
};
