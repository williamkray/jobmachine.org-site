// all javascript here is optional, the registration form works fine without
/* 
What this script does:
  - confirm password validator needs javascript, otherwise always valid as long as not empty
  - set token with ?token query parameter
  - set custom validity messages
*/

// see https://stackoverflow.com/a/3028037
function hideOnClickOutside(element) {
  const outsideClickListener = event => {
    if (!element.contains(event.target) && isVisible(
        element)) {
      element.classList.add("hidden")
      removeClickListener()
    }
  }

  const removeClickListener = () => {
    document.removeEventListener("click", outsideClickListener)
  }
  document.addEventListener("click", outsideClickListener)
}

const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

// set token input to "?token=" query parameter
const urlParams = new URLSearchParams(window.location.search)
document.getElementById("token").value = urlParams.get("token")

// set "?lang=" parameter to user lang
const userLang = navigator.language || navigator.userLanguage
if (!urlParams.has("lang")) { 
  urlParams.append("lang", userLang)
  window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
}

// html5 validators
var username = document.getElementById("username")
var password = document.getElementById("password")
var confirm_password = document.getElementById("confirm_password")
var token = document.getElementById("token")

username.addEventListener("input", function (event) {
  if (username.validity.typeMismatch) {
    username.setCustomValidity("format: @username:jobmachine.org")
  } else {
    username.setCustomValidity("")
  }
})

token.addEventListener("input", function (event) {
  if (token.validity.typeMismatch) {
    token.setCustomValidity("case-sensitive, e.g: SardineImpactReport")
  } else {
    token.setCustomValidity("")
  }
})

password.addEventListener("input", function (event) {
  if (password.validity.typeMismatch) {
    password.setCustomValidity('atleast 8 characters long')
  } else {
    password.setCustomValidity("")
  }
})

function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords do not match!")
  } else {
    confirm_password.setCustomValidity("")
  }
}

password.onchange = validatePassword
confirm_password.onkeyup = validatePassword

// Global modal close handler for modal close buttons
const $modalCloseButton = $('.modal-footer-button-close');
$modalCloseButton.click(me => 
  $(me.currentTarget).parents(".modal").addClass('hidden')
);

function showError(message, dialog) {
  document.querySelector("#error header h2").innerHTML = message
  document.getElementById("error_dialog").innerHTML = dialog
  let error = document.getElementById("error")
  error.classList.remove("hidden")
  hideOnClickOutside(error)
}

// hijack the submit button to display the json response in a neat modal
var form = document.getElementById("registration")

function sendData() {
  let XHR = new XMLHttpRequest()

  // Bind the FormData object and the form element
  let FD = new FormData(form)

  // Define what happens on successful data submission
  XHR.addEventListener("load", function (event) {
    console.log(XHR.responseText)
    let response = JSON.parse(XHR.responseText)
    try {
      console.log(response)
    } catch (e) {
      if (e instanceof SyntaxError) {
        showError("Internal Server Error!", "Please contact the server admin about this.")
        return
      }
    }
    if ("errcode" in response) {
      if (response["errcode"] == "MR_BAD_USER_REQUEST") {
        if ("token" in response["error"]) {
          showError(" Token Error ", response["error"]["token"][0])
        } else if ("password" in response["error"]) {
          showError("Password Error", response["error"]["password"][0])
        } else if ("username" in response["error"]) {
          showError("Username Error", response["error"]["username"][0])
        }
        return
      } else {
        showError("Homeserver Error", response["error"])
      }
    } else {
      document.getElementById("welcome").innerHTML = "Welcome"  + response['user_id']
      document.getElementById("success").classList.remove("hidden")
    }

  })

  // Define what happens in case of error
  XHR.addEventListener("error", function (event) {
    showError("Internal Server Error!", "Please contact the server admin about this.")
  })

  // Set up our request
  XHR.open("POST", "/register")

  // The data sent is what the user provided in the form
  XHR.send(FD)
}

// take over its submit event.
form.addEventListener("submit", function (event) {
  event.preventDefault()

  sendData()
})

