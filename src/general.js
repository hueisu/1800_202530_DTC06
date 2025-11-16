import $ from "jquery";

export function formatPrice(number) {
  return parseFloat(number.toFixed(2));
}

export function isNumericString(str) {
  return typeof str === "string" && !Number.isNaN(Number(str));
}

export function showLoading() {
  $("body").prepend(
    `<div id="loading" class="z-99 w-screen h-[100%] bg-gray-200/80 fixed">
      <div class="flex items-center justify-center h-full">
        <div class="w-[200px]">
          ${SNPINNER}
        </div>
      </div>
    </div>`
  );
}

export function hideLoading() {
  $("#loading").remove();
}

export function showAlert(msg = "", type = "") {
  let bgColor = "bg-yellow-300";
  switch (type) {
    case "warning":
      bgColor = "bg-yellow-300";
      break;
    case "success":
      bgColor = "bg-green-300";
      break;
    default:
      bgColor = "bg-gray-300";
  }

  $("body").prepend(`
    <div
      class="w-full ${bgColor} text-gray-600 z-999 fixed text-center text-2xl"
      id="alert"
    >
      ${msg}
    </div>
  `);

  setTimeout(hideAlert, 3000);
}

export function hideAlert() {
  $("#alert").remove();
}

export function showModal(msg = "", onConfirm = () => console.log("confirm")) {
  const $modal = $(`
    <div
      class="w-full h-full bg-gray-100/80 text-gray-900 z-999 fixed text-center text-2xl flex items-center justify-center"
      id="modal"
    >
      <div class="bg-gray-300 w-80 max-w-[400px] h-80 rounded flex flex-col p-5 justify-center">
        <div class="flex-1 self-center flex items-center">
          <div class>${msg}</div>
        </div>
        <div class="flex justify-center gap-5">
          <button id="cancel-modal" class="border px-3 py-1 rounded">Cancel</button>
          <button id="confirm-modal" class="border px-3 py-1 rounded">Confirm</button>
        </div>
      </div>
    </div>
  `);
  $modal.on("click", "#cancel-modal", hideModal);
  $modal.on("click", "#confirm-modal", () => {
    onConfirm();
    hideModal();
  });
  $("body").prepend($modal);
}

function hideModal() {
  $("#modal").remove();
}

const SNPINNER = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <radialGradient
    id="a11"
    cx=".66"
    fx=".66"
    cy=".3125"
    fy=".3125"
    gradientTransform="scale(1.5)"
  >
    <stop offset="0" stop-color="#9E9E9E"></stop>
    <stop offset=".3" stop-color="#9E9E9E" stop-opacity=".9"></stop>
    <stop offset=".6" stop-color="#9E9E9E" stop-opacity=".6"></stop>
    <stop offset=".8" stop-color="#9E9E9E" stop-opacity=".3"></stop>
    <stop offset="1" stop-color="#9E9E9E" stop-opacity="0"></stop>
  </radialGradient>
  <circle
    transform-origin="center"
    fill="none"
    stroke="url(#a11)"
    stroke-width="4"
    stroke-linecap="round"
    stroke-dasharray="200 1000"
    stroke-dashoffset="0"
    cx="100"
    cy="100"
    r="70"
  >
    <animateTransform
      type="rotate"
      attributeName="transform"
      calcMode="spline"
      dur="2"
      values="360;0"
      keyTimes="0;1"
      keySplines="0 0 1 1"
      repeatCount="indefinite"
    ></animateTransform>
  </circle>
  <circle
    transform-origin="center"
    fill="none"
    opacity=".2"
    stroke="#9E9E9E"
    stroke-width="4"
    stroke-linecap="round"
    cx="100"
    cy="100"
    r="70"
  ></circle>
</svg>
`;
