// toaster

// warning

function displayWrongToaster() {
  toastr.options.timeOut = 1500; // 1.5s
  toastr.warning("Email або пароль не вірний");
}


// success

function displaySuccesToaster() {
  toastr.options.timeOut = 1500; // 1.5s
  toastr.success("Фільм успішно додано");
}

function displayEditSuccesToaster() {
  toastr.options.timeOut = 1500; // 1.5s
  toastr.success("Відредаговано");
}

function displayDeleteSuccesToaster() {
  toastr.options.timeOut = 1500; // 1.5s
  toastr.success("Фільм видалено");
}
