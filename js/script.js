
//assign global variables to lik with the DOM elments
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
      return localStorage.getItem(nameOfStorage) ? JSON.parse(localStorage.getItem(nameOfStorage)) : [];
    case "get":
      return JSON.parse(localStorage.getItem(nameOfStorage));
    case "set":
      return localStorage.setItem(nameOfStorage, JSON.stringify(data));
    case "clear":
      console.log("I am clearing ", nameOfStorage)
      return localStorage.clear(nameOfStorage);
    default:
      break;
  }
};

//initialize recipeStorage
let recipeStorage = handleLocalStorage("initialize", "recipes");
const updateRecipeStorage = () => recipeStorage = handleLocalStorage("get", "recipes");
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
let setLoading = false;

const handleAuthButtons = ( ) => {};


//special switch case function to handle routing and switching the pages.
const switchPage = (page) => {
  switch (page) {
    case "toDashboard":
      //switch from landing page or auth page to dashboard page
      document.getElementById("auth-page").style.display = "none";
      document.getElementById("landing-page").style.display = "none";
      document.getElementById("dashboard-page").style.display = "block";
      break;
    case "toLanding":
      //switch from auth page to landing page
      document.getElementById("auth-page").style.display = "none";
      document.getElementById("dashboard-page").style.display = "none";
      document.getElementById("landing-page").style.display = "block";
      break;
    case "toAuth":
      //switch from dashboard page or landing page to auth page
      if (auth.isUserLoggedIn) {
        document.getElementById("landing-page").style.display = "none";
        document.getElementById("dashboard-page").style.display = "block";
        document.getElementById("auth-page").style.display = "none";
      } else {
        document.getElementById("landing-page").style.display = "none";
        document.getElementById("dashboard-page").style.display = "none";
        document.getElementById("auth-page").style.display = "block";
      }
      break;
    default:
      //switch from auth page to landing page
      document.getElementById("auth-page").style.display = "none";
      document.getElementById("dashboard-page").style.display = "none";
      document.getElementById("landing-page").style.display = "block";
      break;
  }
};

// switchPage("toDashboard");


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
        .filter(favorite => favorite.userEmail === "default@test.com")
        .map(favorite => `<li>${favorite.recipeName ? favorite.recipeName : "Add some favorites!"}</li>`)
        .join("")
      }
    `;
  }
};

const toggleGroceryList = (toggle) => {
    switch (toggle) {
      case "groceries":
        setShoppingList();
        break;
      case "favorites":
        setFavorites();
        break;
      default:
        break;
    }
}

function deleteShoppingItem(event) {
  console.info(event.target.dataset.index, cart);
}

const handleAddToFavorites = event => {
  favoriteRecipeStorage.push({ 
    userEmail: auth.isUserLoggedIn ? auth.emailLoggedIn : "default@test.com",
    recipeName: event.target.data.recipe,
  });
  handleLocalStorage("set", "favoriteRecipes", favoriteRecipeStorage);
  updateFavoriteRecipeStorage();
  setFavorites();
};

function handleClearShoppingList(event) {
  handleLocalStorage("clear", "cart");
  setShoppingList();
}

function setShoppingList() {
    groceryList.innerHTML = `
      <div class="card-tabs">
        <ul class="tabs tabs-fixed-width">
          <li class="tab"><a href="#test4">Grocery List</a></li>
          <li class="tab"><a class="active" href="#test5">Favorite Recipe's</a></li>
        </ul>
      </div>
      <h2>Grocery List</h2>
      <ul>
        ${cart.length > 0 ? cart.map(item => item.map((item, index) => `
          <li>
            ${item.raw_text} <button data-index="${index}" class="transparent" style="float: right;" onClick="deleteShoppingItem(event)">X</button>
          </li>
        `).join("")).join("") : `<li>Add some items to your shopping list.</li>`}
      </ul>
      <button class="btn red white-text" onclick="handleClearShoppingList(event)">Clear List</button>
    `;
}

function handleAddToShopping(event) {
  const recipeName = event.target.dataset.recipe;
  if ( currentSearchResults.results ) {
      for ( let i = 0 ; i < currentSearchResults.results.length; i++ ) {
        if ( currentSearchResults.results[i].name === recipeName ) {
          cart.push(currentSearchResults.results[i].sections[0].components);
          handleLocalStorage("set", "cart", cart);
          setShoppingList();
        }
      }
  }
}


var handleRecipeClick = event => {
  console.info(currentSearchResults)

  let recipe = currentSearchResults.results ? 
  currentSearchResults.results[event.target ? event.target.dataset.index : 0] :
  recipeStorage[0].results[0];

  let loading = false;
  if (loading) {
    centerSection.innerHTML = `
    <div class="preloader-wrapper big active">
      <div class="spinner-layer spinner-blue">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
          </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
    `;
  }
    
  centerSection.innerHTML =`
    <div class="card">
      <div class="card-image">
        <img src="${recipe.thumbnail_url}" alt="Picture coming soon">
        <span class="card-title">${recipe.name}</span>
      </div>

      <div class="card-content row">
        <div className="col s6">
          <p>
            <span class="material-icons">access_time</span>
            <span>${recipe.total_time_tier && recipe.total_time_tier.display_tier} </span>
          </p>
          <p>
            <span id="servings">${recipe.yields && recipe.yields}</span>
          </p>
        </div>
        <div className="col s6">
          <p>
            <a class="btn-floating"><i class="material-icons" id="addBtn">add</i></a>
            <a class="btn-floating"><i class="material-icons" id="removeBtn">remove</i></a>
          </p>
        </div>
      </div>
        
      <div class="card">
        <div class="card-content">
          <span class="card-title activator grey-text text-darken-4">
            ${recipe.name}<i class="material-icons right">more_vert</i>
          </span>
          <p>${recipe.description && recipe.description}<a href="#">This is a link</a></p>
        </div>
        
          <div class="card-content">
            <ul>
              ${recipe.sections[0].components && recipe.sections[0].components.map(component => `
                <li><span class="material-icons">check_circle</span> ${component.raw_text}</li>
              `).join("")}
            </ul>
            <a class="btn-floating">
              <i 
                class="material-icons" 
                id="cartBtn" 
                onclick="handleAddToShopping(event)" 
                data-recipe="${recipe.name}"
              >shopping_cart</i>
            </a>
            <a 
              class="btn-floating waves-effect waves-light red right-align" 
              onclick="handleAddToFavorites(event)" 
              data-recipe="${recipe.name}" 
              data-id="${1234}"
            >
              <i class="material-icons" id="favoriteBtn">favorite</i>
            </a>
          </div>

      <div class="card-reveal">
        <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
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
        <div>
          <h3>Instructions</h3>
          <ul>
          ${recipe.instructions && 
            recipe.instructions.map(instruction => 
            `<li>${instruction.position}. ${instruction.display_text}</li>`
            )
            .join("")}
          </ul>
        </div>
      </div>

      </div>
      </div>

    </div>
  `;

  // setShoppingList();

};

const setRecipeResults = data => {
  currentSearchResults = data ? data : recipeStorage[0];
  results.innerHTML = `
    <h3>Results list items</h3>
    <ul>
    ${
      currentSearchResults &&
      currentSearchResults.results.map((recipe, index) => `
        <li class="collection-item avatar" onclick="handleRecipeClick(event)" data-recipe="${recipe.name}">
          <img src="${recipe.thumbnail_url}" alt="recipe thumbnail" thumbnail class="circle" style="max-height: 50px;">
          <p data-index="${index}">${recipe.name}</p>
          <p data-index="${index}">${recipe.description ? recipe.description.split(0, 28) : "Sorry, no description"}...</p>
          <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
        </li>
      `)
      .join("")
    }
    </ul>
  `;
};

const getMeals = async (query) => {
  setLoading = true;
  const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=40&tags=under_30_minutes&q=${query}`;

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
      // setRecipeData(data);
      setRecipeResults(data)
      handleRecipeClick(data);
      setShoppingList();
      setLoading = false;
    })
    .catch(err => {
      console.error(err);
      setLoading = false;
    });  
  };

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

const setNav = (type) => {
  switch (type) {
    case "signin":
      nav.innerHTML = `
        <button id="login-btn" class="btn" onclick="setAuthForm("signin")">Login</button>
        <button id="register-btn" class="btn" onclick="setAuthForm("register")">Register</button>
      `;
      break;
    case "signout":
      nav.innerHTML = `
        <button id="login-btn" class="btn" onclick="setAuthForm("signin")">Logout</button>
      `;
      break;
  }
}

const handleLogin = event => handleSubmit(event);
const handleLogout = event => handleSubmit(event);
const handleRegister = event => handleSubmit(event);

const setAuthForm = (type) => {
  switch (type) {
    case "signin":
      authForm.innerHTML = `
      <div class="row">
        <div class="input-field col s12">
          <input id="email" class="validate" type="email" name="email" placeholder="Enter a valid email address">
          <label for="email">Email</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="password" class="validate" type="password" name="password" placeholder="password">
          <label for="password">Password</label>
        </div>
      </div>
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
  switchPage("toAuth");
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
        setNav("signout");
    } else {
        nav.innerHTML = `
          <button class="btn">Log in</button>
        `;
        setAuthForm("signin");
        setNav("signin");
    }

  }
  else {
    nav.innerHTML = `
        <button class="btn">Log in</button>
      `;
      setAuthForm("signin");
      setNav("signin");
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

auth.isUserLoggedIn ? 
setAuth() && setFavorites() && switchPage("toDashboard") : 
setAuthForm("signin") && setFavorites();

getMeals("Pasta");

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
      // setNav("signout");
      switchPage("toDashboard");
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
            // setNav("signout");
            switchPage("toDashboard");
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
      // setNav("signin");
      switchPage("toLanding");
      break;

    default:
      break;
  }

  email.value = '';
  password.value = '';
};