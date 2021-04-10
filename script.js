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
      break;
  }
};

//initialize userStorage
const userStorage = handleLocalStorage("initialize", "users");
//initialize recipeStorage
const recipeStorage = handleLocalStorage("initialize", "recipes");
console.info(recipeStorage)
//initialize favoriteRecipeStorage
const favoriteRecipeStorage = handleLocalStorage("initialize", "favoriteRecipes");

const setRecipeData = (recipeStorage) => {
  console.info(recipeStorage[0].results[0])
  displayDataContainer.innerHTML = `
  ${recipeStorage[0].results.map(recipe => `
    <div class="card">
      <h2>${recipe.name}</h2>
      <img id="meal-image" src=${recipe.thumbnail_url} alt=${recipe.name}/>
      <h3>Nutrition</h3>
      <table>
        <tr>
          <th>Calories</th>
          <th>Carbohydrates</th>
          <th>Fat</th>
          <th>Fiber</th>
          <th>Protein</th>
          <th>Sugar</th>
        </tr>
        ${recipe.nutrition && `
          <tr>
          <td>${recipe.nutrition.calories ? recipe.nutrition.calories : ''}</td>
          <td>${recipe.nutrition.carbohydrates ? recipe.nutrition.carbohydrates : ''}</td>
          <td>${recipe.nutrition.fat ? recipe.nutrition.fat : ''}</td>
          <td>${recipe.nutrition.fiber ? recipe.nutrition.fiber : ''}</td>
          <td>${recipe.nutrition.protein ? recipe.nutrition.protein : ''}</td>
          <td>${recipe.nutrition.sugar ? recipe.nutrition.sugar : ''}</td>
        </tr>
        `}
      </table>
      <h3>Instructions</h3>
      <ul>
      ${recipe.instructions && recipe.instructions.map(instruction => 
        `
          <li>${instruction.position}. ${instruction.display_text}</li>
        `
      ).join("")}
      </ul>
      <p>${recipe.description && recipe.description}</p>

      ${recipe.sections && `
      <h3>Ingredients</h3>
      <ul>
        <li>
        ${recipe.sections[0].components && recipe.sections[0].components.map(component => (
          `
          <div>
            <h4>${component.ingredient.name}</h4>
            <p>${component.raw_text}</p>
            <ul>
            ${component.measurements.map(measurement => (
              `
                <li>${measurement.quantity} ${measurement.unit.name}</li>
              `
              ))}
            </ul>
          </div>
            `
          )).join("")}
        </li>
      </ul>
      `}
      <p>Cook time: ${recipe.total_time_tier && recipe.total_time_tier.diplay_tier}</p>
      <p>Servings: ${recipe.yields && recipe.yields}</p>
    </div>
    `).join("")
  }`;
};

setRecipeData(recipeStorage);

const getMeals = async () => {
  const url = "https://tasty.p.rapidapi.com/recipes/list?from=0&size=40&tags=under_30_minutes&q=salmon";

  console.log("I am fetching!");

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


//code below is for authentication
//todo -> in progress!
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
