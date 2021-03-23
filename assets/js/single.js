let issueContainerEl = document.querySelector("#issues-container");

const getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to dom function
                displayIssues(data);
            });
        } else {
            alert("There was a problem with your request!");
        }
    });
}

const displayIssues = function(issues) {
    // ensure there are issues and if not....
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (let i = 0; i < issues.length; i++) {
        // create an anchor element to take users to the issue on github
        let issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        let titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a span to hold type
        let typeEl = document.createElement("span");
        // check if issue is issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issues)"
        }

        // append to container
        issueEl.appendChild(typeEl);

        // append container to bigger container 
        issueContainerEl.appendChild(issueEl);
    }

}


getRepoIssues("facebook/react");