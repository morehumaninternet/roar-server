/*
  Open the video modal when clicking on "Watch Video" or the gif.
  Close the video modal when clicking outside the video or pressing on the Escape key.
*/

const toggleModal = () => {
  document.querySelector(".modal").classList.toggle("modal--hidden")
}

document.querySelector(".btn--watch").addEventListener("click", toggleModal)
document.querySelector(".hero__gif").addEventListener("click", toggleModal)
document.querySelector(".modal").addEventListener("click", toggleModal)

document.onkeydown = (event) => {
  event = event || window.event
  let isEscape = false
  if ("key" in event) {
    // For IE/EDGE the key is "Esc"
    isEscape = event.key === "Escape" || event.key === "Esc"
  } else {
    // Support for old browsers
    isEscape = event.keyCode === 27
  }
  const modalClassNames = document.querySelector(".modal").classList
  if (isEscape && !modalClassNames.contains("modal--hidden")) {
    toggleModal()
  }
}

/*
  Toggle FAQ item content when clicking on FAQ headline.
*/
const acc = document.getElementsByClassName("acc-item")

Array.prototype.forEach.call(acc, el => {
  el.addEventListener("click", () => {
    Array.prototype.forEach.call(acc, otherEl => {
      if (el !== otherEl) {
        otherEl.classList.remove("active")
      }
    })
    el.classList.toggle("active")
  })
})
