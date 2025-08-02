const body = document.getElementsByTagName("body");

export function renderLoadScreen(message) {
  body[0].innerHTML = `
  <div id="app-loading-detailview">
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="loading__message">${message}</div>
  </div>
`;
}
