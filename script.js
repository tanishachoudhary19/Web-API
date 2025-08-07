document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("user-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const userDataDiv = document.getElementById("user-data");
        userDataDiv.innerHTML = ""; // Clear previous data

        if (username === "") {
            userDataDiv.innerHTML = "<p>Please enter a GitHub username.</p>";
            return;
        }

        // Fetch user profile
        fetch(`https://api.github.com/users/${username}`)
            .then(response => response.json())
            .then(user => {
                if (user.message === "Not Found") {
                    userDataDiv.innerHTML = "<p>User not found!</p>";
                    return;
                }

                const profileHTML = `
                    <h2>${user.name || username} 
                        (<a href="https://github.com/${user.login}" target="_blank">@${user.login}</a>)
                    </h2>
                    <img src="${user.avatar_url}" alt="${user.login}" width="100">
                    <p>Followers: ${user.followers} | Following: ${user.following}</p>
                    <p>Public Repos: ${user.public_repos}</p>
                    <h3>Repositories:</h3>
                    <div id="repos"></div>
                `;
                userDataDiv.innerHTML = profileHTML;

                // Fetch user repos
                fetch(`https://api.github.com/users/${username}/repos`)
                    .then(response => response.json())
                    .then(repos => {
                        const reposDiv = document.getElementById("repos");
                        if (repos.length === 0) {
                            reposDiv.innerHTML = "<p>No repositories found.</p>";
                            return;
                        }

                        repos.forEach(repo => {
                            const a = document.createElement("a");
                            a.href = repo.html_url;
                            a.textContent = repo.name;
                            a.className = "repo-tag";
                            a.target = "_blank";
                            reposDiv.appendChild(a);
                        });
                    })
                    .catch(error => {
                        console.error("Error fetching repos:", error);
                        userDataDiv.innerHTML += "<p>Failed to load repositories.</p>";
                    });
            })
            .catch(error => {
                console.error("Error fetching user:", error);
                userDataDiv.innerHTML = "<p>Something went wrong. Try again later.</p>";
            });
    });
});
