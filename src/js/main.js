// Custom scripts


// modals

// checkbox toogle

function togglePasswordVisibility() {
    let checkboxColorText = document.querySelector(".modal__checkbox")
    var passwordField = document.getElementById('password');
    var showPasswordCheckbox = document.getElementById('showPassword');
  
    showPasswordCheckbox.checked = !showPasswordCheckbox.checked;
  
    if (showPasswordCheckbox.checked) {
        checkboxColorText.classList.add('changeColor')
      // Показати пароль
      passwordField.type = 'text';
    } else {
      // Приховати пароль
      checkboxColorText.classList.remove('changeColor')
      passwordField.type = 'password';
    }
  }
  
  