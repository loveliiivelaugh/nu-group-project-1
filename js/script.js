const displayDataContainer = document.getElementById("display-data-container");
const favoritesContainer = document.getElementById("favorites");
var searchForm = document.getElementById('foodSearchForm');
var searchFormBtn = document.getElementById('foodSearchFormBtn');
var search = document.getElementById('search');
var results = document.getElementById('results');
var centerSection = document.getElementById('center-section');
var groceryList = document.getElementById("grocery-list");
var registerBtn = document.getElementById("register-btn")
var loginBtn = document.getElementById("login-btn")
var authPage = document.querySelector(".auth-page");

const handleLocalStorage = (action, nameOfStorage, data) => {
  switch (action) {
    case "initialize":
      return localStorage.getItem(nameOfStorage) ?
      JSON.parse(localStorage.getItem(nameOfStorage)) : [];
    case "get":
      return JSON.parse(localStorage.getItem(nameOfStorage));
    case "set":
      return localStorage.setItem(nameOfStorage, JSON.stringify(data));
    case "clear":
      return localStorage.setItem(nameOfStorage);
    default:
      break;
  }
};

//initialize recipeStorage
let recipeStorage = handleLocalStorage("initialize", "recipes");
const updateRecipeStorage = () => recipeStorage = handleLocalStorage("get", "recipes");
console.log(recipeStorage)
//initialize favoriteRecipeStorage
let favoriteRecipeStorage = handleLocalStorage("initialize", "favoriteRecipes");
const updateFavoriteRecipeStorage = () => favoriteRecipeStorage = handleLocalStorage("get", "favoriteRecipes");
//initialize userStorage
let userStorage = handleLocalStorage("initialize", "users");
const updateUserStorage = () => userStorage = handleLocalStorage("get", "users");
//initialize authentication
let auth = handleLocalStorage("initialize", "auth");
const updateAuth = () => auth = handleLocalStorage("get", "auth");
//initialize shopping cart
let cart = handleLocalStorage("initialize", "cart");
const updateCart = () => cart = handleLocalStorage("get", "cart");

let currentSearchResults = [];

// console.info(recipeStorage, favoriteRecipeStorage, userStorage, auth)

const handleAuthButtons = ( ) => {

};


//special switch case function to handle routing and switching the pages.
const switchPage = (page) => {
  switch (page) {
    case "toMain":
      //switch from landing page to main page
      document.querySelector("#landing-page").style.display = "none";
      document.getElementById("main-section").style.display = "block";
      break;
    case "toLanding":
      //switch from highscores page or endGame page to landing page
      document.getElementById("end-game-page").style.display = "none";
      document.querySelector("#highscores-page").style.display = "none";
      document.querySelector("#landing-page").style.display = "block";
      break;
    case "toHighScores":
      //switch from main page or endGame page to highscores page
      document.getElementById("end-game-page").style.display = "none";
      document.getElementById("main-section").style.display = "none";
      document.querySelector("#highscores-page").style.display = "block";
      break;
    case "toEndGame":
      //switch from main page to end page
      document.querySelector("#landing-page").style.display = "none";
      document.getElementById("main-section").style.display = "none";
      document.getElementById("end-game-page").style.display = "block";
      break;
    default:
      break;
  }
}



const setFavorites = () => {
  if (auth.isUserLoggedIn) {
    favoritesContainer.innerHTML = `
      <h3>${auth.emailLoggedIn}'s Favorite Recipe's</h3>
      ${favoriteRecipeStorage
        .filter(favorite => favorite.userEmail === auth.emailLoggedIn)
        .map(favorite => `<li>${favorite.recipeName ? favorite.recipeName : "Add some favorites!"}</li>`)
        .join("")
      }
    `;
  }
  else {
    favoritesContainer.innerHTML = `
      ${favoriteRecipeStorage
        .filter(favorite => favorite.userEmail === auth.emailLoggedIn)
        .map(favorite => `<li>${favorite.recipeName}</li>`)
        .join("")
      }
    `;
  }
};

// setFavorites();

const handleAddToFavorites = event => {
  favoriteRecipeStorage.push({ 
    userEmail: auth.isUserLoggedIn ? auth.emailLoggedIn : "default@test.com",
    recipeName: event.target.data.recipe,
  });
  handleLocalStorage("set", "favoriteRecipes", favoriteRecipeStorage);
  updateFavoriteRecipeStorage();
  setFavorites();
};

function handleAddToShopping(event) {
  const recipeName = event.target.dataset.recipe;
  if ( currentSearchResults.results ) {
      for ( let i = 0 ; i < currentSearchResults.results.length; i++ ) {
        if ( currentSearchResults.results[i].name === recipeName ) {
          cart.push(currentSearchResults.results[i].sections[0].components);
          handleLocalStorage("set", "cart", cart);
          groceryList.innerHTML = `
            <h2>Grocery List</h2>
            <ul>
              ${cart.map(item => item.map(item => `<li>${item.raw_text}</li>`).join("")).join("")}
            </ul>
          `;
        }
      }
  }
}


var handleRecipeClick = event => {
  const index = event.target.dataset.index;
  let recipe = currentSearchResults.results && currentSearchResults.results[index];
  centerSection.innerHTML =`
    <div class="card">
      <div class="card-image">
        <img src="${recipe.thumbnail_url}" alt="Picture coming soon">
        <span class="card-title">${recipe.name}</span>
        <a class="btn-floating halfway-fab waves-effect waves-light red">
          <i class="material-icons">add</i>
        </a>
      </div>

      <div class="card-content">
          <p><span class="material-icons">access_time</span>
            <span>${recipe.total_time_tier && recipe.total_time_tier.diplay_tier} </span>
            <span id="servings">${recipe.yields && recipe.yields}</span>
            <a class="btn-floating"><i class="material-icons" id="addBtn">add</i></a>
            <a class="btn-floating"><i class="material-icons" id="removeBtn">remove</i></a>
          </p>
        <a 
          class="btn-floating halfway-fab waves-effect waves-light red" 
          onclick="handleAddToFavorites(event)" 
          data-recipe="${recipe.name}" 
          data-id="${1234}"
        >
          <i class="material-icons" id="favoriteBtn">favorite</i>
        </a>
      </div>

      <div class="card">
        <div class="card-image"></div>
          <div class="card-content">
            <ul>
              ${recipe.sections[0].components && recipe.sections[0].components.map(component => `
                <li><span class="material-icons">check_circle</span> ${component.raw_text}</li>
              `).join("")}
            </ul>
            <a 
              class="btn-floating" 
              
            ><i class="material-icons" id="cartBtn" onclick="handleAddToShopping(event)" 
            data-recipe="${recipe.name}">shopping_cart</i></a>
          </div>
        </div>
      </div>
    </div>
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
        `<li>${instruction.position}. ${instruction.display_text}</li>`
        )
        .join("")}
      </ul>
      <p>${recipe.description && recipe.description}</p>
  `;
};

const setRecipeResults = data => {
  currentSearchResults = data;
  results.innerHTML = `
    <h3>Results list items</h3>
    <ul>
    ${
      data &&
      data.results.map((recipe, index) => `
        <li class="collection-item avatar" onclick="handleRecipeClick(event)" data-recipe="${recipe.name}">
          <img src="${recipe.thumbnail_url}" alt="recipe thumbnail" thumbnail class="circle" style="max-height: 50px;">
          <p data-index="${index}">${recipe.name}</p>
          <p data-index="${index}">${recipe.description}</p>
          <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
        </li>
      `)
      .join("")
    }
    </ul>
  `;
};

const setRecipeData = (data) => {
  let index = 0;
  let results = [];
  if (data.results) { results = data.results && console.info(data); }
  if (data.target) { console.info(data.target.dataset.index); }

  console.log(data)
  centerSection.innerHTML = `
  ${results && results.length > 0 && results.slice(index, 1).map(recipe => `
    <div class="card">
      <h2>${recipe.name}</h2>
      <img id="meal-image" src=${recipe.thumbnail_url} alt=${recipe.name}/>
      <button onclick="handleAddToFavorites(event)" data-recipe="${recipe.name}" data-id="${1234}">Add to Favorites</button>
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

setRecipeData(recipeStorage[0]);

const getMeals = async (query) => {
  const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=40&tags=under_30_minutes&q=${query}`;

  console.log("I am fetching!");

  await fetch(url, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "ac72153c36mshd1814c8f1af20f3p1518fbjsnabee85184908",
      "x-rapidapi-host": "tasty.p.rapidapi.com"
    }
    })
    .then(response => response.json())
    .then(data => {
      // recipeStorage.push(data);
      // handleLocalStorage("set", "recipes", recipeStorage);
      setRecipeData(data);
      setRecipeResults(data)
      handleRecipeClick(data);
    })
    .catch(err => {
      console.error(err);
    });  
  };

loginBtn.addEventListener("click", event => { 
  console.log("Ive been clicked")
  authPage.style.display = "flex";
})
registerBtn.addEventListener("click", event => {
  authPage.style.display = "flex";
})

searchForm.addEventListener('submit', function(event){ 
  event.preventDefault();
  getMeals(search.value);
  search.value = '';
});



  //AUTHENTICATION
//code below is for authentication
const authForm = document.getElementById("authForm");
const nav = document.getElementById("nav");

// ) => {//DATA MODELS
  // userStorage == [
    // {
  //   email: '',
  //   password: ''
    // }, 
    // {

    // } //etc...
  // ];
  // auth == {
  //   isUserLoggedIn: Boolean,
  //   authToken: ''
  // };
  // recipeStorage == [
  //   {
  //     results: {}, //a stored default recipe search results (chicken)
  //   }, //etc...
  // ]
// };

const handleLogin = event => handleSubmit(event);
const handleLogout = event => handleSubmit(event);
const handleRegister = event => handleSubmit(event);

const setAuthForm = (type) => {
  switch (type) {
    case "signin":
      authForm.innerHTML = `
        <input id="email" type="email" name="email" placeholder="Enter a valid email address">
        <input id="password" type="password" name="password" placeholder="password">
        <button id="signin" type="submit" onclick="handleLogin(event)" class="btn">Login</button>
      `;
      break;
    case "signout":
      authForm.innerHTML = `
        <input id="email" type="email" name="email" placeholder="Enter a valid email address">
        <input id="password" type="password" name="password" placeholder="password">
        <button id="signout" type="submit" onclick="handleLogout(event)"  class="btn">Logout</button>
      `;
      break;
    case "register":
      authForm.innerHTML = `
        <input id="email" type="email" name="email" placeholder="Enter a valid email address">
        <input id="password" type="password" name="password" placeholder="password">
        <button id="register" type="submit" onclick="handleRegister(event)" class="btn">Register</button>
      `;
      break;
    default:
      break;
  }
};

const setAuth = () => {
  console.info("Whats going on here?", userStorage.length, auth)
  if (auth ) {
    if ( auth.isUserLoggedIn ) {
        nav.innerHTML = `
          <p>Logged in as ${auth.emailLoggedIn}</p>
          <button id="signout" onclick="handleLogout(event)" data-email=${auth.emailLoggedIn} class="btn">Log Out</button>
        `;
        setAuthForm("signout");
    } else {
        nav.innerHTML = `
          <button class="btn">Log in</button>
        `;
        setAuthForm("signin");
    }

  }
  else {
    nav.innerHTML = `
        <button class="btn">Log in</button>
      `;
      setAuthForm("signin");
  }
};

let loggedInUser = {
  email: null,
  token: null
};
auth.isUserLoggedIn ? 
loggedInUser = { 
  email: auth.emailLoggedIn, 
  token: auth.token 
} : 
loggedInUser = {
  email: null,
  token: null
};

auth.isUserLoggedIn ? setAuth() && setFavorites() : setAuthForm("signin") && setFavorites();

const generateToken = event => "I am a token!";

const handleSubmit = (event) => {
  event.preventDefault();
  let user = {};

  console.log(event);

  if (document.querySelector("#email")) {
    user = {
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value,
    };
  }

  let token = '';

  switch (event.target.id) {

    case "register":
      userStorage.push(user);
      console.info(userStorage)
      handleLocalStorage("userStorage", "set", userStorage);
      setAuth(); //if user is currently logged in, log them out before logging in the new person.
      token = generateToken();
      handleLocalStorage("set", "auth", {
        isUserLoggedIn: true, 
        token: token, 
        emailLoggedIn: user.email
      });
      loggedInUser = {
        email: user.email,
        token: token
      };
      setAuth();
      break;

    case "signin":
      if ( userStorage.length > 0 ) {
        userStorage.forEach(user => {
          if (user.email == user.email && user.password == user.password) {
            token = generateToken();
            handleLocalStorage("set", "auth", {
              isUserLoggedIn: true, 
              token: token, 
              emailLoggedIn: user.email
            });
            loggedInUser = {
              email: user.email,
              token: token
            };
            setAuth();
            setFavorites();
          }
          else { alert("Please enter a valid email and password."); }
        });
      }
      else {
        alert("No users found with those credentials.");
        if (confirm("Would you like to register instead?")) {
          setAuthForm("register");
        }
      }
      break;

    case "signout":
      handleLocalStorage("set", "auth", {isUserLoggedIn: false});
      loggedInUser = {
        email: user.email,
        token: token
      };
      console.info(loggedInUser, auth);
      setAuth();
      break;

    default:
      break;
  }

  email.value = '';
  password.value = '';
};