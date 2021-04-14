
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
    case "clear":
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
let loading = false;
// const updateLoading = isLoading => loading = isloading;

const handleAuthButtons = ( ) => {};

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
      if (auth.isUserLoggedIn) { //if we are logged in route to dashboard
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

//setFavorites() function that checks if we are logged in or not and sets our favorites according to who is logged in.
const setFavorites = () => {
  //if user is logged in
  if (auth.isUserLoggedIn) {
    //set the favorites container
    favoritesContainer.innerHTML = `
      <h3>${auth.emailLoggedIn}'s Favorite Recipe's</h3>
      ${//check the favoriteRecipeStorage local storage instance
        favoriteRecipeStorage //filter it by checking if the email from the favorited item matched the email of the user logged in.
        .filter(favorite => favorite.userEmail === auth.emailLoggedIn)//after filtering map the results into a list item.
        .map(favorite => `<li>${favorite.recipeName ? favorite.recipeName : "Add some favorites!"}</li>`)
        .join("")//removes the commas left over from joining the string from mapping an array.
      }
    `;
  }
  else {
    //if the above condition is not true then run this code block that just does the same thing but checks for 
    //a matching house email account.
    favoritesContainer.innerHTML = `
      ${favoriteRecipeStorage
        .filter(favorite => favorite.userEmail === "default@test.com")
        .map(favorite => `<li>${favorite.recipeName ? favorite.recipeName : "Add some favorites!"}</li>`)
        .join("")
      }
    `;
  }
};

//toggleGroceryList() handles toggling the grocery list and favorites tab
const toggleGroceryList = (toggle) => {
  //todo -> this function is not done yet needs to be finished.
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
//todo -> this function is not done yet needs to be finished.
function deleteShoppingItem(event) { console.info(event.target.dataset.index, cart); }

//handleAddToFavorites() function handles adding a seleted item to the favorites list.
const handleAddToFavorites = event => {
  //target the favoriteRecipeStorage and push in a new data object consisting of the userEmail, and the recipeName
  favoriteRecipeStorage.push({ 
    //userEmail has ternary condition = if there is a user logged in then return auth.emailLoggedIn otherwise return the house email. -> "default@test.com"
    userEmail: auth.isUserLoggedIn ? auth.emailLoggedIn : "default@test.com",
    recipeName: event.target.data.recipe,
  });
  //call the handle local storage wrapper function passing in our action, storageName, and updated favoriteRecipeStorage.
  handleLocalStorage("set", "favoriteRecipes", favoriteRecipeStorage);
  //call the updateFavoriteRecipeStorage to update our favoriteStorage variable array.
  updateFavoriteRecipeStorage();
  //call the setFavorites() function to update the updated favorites in the DOM.
  setFavorites();
};

//handleClearShoppingList() handles clearing the entire shopping list
function handleClearShoppingList(event) {
  //using the handleLocalStorage() wrapper passing in the action, and nameOfStorage
  handleLocalStorage("clear", "cart");
  //and then update the shoppingList()
  setShoppingList();
}

//function that sets the groceryList items in the DOM using the updated cart storage array.
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
        ${//ternary conditional to check if cart has items (cart.length > 0) then map out the items in the cart
          //otherwise we will return <li>Add some items to your shopping list.</li>
          cart.length > 0 ? cart.map(item => item.map((item, index) => `
          <li>
            ${item.raw_text} <button data-index="${index}" class="transparent" style="float: right;" onClick="deleteShoppingItem(event)">X</button>
          </li>
        `).join("")).join("") : `<li>Add some items to your shopping list.</li>`}
      </ul>
      <button class="btn red white-text" onclick="handleClearShoppingList(event)">Clear List</button>
    `;
}

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
          cart.push(currentSearchResults.results[i].sections[0].components);
          //set the updated cart storage array in localstorage using the handle localstorage wrapper.
          handleLocalStorage("set", "cart", cart);
          //call the setShoppingList() to update the Shopping List in the DOM with the update cart storage data.
          setShoppingList();
        }
      }
  }
}

//function that handles when a recipe item returned from the API is clicked.
var handleRecipeClick = event => {
  //ternary conditional that assigns the result of the condition to the recipe variable.
  //if there is data in the currentSearchResults array then show those results at the index of ...
  let recipe = currentSearchResults.results ? // ... index of if the recipeClick event is there then set it to the dataset index
  currentSearchResults.results[event.target ? event.target.dataset.index : 0] : //otherwise set it to 0.
  recipeStorage[0].results[0];//if there is no data in the currentSearchResults array then set the selected recipe to the first item in the recipeStorage local storae instance.

  //if isLoading is true then set the spinner in the DOM.
  // todo -> need to finish this and wrap in own function to be called here.
  if (true) {
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
};

//setRecipeResults function handles settomg the recipe results after the data is fetched from the API.
const setRecipeResults = data => {
  //set currentSearchResults to data if there is data if theres not then set it to the first item in the recipeStorage local storage instance
  currentSearchResults = data ? data : recipeStorage[0];
  //set the innerHTML of the results element with the new data.
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

//getMeals() function handles fetching the meal data from the API.
const getMeals = async (query) => {
  //set loading to true while we fetch the data triggering the spinner to show in the DOM.
  // updateLoading(true);
  //set a dynamic url to a variable passing in the query from the search form.
  const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=40&tags=under_30_minutes&q=${query}`;

  //asynchronous fetch function passing in the url and the options object obtained from RapidAPI.
  await fetch(url, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "ac72153c36mshd1814c8f1af20f3p1518fbjsnabee85184908",
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
      setAuth();
      //set loading to false
      // updateLoading(false);
    })
    .catch(exception => {
      console.error(exception); //if there is an error, catch it and log it.
      //update loading to false.
      // updateLoading(false);
    });  
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
//assign global variable to grab the elements needed in the DOM.
console.info(nav)

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


//i dont remember why i sepearated these into their own functions but they all just forward to the same handleSubmit() function.
const handleLogin = event => handleSubmit(event);
const handleLogout = event => handleSubmit(event);
const handleRegister = event => handleSubmit(event);

//setAuthForm() updates the auth form on the auth page every time there is an auth change or update.
const setAuthForm = (type) => {
  //utilizes switch function to check the type is equal to signin, signout, or register.
  console.log("Am I being clicked?", type)
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
  //after the setting the appropriate form to the DOM then switch to the Auth page using the switchPage wrapper function.
  switchPage("toAuth");
};


// setNav() function to update the HTML in the Nav element whenever there are authentication updates.
const setNav = type => {
  //utilizes switch function to check if the type is signin or signout and set the DOM accordingly.
  switch (type) {
    case "signin":
      nav.innerHTML = `
        <button id="" class="btn" onclick="switchPage("toDashboard")">Home</button>
        <button id="login-btn" class="btn" onclick="setAuth()">Login</button>
        <button id="register-btn" class="btn" onclick="setAuth()">Register</button>
      `;
      break;
    case "signout":
      nav.innerHTML = `
        <button id="${type}" class="btn" onclick="handleLogout(event)">Logout</button>
      `;
      break;
  }
};
auth.isUserLoggedIn ? setNav("signout") : setNav("signin");


//setAuth() function that updates the nav element in the DOM based on if there is a user already logged in or not.
const setAuth = () => {
  console.info("Whats going on here?", userStorage.length, auth);
  //if there is someone an auth local storage instance array
  if (auth) {
    //if there is a userLoggedIn == true.
    if ( auth.isUserLoggedIn ) {
      //update the html in the nav element.
        // nav.innerHTML = `
        //   <p>Logged in as ${auth.emailLoggedIn}</p>
        //   <button id="signout" onclick="handleLogout(event)" data-email=${auth.emailLoggedIn} class="btn">Log Out</button>
        // `;
        //set the auth form to "signout" using the setAuthForm()
        // setAuthForm("signout");
        //setNav function to "signout" //todo -->I think these functions are redundant and can be combined.
        // setNav("signout");
    } else {
        // nav.innerHTML = `
        //   <button class="btn">Log in</button>
        // `;
        // setAuthForm("signin");
        // setNav("signin");
    }

  }
  else {
    // nav.innerHTML = `
    //     <button class="btn">Log in</button>
    //   `;
      // setAuthForm("signin");
      // setNav("signin");
  }
};

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
setAuth() && setFavorites() && switchPage("toDashboard") : //setAuth() and setFavorites() then switch to the dashboard page.
setAuthForm("signin") && setFavorites(); //otherwise setAuthForm() and setFavorites();

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
      handleLocalStorage("userStorage", "set", userStorage);
       //if user is currently logged in, log them out before logging in the new person using setAuth().
      setAuth();
      //assign the value of token to a new randomly generated string using the generateToken function
      token = generateToken();
      //set the logged in user in the auth local storage using the handleLocalStorage wrapper function
      handleLocalStorage("set", "auth", {
        isUserLoggedIn: true, //set logged in to true
        token: token, //save the token in localstorage to match with loggedInUser later for validation
        emailLoggedIn: user.email //set the email of user logged in
      });
      //update the loggedInUser variable in "state"
      loggedInUser = {
        email: user.email,
        token: token
      };
      //update auth status with setAuth()
      setAuth();
      // setNav("signout");
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
          //! -- this is why this doesnt work when trying to login.. need to fix this asap!
          if (userInDb.email == user.email && userInDb.password == user.password) {
            //set a token to a randomly generated token
            token = generateToken();
            //set the logged in user to the auth local storage instance
            handleLocalStorage("set", "auth", {
              isUserLoggedIn: true, //toggle to true
              token: token, //save the generated token
              emailLoggedIn: user.email //save the email of the user just logged in
            });
            //handle setting the loggedInUser variable to match with logged in user in storage through out application flow for user validation
            loggedInUser = {
              email: user.email,
              token: token
            };
            //update auth status with setAuth()
            setAuth();
            //update the data in the favorites section in the DOM
            setFavorites();
            // setNav("signout");
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
      //update the auth status and auth items in DOM.
      setAuth();
      // setNav("signin");
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