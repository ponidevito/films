let selectHeader = document.querySelector(".select__header");
let selectItem = document.querySelectorAll(".select__item");
let selectBody = document.querySelector(".select__body");
let html=document.querySelector("html")

const allLang = ["en", "es", "ua"];

let select = function () {
  selectItem.forEach((item) => {
    item.addEventListener("click", selectChoose);
  });

  selectHeader.addEventListener("click", selectToggle);

  function selectToggle() {
    selectBody.classList.add("opacity");
    event.stopPropagation();
  }



  function selectChoose() {
    
    let text = this.innerText,
      select = this.closest(".select"),
      currentText = select.querySelector(".select__current");
    currentText.innerText = text;
    let lang = this.innerText;
    location.href = window.location.pathname + "#" + lang.toLowerCase();
    localStorage.setItem('place1', lang);
    selectBody.classList.remove("opacity");
    location.reload();
    
    if(localStorage.getItem('place1')){ 
      lang = localStorage.getItem('place1');
    }
  }
};

select();

window.addEventListener("load",function(){ if(localStorage.getItem('place1'))  document.querySelector('.select__current').innerHTML=localStorage.getItem('place1')})

function changeLanguage() {
  let hash = window.location.hash;
  hash = hash.substring(1);

  if (!allLang.includes(hash)) {
    location.href = window.location.pathname + "#en";
    location.reload();
  }
  document.querySelector("title").innerHTML = langArr["unit"][hash];
  for (let key in langArr) {
    let elem = document.querySelector(".lng-" + key);
    if (elem) {
      elem.innerHTML = langArr[key][hash];
    }
  }
}
changeLanguage();

html.addEventListener('click', function(e) {
  if(e.target.tagName == 'HTML' || e.target.tagName == 'BODY'){
      selectBody.classList.remove('opacity');
  }
});


