const body = document.getElementsByTagName("body");

export function renderStartScreen() {
  body[0].innerHTML = `
    <div id="app-start">
        <div class="headline">
            <div class="headline__title">Wetter</div>
            <a href="" class="headline__edit">Bearbeiten</a>
        </div>
        <input class="searchfield" placeholder="Nach Stadt suchen..." />
        <div class="favourites">
            <div id=1 class="favourite">
                <div class="favourite__location">
                    <span class="favourite__city">Dunningen</span>
                    <span class="favourite__country">Germany</span>
                </div>
                <div class="favourite__temperature">22°</div>
                <div class="favourite__condition">Sonnig</div>
                <div class="favourite__max-min-temp">
                    <span class="favourite__max-temp">H: 21°</span>
                    <span class="favourite__min-temp">T: 11°</span>
                </div>
            </div>
            <div id=2 class="favourite">
                <div class="favourite__location">
                    <span class="favourite__city">Peking</span>
                    <span class="favourite__country">China</span>
                </div>
                <div class="favourite__temperature">22°</div>
                <div class="favourite__condition">Sonnig</div>
                <div class="favourite__max-min-temp">
                    <span class="favourite__max-temp">H: 21°</span>
                    <span class="favourite__min-temp">T: 11°</span>
                </div>
            </div>
            <div id=3 class="favourite">
                <div class="favourite__location">
                    <span class="favourite__city">New York</span>
                    <span class="favourite__country">USA</span>
                </div>
                <div class="favourite__temperature">22°</div>
                <div class="favourite__condition">Sonnig</div>
                <div class="favourite__max-min-temp">
                    <span class="favourite__max-temp">H: 21°</span>
                    <span class="favourite__min-temp">T: 11°</span>
                </div>
            </div>
        </div>
    </div>
    `;
}
