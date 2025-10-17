const usernameInput = document.getElementById('username');
const lookupButton = document.getElementById('lookup');
const statusDiv = document.getElementById('status');
const userInfoDiv = document.getElementById('user-info');

lookupButton.addEventListener('click', () => {
    const username = usernameInput.value;
    if (!username) {
        statusDiv.textContent = 'Please enter a username.';
        return;
    }
    statusDiv.textContent = 'Looking up...';
    fetchUser(username);
});

function fetchUser(username) {
    const cachedUser = localStorage.getItem(username);
    if (cachedUser) {
        displayUser(JSON.parse(cachedUser));
        return;
    }
    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(user => {
            localStorage.setItem(username, JSON.stringify(user));
            displayUser(user);
        })
        .catch(error => {
            statusDiv.textContent = error.message;
        });
}

function displayUser(user) {
    const accountAge = new Date() - new Date(user.created_at);
    const ageInDays = Math.floor(accountAge / (1000 * 60 * 60 * 24));
    userInfoDiv.innerHTML = `<h2>${user.login}</h2>\n<p>Account Age: ${ageInDays} days</p>\n<img src='${user.avatar_url}' alt='Avatar' width='100'>`;
    statusDiv.textContent = 'User found!';
}