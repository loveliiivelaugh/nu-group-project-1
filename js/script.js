
//assign global variables to link with the DOM elements
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
//authentication
const authForm = document.getElementById("authForm");
const nav = document.getElementById("nav");

//handleLocalStorage function wrapper to handle localStorage CRUD operations
const handleLocalStorage = (action, nameOfStorage, data) => {
  switch (action) {
    case "initialize":
      return localStorage.getItem(nameOfStorage) ? JSON.parse(localStorage.getItem(nameOfStorage)) : [];
    case "get":
      return JSON.parse(localStorage.getItem(nameOfStorage));
    case "set":
      return localStorage.setItem(nameOfStorage, JSON.stringify(data));
    case "remove":
      return localStorage.removeItem(nameOfStorage);
    case "clear":
      return localStorage.clear();
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

const showUpdatedStorages = () => console.info({
  recipes: recipeStorage, 
  favoriteRecipes: favoriteRecipeStorage, 
  users: userStorage, 
  auth: auth, 
  cart: cart
});

let currentSearchResults = [];
let quantity = 0.5;

/**
 * TABLE OF FUNCTIONS
 * 
 * handleLocalStorage(action, nameOfStorage, data) - takes in an action ("initialize", "set", "get", or "clear"), the nameofStorage and if you're setting data then it takes in a data prop as well. Based on the action passed it performs the operation on the local storage instance by name
 * 
 * updateRecipeStorage() - When called, updates the recipe local storage instance
 * updateFavoriteRecipeStorage() - When called, updates the favoriteRecipe local storage instance
 * updateUserStorage() - When called, updates the usr local storage instance
 * updateAuth() - When called, updates the auth local storage instance
 * updateCart() - When called, updates the cart local storage instance
 * updateLoading(true || false) - When called, updates the loading variable to be true or false
 * switchPage(page) - switch case function that handles routing between the pages taking in a page string prop
 * toggleGroceryList(toggle) - function that toggles the active tab between grocery list and favorites.
 * deleteShoppingItem(event) - function that deletes a single selected item from the grocery list.
 * handleClearShoppingList(event) - function that clears the entire shopping list when the clear btn is clicked.
 * handleAddToShopping(event)  - handles adding items from the selected item to the shopping list.
 * handleAddToFavorites(event) - handles adding items from the selected item to the favorite item list.
 * handleRecipeClick(event) - function that handles populating the main section with the selected item details when clicked.
 * setFavorites() - function that sets the updated favorites section to the DOM.
 * setShoppingList() - function that sets the updated shopping list to the DOM.
 * setRecipeResults(data) - function that sets the updated recipeResults list to the DOM.
 * getMeals(query) - function that wraps the fetch function and call, which distributes that data after is returned to the appropriate sections using the set functions.
 * 
 * -- Authentication --
 * handleLogin(event) - function that handles when a user logs in.
 * handleLogout(event) - function that handles when a user logs out.
 * handleRegister(event) - function that handles when a user registers.
 * setNav(type) - function that set the updated Nav section to the DOM based on the type being passed in. ("signin", "signout", "register")
 * setAuth() - function that sets the updated Auth items to the DOM, navigation, forms, etc.
 * setAuthForm(type) - function that sets the AuthForm in the DOM based on type. ("signin", "signout", "register")
 * setFavorites() - function that sets the updated favorites list to the DOM.
 * generateToken() - function used to generate and return a random token when called.
 * handleSubmit(event) - function that handles when any of the authentication forms are submitted. Wraps a switch case to determine if ("signin", "signout" or, "register") type is needed. Captures and stores user credentials, checks if user has an account, handles authentication flow, once finished routes to appropritate page.
 * 
 */


//special switch case function to handle routing and switching the pages.
const switchPage = page => {
  switch (page) {
    case "toDashboard":
      // showUpdatedStorages();
      //switch from landing page or auth page to dashboard page
      document.getElementById("auth-page").style.display = "none";
      document.getElementById("landing-page").style.display = "none";
      document.getElementById("dashboard-page").style.display = "block";
      break;
    case "toLanding":
      // showUpdatedStorages();
      //switch from auth page to landing page
      document.getElementById("auth-page").style.display = "none";
      document.getElementById("dashboard-page").style.display = "none";
      document.getElementById("landing-page").style.display = "block";
      break;
    case "toAuth":
      // showUpdatedStorages();
      //switch from dashboard page or landing page to auth page
      if (auth.isUserLoggedIn) { //if we are logged in route to dashboard
        document.getElementById("landing-page").style.display = "none";
        document.getElementById("dashboard-page").style.display = "none";
        document.getElementById("auth-page").style.display = "block";
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

//setFavorites() function that checks if we are logged in or not and sets our favorites according to who is logged in.
const setFavorites = () => {
  //if user is logged in
  if (auth.isUserLoggedIn) {
    //set the favorites container
    groceryList.innerHTML = `
      <ul id="tabs-swipe-demo" class="tabs tabs-transparent row">
        <li class="tab col s6"><button class="btn" onclick="toggleGroceryList('groceries')">Groceries</button></li>
        <li class="tab col s6"><button class="btn" onclick="toggleGroceryList('favorites')">Favorites</button></li>
      </ul>
      <h4>${auth.emailLoggedIn}'s Favorite Recipe's</h4>
      <ul>
      ${favoriteRecipeStorage.length > 0 ?//check the favoriteRecipeStorage local storage instance
        favoriteRecipeStorage //filter it by checking if the email from the favorited item matched the email of the user logged in.
        .filter(favorite => favorite.userEmail === auth.emailLoggedIn)//after filtering map the results into a list item.
        .map((favorite, index) => `
          <li class="row">
            <p class="col s10">${favorite.recipeName && favorite.recipeName}</p> 
            <a data-index="${index}" class="btn-floating btn-small waves-effect waves-light red col s2" onClick="deleteFavoritesItem(event)">x</a>
          </li>
          `)
        .join("") : //removes the commas left over from joining the string from mapping an array.
        `<li>Add some items to your favorites list.</li>`
      }
      </ul>
      <button class="btn red white-text" onclick="handleClearFavorites(event)">Clear List</button>
    `;
  }
  else {
    //if the above condition is not true then run this code block that just does the same thing but checks for 
    //a matching house email account.
    groceryList.innerHTML = `
      <ul id="tabs-swipe-demo" class="tabs tabs-transparent row">
        <li class="tab col s6"><button class="btn" onclick="toggleGroceryList('groceries')">Groceries</button></li>
        <li class="tab col s6"><button class="btn" onclick="toggleGroceryList('favorites')">Favorites</button></li>
      </ul>
      <h4>Favorite Recipe's</h4>
      <ul>
      ${favoriteRecipeStorage.length > 0 ? favoriteRecipeStorage
        .filter(favorite => favorite.userEmail === "default@test.com")
        .map((favorite, index) => `
          <li class="row">
            <p class="col s10">${favorite.recipeName && favorite.recipeName}</p> 
            <a data-index="${index}" class="btn-floating btn-small waves-effect waves-light red col s2" onClick="deleteFavoritesItem(event)">x</a>
          </li>
          `)
        .join("") :
        `<li>Add some items to your favorites list.</li>`
      }
      </ul>
      <button class="btn red white-text" onclick="handleClearFavorites(event)">Clear List</button>
    `;
  }
};

//deleteFavoritesItem(), function that deletes the favorites item from the list
const deleteFavoritesItem = event => {
  let index = parseInt(event.target.dataset.index)
  favoriteRecipeStorage.splice(index, 1);
  handleLocalStorage("set", "favoriteRecipes", favoriteRecipeStorage);
  updateFavoriteRecipeStorage();
  setFavorites();
};

//handleClearFavoritesList() handles clearing the entire favorites list
const handleClearFavorites = () => {
  //using the handleLocalStorage() wrapper passing in the action, and nameOfStorage
  handleLocalStorage("remove", "favoriteRecipes");
  updateFavoriteRecipeStorage();
  //and then update the shoppingList()
  setFavorites();
};

//toggleGroceryList() handles toggling the grocery list and favorites tab
const toggleGroceryList = toggle => {
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
};

//deleteShoppingItem(), function that deletes the shopping item from the list
const deleteShoppingItem = event => {
  let index = parseInt(event.target.dataset.index)
  cart.splice(index, 1);
  handleLocalStorage("set", "cart", cart);
  updateCart();
  setShoppingList();
};

//handleClearShoppingList() handles clearing the entire shopping list
function handleClearShoppingList() {
  //using the handleLocalStorage() wrapper passing in the action, and nameOfStorage
  handleLocalStorage("remove", "cart");
  //and then update the shoppingList()
  setShoppingList();
}

//function that sets the groceryList items in the DOM using the updated cart storage array.
function setShoppingList() {
    groceryList.innerHTML = `
      <ul id="tabs-swipe-demo" class="tabs tabs-transparent" style="margin: 0 5%;">
        <li class="tab col s6"><button class="btn" onclick="toggleGroceryList('groceries')">Groceries</button></li>
        <li class="tab col s6"><button class="btn" onclick="toggleGroceryList('favorites')">Favorites</button></li>
      </ul>
      <h2>Grocery List</h2>
      <ul>
        ${//ternary conditional to check if cart has items (cart.length > 0) then map out the items in the cart
          //otherwise we will return <li>Add some items to your shopping list.</li>
          cart.length > 0 ? cart.map((item, index) => `
          <li class="row">
            <p class="col s10">${item.raw_text}</p>
            <a data-index="${index}" class="btn-floating btn-small waves-effect waves-light red col s2" onClick="deleteShoppingItem(event)">x</a>
          </li>
        `).join("") : `<li>Add some items to your shopping list.</li>`}
      </ul>
      <button class="btn red white-text" onclick="handleClearShoppingList(event)">Clear List</button>
    `;
}


//handleAddToFavorites() function handles adding a seleted item to the favorites list.
const handleAddToFavorites = event => {
  let recipeName = event.target.dataset.recipe;
  let userEmail = auth.isUserLoggedIn ? auth.emailLoggedIn : "default@test.com";

  console.info(event.target.dataset.recipe, favoriteRecipeStorage);
  
  favoriteRecipeStorage.length > 0 ? favoriteRecipeStorage.forEach(favoriteRecipe => {
    if (
      favoriteRecipe.recipeName === recipeName && 
      favoriteRecipe.userEmail === userEmail
    ) {
      alert("You already have that item in your favorites list.");
      return;
    } else {
    //target the favoriteRecipeStorage and push in a new data object consisting of the userEmail, and the recipeName
    favoriteRecipeStorage.push({ 
      //userEmail has ternary condition = if there is a user logged in then return auth.emailLoggedIn otherwise return the house email. -> "default@test.com"
      userEmail: auth.isUserLoggedIn ? auth.emailLoggedIn : "default@test.com",
      recipeName: recipeName,
    });
    //call the handle local storage wrapper function passing in our action, storageName, and updated favoriteRecipeStorage.
    handleLocalStorage("set", "favoriteRecipes", favoriteRecipeStorage);
    //call the updateFavoriteRecipeStorage to update our favoriteStorage variable array.
    // updateFavoriteRecipeStorage();
    console.info(favoriteRecipeStorage);

    //call the setFavorites() function to update the updated favorites in the DOM.
    setFavorites();
    }
  }) :
  //target the favoriteRecipeStorage and push in a new data object consisting of the userEmail, and the recipeName
  favoriteRecipeStorage.push({ 
    //userEmail has ternary condition = if there is a user logged in then return auth.emailLoggedIn otherwise return the house email. -> "default@test.com"
    userEmail: auth.isUserLoggedIn ? auth.emailLoggedIn : "default@test.com",
    recipeName: recipeName,
  });
  //call the handle local storage wrapper function passing in our action, storageName, and updated favoriteRecipeStorage.
  handleLocalStorage("set", "favoriteRecipes", favoriteRecipeStorage);
  //call the updateFavoriteRecipeStorage to update our favoriteStorage variable array.
  // updateFavoriteRecipeStorage();
  console.info(favoriteRecipeStorage);

  //call the setFavorites() function to update the updated favorites in the DOM.
  setFavorites();
};

//function to handle adding a selected item to the shopping list.
function handleAddToShopping(event) {
  //set the value of the recipe dataset attribute from the target element that triggered this function to recipeName variable.
  const recipeName = event.target.dataset.recipe;
  //if there is data in the currentSearchResults array
  if ( currentSearchResults.results ) {
    //then loop through each of those items
      for ( let i = 0 ; i < currentSearchResults.results.length; i++ ) {
        //if the name of one of those items is equal to the recipe name grabbed from the datast attr
        if ( currentSearchResults.results[i].name === recipeName ) {
          //then push each of the ingredients from the selected item into the cart storage array
          currentSearchResults.results[i].sections[0].components.forEach(component => cart.push(component));
          //set the updated cart storage array in localstorage using the handle localstorage wrapper function.
          handleLocalStorage("set", "cart", cart);
          //call the setShoppingList() to update the Shopping List in the DOM with the updated cart storage data.
          setShoppingList();
        }
      }
  }
}

const handleServings = event => {
  event.target.id === "addBtn" && (quantity += 1);
  event.target.id === "removeBtn" && quantity > 1 && (quantity -= 1);
  console.info("Servings: " + quantity);
};

const setServings = yields =>
  `${yields &&
    parseInt((yields)
      .split(" ")[1]
      .replace(/[^0-9]/g, "")
      .split('')[0]) * quantity
    } - 
  ${yields &&
    parseInt((yields)
      .split(" ")[1]
      .replace(/[^0-9]/g, "")
      .split('')[1]) * quantity
    }`;


const setSpinner = () => centerSection.innerHTML = `
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
//function that handles when a recipe item returned from the API is clicked.
var handleRecipeClick = event => {
  //ternary conditional that assigns the result of the condition to the recipe variable.
  //if there is data in the currentSearchResults array then show those results at the index of ...
  let recipe = currentSearchResults.results ? // ... index of if the recipeClick event is there then set it to the dataset index
  currentSearchResults.results[event.target ? event.target.dataset.index : 0] : //otherwise set it to 0.
  recipeStorage[0].results[0];//if there is no data in the currentSearchResults array then set the selected recipe to the first item in the recipeStorage local storae instance.

  quantity = recipe.num_servings / 2;

  let loading = false;
  //if isLoading is true then set the spinner in the DOM.
  if (loading) { setSpinner(); }
    
  //when it is loaded set the innerHTML of the center section with the updated searched recipe data.
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
            <span>Prep time: ${recipe.total_time_minutes && recipe.total_time_minutes} minutes</span>
          </p>
          <p>
            <span class="material-icons">group</span>
            <span id="servings">Servings: ${recipe.yields}</span>
          </p>
        </div>
        <div className="col s6">
          <p>
            <a class="btn-floating" onclick="handleServings(event)"><i class="material-icons" id="addBtn" data-quantity="${quantity}">add</i></a>
            <a class="btn-floating" onclick="handleServings(event)" ><i class="material-icons" id="removeBtn" data-quantity="${quantity}">remove</i></a>
          </p>
        </div>
      </div>
        
      <div class="card">
        <div class="card-content">
          <span class="card-title activator grey-text text-darken-4">
            ${recipe.name}<i class="material-icons right">more_vert</i>
          </span>
          <p>${recipe.description && recipe.description}</p>
        </div>
        
          <div class="card-content">
            <ul>
              ${recipe.sections[0].components && 
                recipe.sections[0].components.map(component => `
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
              data-id="${1234}"
            >
              <i class="material-icons" id="favoriteBtn" data-recipe="${recipe.name}">favorite</i>
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
};

//setRecipeResults function handles setting the recipe results after the data is fetched from the API.
const setRecipeResults = data => {
  //set currentSearchResults to the data if there is data, if theres not, then set it to the first item in the recipeStorage local storage instance
  currentSearchResults = data ? data : recipeStorage[0];
  //set the innerHTML of the results element with the new data.
  results.innerHTML = `
    <h3>Results list items</h3>
    <ul>
    ${
      currentSearchResults &&
      currentSearchResults.results.map((recipe, index) => `
        <li class="collection-item avatar row" onclick="handleRecipeClick(event)" data-recipe="${recipe.name}">
          <img src="${recipe.thumbnail_url}" alt="recipe thumbnail" thumbnail class="circle col s4" style="max-height: 50px;">
          <div className="col s8">
            <h6 data-index="${index}">${recipe.name}</h6>
            <p data-index="${index}" class="col s12">${ recipe.description ? recipe.description.slice(0, 64) + "..." : '' }</p>
            <a href="#!" class="secondary-content col s4" style="float:right;"><i class="material-icons">grade</i></a>
          </div>
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
  if (data.results) { results = data.results; }

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

//getMeals() function handles fetching the meal data from the API.
const getMeals = async (query) => {
  //set a dynamic url to a variable passing in the query from the search form.
  const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=40&tags=under_30_minutes&q=${query}`;

  //asynchronous fetch function passing in the url and the options object obtained from RapidAPI.
  await fetch(url, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "f0fe1e6a40msh09227785bf24521p14c96ajsndd8583834371",
      "x-rapidapi-host": "tasty.p.rapidapi.com"
    }
    })
    .then(response => response.json()) //convert the promised response to a json object.
    .then(data => { //now we have access to the json data object
      //setRecipeResults in the DOM with the new data.
      setRecipeResults(data);
      //call the handleRecipeClick with the new data so we have an initial item onPageLoad instead of empty containers.
      handleRecipeClick(data);
      //setShoppingList() to update the Shopping List with any saved grocery list items.
      setShoppingList();
    })  //if there is an error, catch it and log it.
    .catch(exception => { console.error(exception); });
  };

//add an event listener to the searchForm when it is submitted 
searchForm.addEventListener('submit', function(event){ 
  event.preventDefault();
  //getMeals() function passing in the captured search input
  getMeals(search.value);
  //update the search input to empty
  search.value = '';
});


//AUTHENTICATION  //code below is for authentication
//i dont remember why i sepearated these into their own functions but they all just forward to the same handleSubmit() function.
const handleLogin = event => handleSubmit(event);
const handleLogout = event => handleSubmit(event);
const handleRegister = event => handleSubmit(event);

//setAuthForm() updates the auth form on the auth page every time there is an auth change or update.
const setAuthForm = (type) => {
  //utilizes switch function to check the type is equal to signin, signout, or register.
  switch (type) {
    case "signin":
      authForm.innerHTML = `
        <div class="row">
          <div class="input-field col s12">
            <input id="email" class="validate" type="email" name="email" placeholder="Enter a valid email address">
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input id="password" class="validate" type="password" name="password" placeholder="password">
          </div>
        </div>
        <button id="signin" type="submit" onclick="handleLogin(event)" class="btn">Login</button>
      `;
      break;
    case "signout":
      authForm.innerHTML = `
        <div class="row">
          <div class="input-field col s12">
            <input id="email" class="validate" type="email" name="email" placeholder="Enter a valid email address">
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input id="password" class="validate" type="password" name="password" placeholder="password">
          </div>
        </div>
        <button id="signout" type="submit" onclick="handleLogout(event)"  class="btn">Logout</button>
      `;
      break;
    case "register":
      authForm.innerHTML = `
        <div class="row">
          <div class="input-field col s12">
            <input id="email" class="validate" type="email" name="email" placeholder="Enter a valid email address">
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input id="password" class="validate" type="password" name="password" placeholder="password">
          </div>
        </div>
        <button id="register" type="submit" onclick="handleRegister(event)" class="btn">Register</button>
      `;
      break;
    default:
      break;
  }
  //after the setting the appropriate form to the DOM then switch to the Auth page using the switchPage wrapper function.
};

const navHelper = event => {
  if ( event.target.id === "register-btn" ) {
    setAuthForm("register");
    switchPage("toAuth");
  }
  if ( event.target.id === "login-btn" ) {
    setAuthForm("signin");
    switchPage("toAuth");
  }
}

// setNav() function to update the HTML in the Nav element whenever there are authentication updates.
const setNav = type => {
  //utilizes switch function to check if the type is signin or signout and set the DOM accordingly.
  switch (type) {
    case "signin":
      nav.innerHTML = `
        <div class="nav-wrapper">
          <img src="./assets/images/tasty_white_logo_resized.png" alt="app-logo" onclick="switchPage('toLanding')" class="logo" style="float: left; padding: -20%;">
          <div style="float:right; margin:1% 2%;">
            <button id="" class="btn" onclick="switchPage('toDashboard')">Home</button>
            <button id="login-btn" class="btn" onclick="navHelper(event)">Login</button>
            <button id="register-btn" class="btn" onclick="navHelper(event)">Register</button>
          </div>
        </div>
      `;
      break;
    case "signout":
      nav.innerHTML = `
        <div class="nav-wrapper">
          <img src="./assets/images/tasty_white_logo_resized.png" alt="app-logo" style="float: left; padding: -20%;" onclick="switchPage('toLanding')" class="logo">
          <div style="float:right; margin:1% 2%;">
            <span style="color: darkblue;">${auth.emailLoggedIn}</span>
            <button id="" class="btn" onclick="switchPage('toDashboard')">Home</button>
            <button id="${type}" class="btn" onclick="handleLogout(event)">Logout</button>
          </div>
        </div>
      `;
      break;
    default:
      nav.innerHTML = `
        <div class="nav-wrapper">
          <img src="./assets/images/tasty_white_logo_resized.png" alt="app-logo" onclick="switchPage('toLanding')" class="logo" style="float: left; padding: -20%;">
            <div style="float:right; margin:1% 2%;">
              <button id="" class="btn" onclick="switchPage('toDashboard')">Home</button>
              <button id="login-btn" class="btn" onclick="navHelper(event)">Login</button>
              <button id="register-btn" class="btn" onclick="navHelper(event)">Register</button>
            </div>
        </div>
      `;
      break;
  }
};
auth.isUserLoggedIn ? setNav("signout") : setNav("signin");

//todo -->  work in progress. setting temporary loggedInUser to accessible variable
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

//if there is someone logged in, checks onPageLoad
auth.isUserLoggedIn ? 
setAuthForm("signin") && setFavorites() && switchPage("toLanding") : //setAuth() and setFavorites() then switch to the dashboard page.
setAuthForm("signin") && setFavorites() && switchPage("toLanding"); //otherwise setAuthForm() and setFavorites();

//onPageLoad call the getMeals() function passing in a default search item.
getMeals("Pasta");

//function to generate a random token for user validation when called.
const generateToken = event => "I am a token!";

//handleSubmit() function that handles when any of the authentication buttons submit an auth form.
const handleSubmit = (event) => {
  event.preventDefault();
  //assign user as an empty object to a temporary variable.
  let user = {};

  //if there is an email element
  if (document.querySelector("#email")) {
    //set the user object data structure including the login credentials
    user = {
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value,
    };
  }

  //set token to an empty string to be generated randomly momentarily.
  let token = '';

  //switch function checking the id seeing if it equals "register", "signin", or "singout"
  switch (event.target.id) {

    //if its "register"
    case "register":
      //push the newly created user object to the userStorage local storage users instance
      userStorage.push(user);
      //set the userStorage array to localstorage using the handleLocalStorage wrapper function
      handleLocalStorage("set", "users", userStorage);
      updateUserStorage();
      //assign the value of token to a new randomly generated string using the generateToken function
      token = generateToken();
      //set the logged in user in the auth local storage using the handleLocalStorage wrapper function
      handleLocalStorage("set", "auth", {
        isUserLoggedIn: true, //set logged in to true
        token: token, //save the token in localstorage to match with loggedInUser later for validation
        emailLoggedIn: user.email //set the email of user logged in
      });
      updateAuth();
      //update the loggedInUser variable in "state"
      loggedInUser = {
        email: user.email,
        token: token
      };
      //update auth status with setAuth()
      setAuth();
      setNav("signout");
      showUpdatedStorages();
      //switch to the dashboard page using the switchPage() function
      switchPage("toDashboard");
      break;

      //if its "singnin"
    case "signin":
      //if there is data in the userStorage user local storage instance by checking its length.
      if ( userStorage.length > 0 ) {
        //foreach item in the userStorage user local storage instance
        userStorage.forEach(userInDb => {
          //check each user.email in userStorage with the new user email and pass.
          if (userInDb.email == user.email && userInDb.password == user.password) {
            //set a token to a randomly generated token
            token = generateToken();
            //set the logged in user to the auth local storage instance
            handleLocalStorage("set", "auth", {
              isUserLoggedIn: true, //toggle to true
              token: token, //save the generated token
              emailLoggedIn: user.email //save the email of the user just logged in
            });
            updateAuth();
            //handle setting the loggedInUser variable to match with logged in user in storage through out application flow for user validation
            loggedInUser = {
              email: user.email,
              token: token
            };
            //update the data in the favorites section in the DOM //todo <-- Fix this.
            // setFavorites();
            setNav("signout");
            showUpdatedStorages();
            //switch to the dashboard page using the switchPage() function
            switchPage("toDashboard");
          } //if i dont even know what this is checking need to validate this
          else { alert("Please enter a valid email and password."); }
        });
      } 
      else {
        //if no users stored in local storage match the user signing in 
        alert("No users found with those credentials.");
        //ask the user if they want to register instead 
        if (confirm("Would you like to register instead?")) {
          //update the auth form
          setAuthForm("register");
        }
      }
      break;

      //if its "signout"
    case "signout":
      //update the auth local storage instance using the handleLocalStorage() wrapper
      handleLocalStorage("set", "auth", {isUserLoggedIn: false}); //toggle loggedInUser to false
      //udate the loggedInUser variable to an empty email and token.
      loggedInUser = {
        email: user.email,
        token: token
      };
      updateAuth();
      //update the auth status and auth items in DOM.
      setAuth();
      setNav("signin");
      showUpdatedStorages();
      //switch to the landing page using the switchPage() function
      switchPage("toLanding");
      break;

    default:
      break;
  }

  //update the values of email and password to an empty string.
  email.value = '';
  password.value = '';
};