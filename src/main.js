import "./style.css";

const markerList = [];

const map = L.map("map").setView([-19.505, 47.09], 6);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const markerOptions = document.querySelector("#markerOptions");

const renderMarkerOptions = () => {
  document.querySelector("#markerOptions").innerHTML = `
  <h2>Параметры маркера</h2>
  <input placeholder="Тип" type="text" />
  <input placeholder="Название" type="text" />
  <textarea placeholder="Описание" cols="30" rows="10"></textarea>
  <button id="colorBtn">Поменять цвет</button>
  <button id="saveBtn">Сохранить</button>
  <button id="deleteBtn">Удалить</button>`;
};

const configMarker = (marker) => {
  marker.on("dragend", (e) => {
    setToStorage();
  });

  marker.on("click", (e) => {
    const choicedMarker = markerList.indexOf(marker);
    renderMarkerOptions();

    const saveBtn = markerOptions.querySelector("#saveBtn");
    const deleteBtn = markerOptions.querySelector("#deleteBtn");
    const colorBtn = markerOptions.querySelector("#colorBtn");
    const optionsInputs = markerOptions.querySelectorAll("input");
    const markerDesc = markerOptions.querySelector("textarea");

    let colors = markerList[choicedMarker].color;

    markerOptions.style.display = "flex";
    optionsInputs[0].value = markerList[choicedMarker].type;
    optionsInputs[1].value = markerList[choicedMarker].options.title;
    markerDesc.value = markerList[choicedMarker].description;

    colorBtn.addEventListener("click", () => {
      marker._icon.classList.remove(`color${colors}`);
      if (colors < 6) {
        colors++;
      } else {
        colors = 1;
      }
      marker._icon.classList.add(`color${colors}`);
    });

    saveBtn.addEventListener("click", () => {
      if (markerList[choicedMarker]) {
        markerList[choicedMarker].type = optionsInputs[0].value;
        markerList[choicedMarker].options.title = optionsInputs[1].value;
        markerList[choicedMarker].description = markerDesc.value;
        markerList[choicedMarker].color = colors;
        optionsInputs.forEach((inp) => (inp.value = ""));
        markerDesc.value = "";
        markerOptions.style.display = "none";
        setToStorage();
      }
    });

    deleteBtn.addEventListener("click", () => {
      map.removeLayer(marker);
      markerList.splice(choicedMarker, 1);
      setToStorage();
    });
  });
};

const storageMarkers = localStorage.getItem("markers");
if (storageMarkers) {
  const markers = JSON.parse(storageMarkers);
  setTimeout(() => {
    markers.forEach((mark) => {
      const marker = L.marker(mark.latlng, {
        draggable: true,
        title: `${mark.title}`,
      }).addTo(map);
      marker._icon.classList.add(`color${mark.color}`);
      markerList.push(marker);
      markerList[markerList.length - 1].description = mark.description;
      markerList[markerList.length - 1].type = mark.type;
      markerList[markerList.length - 1].color = mark.color;
      configMarker(marker);
    });
  }, 0);
}

const setToStorage = () => {
  localStorage.setItem(
    "markers",
    JSON.stringify(
      markerList.map((mark) => {
        return {
          latlng: mark._latlng,
          title: mark.options.title,
          description: mark.description,
          type: mark.type,
          color: mark.color,
        };
      })
    )
  );
};

const rerenderMarkers = () => {
  markerList.forEach((mark) => {
    if (
      !mark.description.toLowerCase().includes(searchInput.value.toLowerCase())
    ) {
      mark.setOpacity(0);
    } else {
      mark.setOpacity(1);
    }
  });
};

const searchInput = document.querySelector("#search");

searchInput.addEventListener("input", rerenderMarkers);

markerList.forEach((marker) => {
  L.marker(marker.latlng, {
    draggable: true,
    title: `${marker.options.title}`,
  }).addTo(map);
});

map.on("contextmenu", (e) => {
  let colors = 0;
  const marker = L.marker(e.latlng, { draggable: true, title: "Marker" }).addTo(
    map
  );

  renderMarkerOptions();

  const saveBtn = markerOptions.querySelector("#saveBtn");
  const deleteBtn = markerOptions.querySelector("#deleteBtn");
  const colorBtn = markerOptions.querySelector("#colorBtn");
  const optionsInputs = markerOptions.querySelectorAll("input");
  const markerDesc = markerOptions.querySelector("textarea");
  markerList.push(marker);
  const choicedMarker = markerList.length - 1;
  markerOptions.style.display = "flex";
  markerList[choicedMarker].color = colors;

  colorBtn.addEventListener("click", () => {
    marker._icon.classList.remove(`color${colors}`);
    if (colors < 6) {
      colors++;
    } else {
      colors = 1;
    }
    marker._icon.classList.add(`color${colors}`);
  });

  saveBtn.addEventListener("click", () => {
    if (markerList[choicedMarker]) {
      markerList[choicedMarker].type = optionsInputs[0].value;
      markerList[choicedMarker].options.title = optionsInputs[1].value;
      markerList[choicedMarker].description = markerDesc.value;
      markerList[choicedMarker].color = colors;
      optionsInputs.forEach((inp) => (inp.value = ""));
      markerDesc.value = "";
      markerOptions.style.display = "none";
      setToStorage();
    }
  });

  deleteBtn.addEventListener("click", () => {
    map.removeLayer(marker);
    markerList.splice(choicedMarker, 1);
    setToStorage();
  });

  marker.on("dragend", (e) => {
    setToStorage();
  });

  configMarker(marker);
});
