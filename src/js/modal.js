



const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");

firstNameInput.addEventListener("input", function () {
  this.value = capitalizeFirstLetter(this.value);
});

lastNameInput.addEventListener("input", function () {
  this.value = capitalizeFirstLetter(this.value);
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const modalBtnEnter = document.querySelector(".modal-enter");
const modalTitle = document.getElementById("title");

function bindModal(trigger, modal, close) {
  trigger = document.querySelector(trigger);
  modal = document.querySelector(modal);
  close = document.querySelector(close);
  const body = document.body;

  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
    body.classList.add("locked");
  });

  close.addEventListener("click", () => {
    modal.style.display = "none";
    body.classList.remove("locked");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      body.classList.remove("locked");
    }
  });
}

function toggleRegistrationForm(event) {
  const loginForm = document.querySelector(".first-modal");
  const registrationForm = document.querySelector(".second-modal");
  const registrationLink = document.getElementById("registrationLink");
  const regButton = document.getElementById("reg-button"); // Додаємо клас reg-button

  loginForm.style.display = "none";
  modalBtnEnter.style.display = "none";
  registrationForm.classList.add("form-registration");
  registrationForm.style.display = "flex";
  registrationLink.textContent = "Увійти";
  registrationLink.style.textAlign = "start";
  registrationLink.onclick = toggleLoginForm;
  regButton.style.display = "flex";
  modalTitle.textContent = "Зареєструватись";
  event.preventDefault();

}

function toggleLoginForm() {
  const loginForm = document.querySelector(".first-modal");
  const registrationForm = document.querySelector(".second-modal");
  const registrationLink = document.getElementById("registrationLink");
  const regButton = document.getElementById("reg-button"); // Додаємо клас reg-button

  loginForm.style.display = "flex";
  registrationForm.classList.remove("form-registration");
  registrationForm.style.display = "none";
  registrationLink.textContent = "Зареєструватись";
  modalTitle.textContent = "Вхід";
  registrationLink.style.textAlign = "end";
  registrationLink.onclick = toggleRegistrationForm;
  regButton.style.display = "none";
  event.preventDefault();

}

// Initialize modal with default content
bindModal(".modal__btn", ".modal__wrapper", ".modal__close");

if (document.title === "Створіть свою колекцію кіно") {
  bindModal(".modal__btnReg", ".modal__wrapper", ".modal__close");
}
