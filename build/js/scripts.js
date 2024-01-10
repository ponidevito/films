// Custom Scripts
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
  
  ;
// Модальное окно
function bindModal(trigger, modal, close) {
  trigger = document.querySelector(trigger),
    modal = document.querySelector(modal),
    close = document.querySelector(close)

  const body = document.body

  trigger.addEventListener('click', e => {
    e.preventDefault()
    modal.style.display = 'flex'
    body.classList.add('locked')
  });
  close.addEventListener('click', () => {
    modal.style.display = 'none'
     body.classList.remove('locked')
  });
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none'
       body.classList.remove('locked')
    }
  })
}

// ПЕРВЫЙ аргумент - класс кнопки, при клике на которую будет открываться модальное окно.
// ВТОРОЙ аргумент - класс самого модального окна.
// ТРЕТИЙ аргумент - класс кнопки, при клике на которую будет закрываться модальное окно.
bindModal('.modal__btn', '.modal__wrapper', '.modal__close')

