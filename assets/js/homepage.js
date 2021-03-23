var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');
var languageButtonsEl = document.querySelector("#language-buttons");

// function for featured languages
const getFeaturedRepos = function(language) {
  var apiUrl = "https://api.github.com/search/repositories?q=" + language + "is:featured&sort=help-wanted-issues";

  fetch(apiUrl).then(function(response) {
    // if response is good
    if (response.ok) {
      // json() it
      response.json(). then(function(data) {
        // pass data.items, language to displayRepos()
        displayRepos(data.items, language);
      });
      // if not....
    } else {
      // tell the user whats up
      alert("Error: " + response.statusText);
    }
  })
}

// fetch api function to get data from github using github api
var getUserRepos = function(user) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  
  // make a request to the url
  fetch(apiUrl)
    .then(function(response) {
      // if response is valid
      if (response.ok) {
        // parse response into usable data then() 
        response.json().then(function(data) {
          // pass the parsed data and and var user into displayRepos function to fill parameters
          // and call displayRepos(data, user)
          displayRepos(data, user);
        });
      } else {
        // if response returns an error, alert user to the error
        alert("Error: " + response.statusText);
      }
    })
    // if unable to connect or request fails .catch with be sent the error
    .catch(function(error) {
      alert("Unable to connect to GitHub");
    })
 
}



const formSubmitHandler = function(event) {
  event.preventDefault();
  
  // get value from input element
  var username = nameInputEl.value.trim();

  // if username has a value(true)
  if (username) {
    // run fetch function
    getUserRepos(username);
    // reset input form to empty text
    nameInputEl.value = "";
  } else {
    // if username has no value(false)
    // alert user to enter a valid username
    alert("Please enter a GitHub username");
  }
};

userFormEl.addEventListener("submit", formSubmitHandler);

const displayRepos = function(repos, searchTerm) {
  //check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }


  // clear old content with empty string
  repoContainerEl.textContent = "";
  // set repoSearchTerm text equal to what gets passed through parameter (user in this case)
  repoSearchTerm.textContent = searchTerm;
  // loop over repos
  for (let i = 0; i < repos.length; i++) {
    // format repo name
    // owner username/repo[i].name
    let repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo
    let repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // creat a span element to hold repository name
    let titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    // append span to container
    repoEl.appendChild(titleEl);

    // creat a status element
    let statusEl = document.createElement("span");

    // check if current repo has issues or not
    // if condition is true....
    if (repos[i].open_issues_count > 0) {
      // set statusEl to show a checkbox with X and number of issues for repo[i]
      statusEl.innerHTML = 
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      // if not, checked checkbox and leave issue count "" 
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append container to the dom repo container
    repoContainerEl.appendChild(repoEl);
  }
}

const buttonClickHandler = function(event) {
  let language = event.target.getAttribute("data-language");
  if (language) {
    getFeaturedRepos(language);
    
    // clear old content
    repoContainerEl.textContent = "";
  } 
}

languageButtonsEl.addEventListener("click", buttonClickHandler);
