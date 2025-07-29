const spinnerEl = document.querySelector(".lds-ring");
const loadingMessage = document.querySelector(".loading__message");

export function renderLoadScreen(location) {
  spinnerEl.innerHTML = `
        <div></div>
        <div></div>
        <div></div>
        <div></div>
`;

  loadingMessage.innerHTML = `Lade Wetter für ${location}`;
}
