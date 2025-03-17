// Слушатель события для добавления аниме
document.getElementById("addAnimeBtn").addEventListener("click", function() {
  const fileInput = document.getElementById("animeImageInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Пожалуйста, выберите файл.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const imgElement = document.createElement("img");
    imgElement.src = e.target.result;
    imgElement.alt = file.name;

    // Создаем элемент аниме
    const animeElement = document.createElement("div");
    animeElement.classList.add("anime-item");
    animeElement.appendChild(imgElement);

    // Добавляем в первый доступный Tier (по умолчанию "S")
    const firstTier = document.querySelector('[data-tier="S"]');
    firstTier.appendChild(animeElement);
  };
  reader.readAsDataURL(file);
});

// Инициализация перетаскивания с помощью SortableJS
new Sortable(document.getElementById("animeTierList"), {
  group: "anime-tiers",
  draggable: ".anime-item",
  onStart(evt) {
    evt.from.style.background = "#f0f0f0";
  },
  onEnd(evt) {
    evt.from.style.background = "";
  }
});
