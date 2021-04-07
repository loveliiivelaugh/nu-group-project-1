const displayDataContainer = document.querySelector("#display-data-container");

const handleLocalStorage = (action, nameOfStorage, data) => {
  let storage = [];
  switch (action) {
    case "initialize":
      storage = localStorage.getItem(nameOfStorage) ?
      JSON.parse(localStorage.getItem(nameOfStorage)) : [];
      return storage;
    case "get":
      //code block
      break;
    case "set":
      localStorage.setItem(nameOfStorage, JSON.stringify(data));
      break;
    case "clear":
      //code block
      break;
    default:
      null;
  }
};

//initialize userStorage
const userStorage = handleLocalStorage("initialize", "users");
//initialize recipeStorage
const recipeStorage = handleLocalStorage("initialize", "recipes");
//initialize favoriteRecipeStorage
const favoriteRecipeStorage = handleLocalStorage("initialize", "favoriteRecipes");

const setRecipeData = () => {
  displayDataContainer.innerHTML = `
  ${recipeStorage[0].results.map(recipe => `

    <img id="meal-image" src=${recipe.thumbnail_url} alt=${recipe.name}/>
    <p>${recipe.name}</p>
    `).join("")
  }`;
};

setRecipeData()

const getMeals = async () => {
  const url = "https://tasty.p.rapidapi.com/recipes/list?from=0&size=40&tags=under_30_minutes&q=chicken";

  await fetch(url, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "<your-api-key>",
      "x-rapidapi-host": "tasty.p.rapidapi.com"
    }
    })
    .then(response => response.json())
    .then(data => {
      console.info(data)
      recipeStorage.push(data);
      handleLocalStorage("set", "recipes", recipeStorage);
    })
    .catch(err => {
      console.error(err);
    });  
  };

  // getMeals();
  console.info(recipeStorage);

  const form = document.querySelector("form");
  let email = document.querySelector("#email");
  let password = document.querySelector("#password");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.info({
      email: email.value,
      password: password.value
    }, userStorage);
    const user = {
      email: email.value,
      password: password.value
    };
    userStorage.push(user);
    handleLocalStorage("userStorage", "set", userStorage);

    email.value = '';
    password.value = '';
  };

  form.addEventListener("submit", (event) => handleSubmit(event));