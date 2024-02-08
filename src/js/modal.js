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


// test 1

// const modalBtnEnter = document.querySelector ('.modal__button')
// const modalTitle = document.querySelector ('.modal__title')


// function bindModal(trigger, modal, close) {
//   trigger = document.querySelector(trigger);
//   modal = document.querySelector(modal);
//   close = document.querySelector(close);
//   const body = document.body;

//   trigger.addEventListener('click', e => {
//     e.preventDefault();
//     modal.style.display = 'flex';
//     body.classList.add('locked');
//   });

//   close.addEventListener('click', () => {
//     modal.style.display = 'none';
//     body.classList.remove('locked');
//   });

//   modal.addEventListener('click', e => {
//     if (e.target === modal) {
//       modal.style.display = 'none';
//       body.classList.remove('locked');
//     }
//   });
// }

// function toggleRegistrationForm() {
//   const loginForm = document.getElementById('loginForm');
//   const registrationForm = document.getElementById('registrationForm');
//   const registrationLink = document.getElementById('registrationLink');

//   loginForm.style.display = 'none';
//   modalBtnEnter.style.display = 'none';
//   registrationForm.style.display = 'flex';
//   registrationLink.textContent = 'Увійти';
//   modalTitle.textContent = 'Реєстрація';
//   registrationLink.onclick = toggleLoginForm;
// }

// function toggleLoginForm() {
//   const loginForm = document.getElementById('loginForm');
//   const registrationForm = document.getElementById('registrationForm');
//   const registrationLink = document.getElementById('registrationLink');

//   loginForm.style.display = 'flex';
//   registrationForm.style.display = 'none';
//   registrationLink.textContent = 'Зареєструватись';
//   registrationLink.onclick = toggleRegistrationForm;
// }

// // Initialize modal with default content
// bindModal('.modal__btn', '.modal__wrapper', '.modal__close');


// test

// const modalBtnEnter = document.querySelector ('.modal-enter')
// const modalTitle = document.getElementById ('title')

// function bindModal(trigger, modal, close) {
//   trigger = document.querySelector(trigger);
//   modal = document.querySelector(modal);
//   close = document.querySelector(close);
//   const body = document.body;

//   trigger.addEventListener('click', e => {
//     e.preventDefault();
//     modal.style.display = 'flex';
//     body.classList.add('locked');
//   });

//   close.addEventListener('click', () => {
//     modal.style.display = 'none';
//     body.classList.remove('locked');
//   });

//   modal.addEventListener('click', e => {
//     if (e.target === modal) {
//       modal.style.display = 'none';
//       body.classList.remove('locked');
//     }
//   });
// }

// function toggleRegistrationForm() {
//   const loginForm = document.querySelector('.first-modal');
//   const registrationForm = document.querySelector('.second-modal');
//   const registrationLink = document.getElementById('registrationLink');
//   const regButton = document.getElementById('reg-button'); // Додаємо клас reg-button


//   loginForm.style.display = 'none';
//   modalBtnEnter.style.display = 'none';
//   registrationForm.classList.add('form-registration')
//   registrationForm.style.display = 'flex';
//   registrationLink.textContent = 'Увійти';
//   registrationLink.style.textAlign = 'start';
//   registrationLink.onclick = toggleLoginForm;
//   regButton.style.display = 'flex';
//   modalTitle.textContent = 'Зареєструватись';
// }

// function toggleLoginForm() {
//   const loginForm = document.querySelector('.first-modal');
//   const registrationForm = document.querySelector('.second-modal');
//   const registrationLink = document.getElementById('registrationLink');
//   const regButton = document.getElementById('reg-button'); // Додаємо клас reg-button

//   loginForm.style.display = 'flex';
//   registrationForm.classList.remove('form-registration')
//   registrationForm.style.display = 'none';
//   registrationLink.textContent = 'Зареєструватись';
//   modalTitle.textContent = 'Вхід';
//   registrationLink.style.textAlign = 'end';
//   registrationLink.onclick = toggleRegistrationForm;
//   regButton.style.display = 'none';
// }

// // Initialize modal with default content
// bindModal('.modal__btn', '.modal__wrapper', '.modal__close');


const firstModal = document.querySelector ('.firstM')
const secondModal = document.querySelector ('.secondM')


if(firstModal) {
  const modalBtnEnter = document.querySelector ('.modal-enter')
  const modalTitle = document.getElementById ('title')
  
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
    const loginForm = document.querySelector('.first-modal');
    const registrationForm = document.querySelector('.second-modal');
    const registrationLink = document.getElementById('registrationLink');
    const regButton = document.getElementById('reg-button'); // Додаємо клас reg-button
  
  
    loginForm.style.display = 'none';
    modalBtnEnter.style.display = 'none';
    registrationForm.classList.add('form-registration')
    registrationForm.style.display = 'flex';
    registrationLink.textContent = 'Увійти';
    registrationLink.style.textAlign = 'start';
    registrationLink.onclick = toggleLoginForm;
    regButton.style.display = 'flex';
    modalTitle.textContent = 'Зареєструватись';
  }
  
  function toggleLoginForm() {
    const loginForm = document.querySelector('.first-modal');
    const registrationForm = document.querySelector('.second-modal');
    const registrationLink = document.getElementById('registrationLink');
    const regButton = document.getElementById('reg-button'); // Додаємо клас reg-button
  
    loginForm.style.display = 'flex';
    registrationForm.classList.remove('form-registration')
    registrationForm.style.display = 'none';
    registrationLink.textContent = 'Зареєструватись';
    modalTitle.textContent = 'Вхід';
    registrationLink.style.textAlign = 'end';
    registrationLink.onclick = toggleRegistrationForm;
    regButton.style.display = 'none';
  }
  
  // Initialize modal with default content
  bindModal('.modal__btn', '.modal__wrapper', '.modal__close');
}

if(secondModal) {
  const modalBtnEnter = document.querySelector ('.modal-enter')
  const modalTitle = document.getElementById ('title')
  
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
    const loginForm = document.querySelector('.first-modal');
    const registrationForm = document.querySelector('.second-modal');
    const registrationLink = document.getElementById('registrationLink');
    const regButton = document.getElementById('reg-button'); // Додаємо клас reg-button
  
  
    loginForm.style.display = 'none';
    modalBtnEnter.style.display = 'none';
    registrationForm.classList.add('form-registration')
    registrationForm.style.display = 'flex';
    registrationLink.textContent = 'Увійти';
    registrationLink.style.textAlign = 'start';
    registrationLink.onclick = toggleLoginForm;
    regButton.style.display = 'flex';
    modalTitle.textContent = 'Зареєструватись';
  }
  
  function toggleLoginForm() {
    const loginForm = document.querySelector('.first-modal');
    const registrationForm = document.querySelector('.second-modal');
    const registrationLink = document.getElementById('registrationLink');
    const regButton = document.getElementById('reg-button'); // Додаємо клас reg-button
  
    loginForm.style.display = 'flex';
    registrationForm.classList.remove('form-registration')
    registrationForm.style.display = 'none';
    registrationLink.textContent = 'Зареєструватись';
    modalTitle.textContent = 'Вхід';
    registrationLink.style.textAlign = 'end';
    registrationLink.onclick = toggleRegistrationForm;
    regButton.style.display = 'none';
  }
  
  // Initialize modal with default content
  bindModal('.modal__btnReg', '.modal__wrapper', '.modal__close');
}