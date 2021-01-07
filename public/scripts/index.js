/*
  Open the video modal when clicking on "Watch Video" or the gif.
  Close the video modal when clicking outside the video or pressing on the Escape key.
*/
const toggleModal = () => {
  document.querySelector(".modal").classList.toggle("modal--hidden")

  let hiddenModal = document.querySelector(".modal").classList.value
  let iFrameDiv =  document.querySelector(".modal iframe")
  if (hiddenModal === "modal modal--hidden") {
    iFrameDiv.setAttribute("src", '')
  } else {
    iFrameDiv.setAttribute("src", "https://www.youtube.com/embed/QH2-TGUlwu4")
  }
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
const acc = document.getElementsByClassName("accordion_item")

Array.prototype.forEach.call(acc, (el) => {
  el.addEventListener("click", () => {
    el.classList.toggle("active")
  })
})

/*
  Subscribe to our newsletter
*/
const toggleSubscriptionResults = () => {
  document.querySelector(".newsletter__form").classList.toggle("hide")
  document.querySelector(".newsletter__promise").classList.toggle("hide")
  document.querySelector(".newsletter__result").classList.toggle("hide")
}

const handleSubmit = async (event) => {
  event.preventDefault()

  const email = document.querySelector(".newsletter__email").value

  let response, result
  try {
    response = await fetch("/v1/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })
  } catch (error) {
    // Network failure or request failed to complete
    console.error({ error })
  }

  if (response && response.ok) {
    result = "✔ Subscribed. Please check your email for a confirmation link."
  } else {
    // Server returned 4xx or 5xx
    result = "✖ Something went wrong. "
    if (response && response.status === 400) {
      result += "You are already subscribed."
    } else {
      result += "Please wait a few minutes and try again."
    }
  }

  document.querySelector(".newsletter__result").innerHTML = result
  toggleSubscriptionResults()

  setTimeout(toggleSubscriptionResults, 5000)
}

document
  .querySelector(".newsletter__form")
  .addEventListener("submit", handleSubmit)
