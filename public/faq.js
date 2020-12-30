const acc = document.getElementsByClassName("accordion");

Array.prototype.forEach.call(acc, (el) => {
  el.addEventListener("click", () => {
    el.classList.toggle("active");
    let panel = el.nextElementSibling; 
    if (panel.style.display === 'block') {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  })
})