// login

function submitForm() {
    // Отримати значення з input 
    let emailValue = document.getElementById("loginForm").elements.email.value;
    let passwordValue = document.getElementById("loginForm").elements.password.value;
  
    // Вивести значення у консоль
    console.log("Email:", emailValue);
    console.log("Password:", passwordValue);
  }
  
