const appEl = document.querySelector(".app-default");

export function renderLoadScreen(location) {
  appEl.innerHTML += `
  <div class="lds-ring">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>

`;

  appEl.innerHTML += `
  <div class="loading__message">  Lade Wetter für ${location}</div>
  `;
}
