let categories = ["S", "A", "B", "C"];
let animeData = {
  S: [],
  A: [],
  B: [],
  C: []
};

// Обновление интерфейса с категориями
function updateCategories() {
  const tierListContainer = document.getElementById("animeTierList");
  tierListContainer.innerHTML = "";

  categories.forEach(category => {
    const tier = document.createElement("div");
    tier.classList.add("tier");
    tier.setAttribute("data-tier", category);

    const title = document.createElement("h3");
    title.textContent = `${category} Tier`;
    tier.appendChild(title);

    // Кнопка для добавления аниме в категорию
    const addButton = document.createElement("button");
    addButton.textContent = "Добавить аниме";
    addButton.onclick = () => addAnime(category);
    tier.appendChild(addButton);

    // Добавление кнопки для изменения категории
    const editButton = document.createElement("button");
    editButton.textContent = "Изменить категорию";
    editButton.onclick = () => editCategoryName(category);
    tier.appendChild(editButton);

    // Кнопка для удаления категории
    const removeButton = document.createElement("button");
    removeButton.textContent = "Удалить категорию";
    removeButton.onclick = () => removeCategory(category);
    tier.appendChild(removeButton);

    // Добавляем аниме в категорию
    animeData[category].forEach(item => {
      const animeElement = document.createElement("div");
      animeElement.classList.add("anime-item");
      
      const imgElement = document.createElement("img");
      imgElement.src = item.src;
      imgElement.alt = item.alt;
      animeElement.appendChild(imgElement);
      
      tier.appendChild(animeElement);
    });

    tierListContainer.appendChild(tier);
  });

  // Инициализация перетаскивания с помощью Sortable.js
  new Sortable(tierListContainer, {
    group: "anime-tiers",
    draggable: ".anime-item",
    onEnd(evt) {
      const movedItem = evt.item;
      const sourceCategory = evt.from.getAttribute("data-tier");
      const targetCategory = evt.to.getAttribute("data-tier");

      if (sourceCategory !== targetCategory) {
        // Перемещение аниме между категориями
        const movedAnime = animeData[sourceCategory].find(item => item.src === movedItem.querySelector("img").src);
        animeData[sourceCategory] = animeData[sourceCategory].filter(item => item.src !== movedAnime.src);
        animeData[targetCategory].push(movedAnime);
        saveTierData();
      }
    }
  });
}

// Функция для добавления категории
document.getElementById("addCategoryBtn").addEventListener("click", function() {
  const newCategory = prompt("Введите название новой категории:");
  if (newCategory && !categories.includes(newCategory)) {
    categories.push(newCategory);
    animeData[newCategory] = [];
    updateCategories();
  } else {
    alert("Эта категория уже существует или неверное имя!");
  }
});

// Функция для редактирования названия категории
function editCategoryName(category) {
  const newCategoryName = prompt("Введите новое название категории:", category);
  if (newCategoryName && !categories.includes(newCategoryName)) {
    categories = categories.map(cat => cat === category ? newCategoryName : cat);
    animeData[newCategoryName] = animeData[category];
    delete animeData[category];
    updateCategories();
  } else {
    alert("Невозможно изменить название категории!");
  }
}

// Функция для удаления категории
function removeCategory(category) {
  if (categories.length > 1) {
    categories = categories.filter(cat => cat !== category);
    delete animeData[category];
    updateCategories();
  } else {
    alert("Невозможно удалить последнюю категорию!");
  }
}

// Функция для добавления аниме
function addAnime(category) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      const imgElement = new Image();
      imgElement.src = e.target.result;

      imgElement.onload = function() {
        const anime = {
          src: e.target.result,
          alt: file.name
        };
        
        animeData[category].push(anime);
        updateCategories();
        saveTierData();
      };
    };

    reader.readAsDataURL(file);
  };

  fileInput.click();
}

// Сохранение данных в LocalStorage
function saveTierData() {
  localStorage.setItem("animeData", JSON.stringify(animeData));
}

// Загрузка данных при старте
function loadTierData() {
  const savedData = localStorage.getItem("animeData");
  if (savedData) {
    animeData = JSON.parse(savedData);
    categories = Object.keys(animeData);
  }
  updateCategories();
}

// Генерация и скачивание JSON файла
document.getElementById("downloadBtn").addEventListener("click", function() {
  const jsonData = JSON.stringify(animeData, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "anime-tier-list.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Инициализация
loadTierData();
