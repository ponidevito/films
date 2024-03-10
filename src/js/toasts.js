// toaster



// warning

function displayWrongToaster() {
  toastr.options.timeOut = 1500; // 1.5s
  toastr.warning("Email або пароль не вірний");
}

function displayNameToaster() {
  toastr.options.timeOut = 1500; // 1.5s
  toastr.warning("Фільм з такою назвою вже існує.");
}

function displaySearchToaster() {
  toastr.options.timeOut = 1500; // 1.5s
  toastr.warning("Введіть назву фільму для пошуку");
}

// success

function displaySuccesToaster() {
  toastr.options.timeOut = 1500; // 1.5s
  toastr.success("Фільм успішно додано");
}

function displaySuccesMessage() {
  toastr.options.timeOut = 1500; // 1.5s
  toastr.success("Відгук успішно відправлено");
}

function displayEditSuccesToaster() {
  toastr.options.timeOut = 1500; // 1.5s
  toastr.success("Відредаговано");
}

function displayDeleteSuccesToaster() {
  toastr.options.timeOut = 1500; // 1.5s
  toastr.success("Фільм видалено");
}
