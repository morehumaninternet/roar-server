const toggleModal = () => {
  document.querySelector(".modal").classList.toggle("modal--hidden")
}

document.querySelector(".btn__watch").addEventListener("click", toggleModal)
document.querySelector(".hero-image").addEventListener("click", toggleModal)
document.querySelector(".modal").addEventListener("click", toggleModal)
