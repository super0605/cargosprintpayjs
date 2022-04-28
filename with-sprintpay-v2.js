// The pay button should be like following:
// https://cargosprint-popup.firebaseapp.com/assets/scripts/with-sprintpay.js
// <button class="with-sprintpay__button" redirect="false" callbackUrl="http://waleup.com"></button>

// Your CSS as text
var styles = `
  .with-sprintpay__modal {
    top: 0%;
    left: 0%;
    width: 100vw;
    height: 100vh;
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    // background: #fff;
  }
  .with-sprintpay__modal-child {
    top: 50%;
    left: 50%;
    width: 424px;
    height: 545px;
    background: white;
    position: absolute;
    transform: translate(-50%, -50%);
  }
  .with-sprintpay__button {
    background-image: url(https://cargosprint-popup.firebaseapp.com/assets/img/SprintPay-horizontal-color.svg);
    background-repeat: no-repeat;
    background-size: 60%;
    background-position: center;
    border: solid 1px #14bb9c;
    border-radius: 4px;
    width: 160px;
    height: 40px;
    color: transparent;
    cursor: pointer;
  }
`;

function loadCSS() {
  var styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function createIframe(modalInstance) {
  var iframe = document.createElement("iframe");
  // const payButton = document.getElementsByClassName(
  //   "with-sprintpay__button"
  // )[0];
  // const callbackUrl = payButton.getAttribute("callbackUrl");

  // const iPath = `sprintpay/account-type-popup`;
  // const iPath = `http://localhost:4201/login-with-sprintpay`;
  const iPath = `https://cargosprint-popup.firebaseapp.com/login-with-sprintpay`;

  iframe.src = iPath;
  iframe.id = "ifrm-with-sprintpay";
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.frameBorder = "0";
  iframe.scrolling = "0";
  // iframe.style.border= "none";
  iframe.style.background = "white";

  modalInstance.appendChild(iframe);
}

function removeModal() {
  // find the modal and remove if it exists
  const modal = document.querySelector(".with-sprintpay__modal");
  if (modal) {
    modal.remove();
  }
}

function renderModal() {
  // create the background modal div
  const modal = document.createElement("div");
  modal.classList.add("with-sprintpay__modal");

  // create the inner modal div with appended argument
  const child = document.createElement("div");
  child.classList.add("with-sprintpay__modal-child");
  // child.innerHTML = element;

  // render the modal with child on DOM
  modal.appendChild(child);
  document.body.appendChild(modal);

  // render iframe
  createIframe(child);

  // remove modal if background clicked
  modal.addEventListener("click", (event) => {
    if (event.target.className === "with-sprintpay__modal") {
      removeModal();
    }
  });
}

function findElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }
    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

async function loadModal() {
  const button = await findElement(".with-sprintpay__button");
  if (button) {
    button.addEventListener("click", (event) => {
      console.log("Added EventListener for sprintpay");
      // render the modal
      renderModal();
    });
  }
}

function sendToken(url, token) {
  
  // Creating Our XMLHttpRequest object 
  var xhr = new XMLHttpRequest();

  // Making our connection  
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  // function execute after request is successful 
  xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          console.log('ajax token response:', this.responseText);
      }
  }
  // Sending our request 
  xhr.send(`accessToken=${token}`);
}

function loadIframePostMsg() {
  // Create IE + others compatible event handler
  var eventMethod = window.addEventListener
    ? "addEventListener"
    : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

  // Listen to message from child window
  eventer(
    messageEvent,
    function (e) {
      console.log("sprintpay received message!:  ", e.data);
      if (
        e.data &&
        e.data.toString().includes("with_sprintpay_access_token:")
      ) {
        const payButton = document.getElementsByClassName(
          "with-sprintpay__button"
        )[0];
        const callbackUrl = payButton.getAttribute("callbackUrl");
        const isRedirect = payButton.getAttribute("redirect");
        const accessToken = e.data.split("with_sprintpay_access_token:")[1];
        
        console.log("sprintpay callbackUrl: ", callbackUrl);

        removeModal();

        console.log("00000000000000000 ========================>", accessToken)
        
        console.log("11111000000000000000000001111111 ========================>", isRedirect)
        console.log("111111111111 ========================>", callbackUrl)

        if (isRedirect === "true") {
          console.log("22222222222222222 ========================>", `${callbackUrl}?sprintpay_token=${accessToken}`)
          // For the 3rd party website
          window.location.replace(
            `${callbackUrl}?sprintpay_token=${accessToken}`
          );
        } else {
          console.log("333333333333333333 ========================>", callbackUrl)
          // ajax call to sent token
          sendToken(callbackUrl, accessToken);
        }

        // For the local testing case
        // window.location.replace(
        //   `${window.location.href}?sprintpay_token=${accessToken}`
        // );
      }
    },
    false
  );
}

function init() {
  loadCSS();
  loadModal();
  loadIframePostMsg();
}

init();
