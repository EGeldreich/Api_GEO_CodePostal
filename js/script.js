// CITY ELEMENTS
const inputCP = document.querySelector(".cp");
const selectVille = document.querySelector(".ville");

// CP EVENT LISTENER
inputCP.addEventListener("input", () => {
    // get value from input text
    let value = inputCP.value;
    // set input select as empty
    selectVille.innerText = null;

    //fetch request to API Geo, with input value
    fetch(
        `https://geo.api.gouv.fr/communes?codePostal=${value}&fields=region,nom,code,codesPostaux,codeRegion,population,surface,centre&format=json`
    )
        // transform from json format
        .then((response) => response.json())
        // when promise fulfiled
        .then((data) => {
            // display in console for debug
            console.log(data);
            // go through each "ville" object in received data
            data.forEach((ville) => {
                let option = document.createElement("option");
                option.value = ville.nom;
                option.textContent = ville.nom;
                option.dataset.coordinateLat = ville.centre.coordinates[0];
                option.dataset.coordinateLng = ville.centre.coordinates[1];
                option.dataset.population = ville.population;
                selectVille.appendChild(option);
            });
        });
});

// MAP ELEMENTS
let map;
let marker;

// SELECT EVENT LISTENER
selectVille.addEventListener("click", () => {
    // get selected option
    let option = selectVille.selectedOptions[0];
    console.log(option);
    // delete existing map
    if (map) {
        map.off();
        map.remove();
    }

    // set map coordinates via data attribute
    map = L.map("map").setView(
        [option.dataset.coordinateLng, option.dataset.coordinateLat],
        7
    );
    // map tile layers settings and attribution
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    // marker
    marker = L.marker([
        option.dataset.coordinateLng,
        option.dataset.coordinateLat,
    ]).addTo(map);
    marker
        .bindPopup(
            `<b>${option.value}</b><br>${option.dataset.population} habitants`
        )
        .openPopup();
});
