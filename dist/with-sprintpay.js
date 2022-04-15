// https://github.com/super0605/cargosprintpayjs/blob/master/with-sprintpay.js
// https://cdn.jsdelivr.net/gh/super0605/cargosprintpayjs/dist/with-sprintpay.js

// Your CSS as text
var styles = `
  .with-sprintpay__modal {
    top: 0%;
    left: 0%;
    width: 100vw;
    height: 100vh;
    position: absolute;
    // background: rgba(0, 0, 0, 0.5);
    background: #fff;
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
`;

function loadCSS() {
  var styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function createIframe(modalInstance) {
  var iframe = document.createElement("iframe");

  // iframe.src = "https://fmm-dev.web.app/";
  iframe.src =
    "http://localhost:4201/login-with-sprintpay?returnUrl=https://vector.ai";
  // iframe.src = "https://don-zhang.vercel.app/";
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

function loadModal() {
  const id = setInterval(() => {
    if (document.querySelector(".with-sprintpay__button")) {
      console.log("Added EventListener for sprintpay", new Date.now());
      document
        .querySelector(".with-sprintpay__button")
        .addEventListener("click", (event) => {
          console.log("Added EventListener for sprintpay", new Date.now());
          // render the modal
          renderModal();
          clearInterval(id);
        });
    }
  }, 1000);

  // document.addEventListener("DOMContentLoaded", () => {
  //   document
  //     .querySelector(".with-sprintpay__button")
  //     .addEventListener("click", (event) => {
  //       console.log("Added EventListener for sprintpay", new Date.now());
  //       // render the modal
  //       renderModal();
  //     });
  // });
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
        const accessToken = e.data.split("with_sprintpay_access_token:")[1];
        console.log("sprintpay access token: ", accessToken);

        // removeModal();
        window.location.replace(
          `${window.location.href}?sprintpay_token=${accessToken}`
        );
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
