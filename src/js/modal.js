// Модальное окно

// function bindModal(trigger, modal, close) {
//   trigger = document.querySelector(trigger),
//     modal = document.querySelector(modal),
//     close = document.querySelector(close)

//   const body = document.body

//   trigger.addEventListener('click', e => {
//     e.preventDefault()
//     modal.style.display = 'flex'
//     body.classList.add('locked')
//   });
//   close.addEventListener('click', () => {
//     modal.style.display = 'none'
//      body.classList.remove('locked')
//   });
//   modal.addEventListener('click', e => {
//     if (e.target === modal) {
//       modal.style.display = 'none'
//        body.classList.remove('locked')
//     }
//   })
// }

// bindModal('.modal__btn', '.modal__wrapper', '.modal__close')


const modalBtnEnter = document.querySelector ('.modal__button')
const modalTitle = document.querySelector ('.modal__title')


function bindModal(trigger, modal, close) {
  trigger = document.querySelector(trigger);
  modal = document.querySelector(modal);
  close = document.querySelector(close);
  const body = document.body;

  trigger.addEventListener('click', e => {
    e.preventDefault();
    modal.style.display = 'flex';
    body.classList.add('locked');
  });

  close.addEventListener('click', () => {
    modal.style.display = 'none';
    body.classList.remove('locked');
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
      body.classList.remove('locked');
    }
  });
}

function toggleRegistrationForm() {
  const loginForm = document.getElementById('loginForm');
  const registrationForm = document.getElementById('registrationForm');
  const registrationLink = document.getElementById('registrationLink');

  loginForm.style.display = 'none';
  modalBtnEnter.style.display = 'none';
  registrationForm.style.display = 'block';
  registrationLink.textContent = 'Увійти';
  modalTitle.textContent = 'Реєстрація';
  registrationLink.onclick = toggleLoginForm;
}

function toggleLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const registrationForm = document.getElementById('registrationForm');
  const registrationLink = document.getElementById('registrationLink');

  loginForm.style.display = 'block';
  registrationForm.style.display = 'none';
  registrationLink.textContent = 'Зареєструватись';
  registrationLink.onclick = toggleRegistrationForm;
}

// Initialize modal with default content
bindModal('.modal__btn', '.modal__wrapper', '.modal__close');


