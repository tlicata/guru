var createLeagueForm = document.querySelector("form[action='leagues'][method='POST']");
if (createLeagueForm) {
    createLeagueForm.addEventListener("submit", (event) => {
        event.preventDefault();
        var leagueName = event.target.name.value;
        var slug = slugify(leagueName);
        if (getLeagueData(slug) != null) {
            alert("League name is already taken, please try another.");
        } else {
            saveLeagueData(slug, { name: leagueName });
            window.location = generateLeagueUrl(slug);
        }
    });
}

var addTeamButton = document.querySelector("#add-team-btn");
if (addTeamButton) {
    addTeamButton.addEventListener("click", (event) => {
        var teamName = prompt("What is the new team's name?").trim();
        addTeamToLeague(teamName, getLeagueSlugFromUrl());
        replaceTeamsOrPlayersOnPage();
    });
}
var addPlayerButton = document.querySelector("#add-player-btn");
if (addPlayerButton) {
    addPlayerButton.addEventListener("click", (event) => {
        var playerName = prompt("What is the new player's name?").trim();
        addPlayerToLeague(playerName, getLeagueSlugFromUrl());
        replaceTeamsOrPlayersOnPage();
    });
}

var addTeamToLeague = (teamName, leagueSlug) => {
    var leagueData = getLeagueData(leagueSlug);
    if (leagueData) {
        if (!leagueData.teams) {
            leagueData.teams = [teamName];
        } else {
            leagueData.teams.push(teamName);
        }
        saveLeagueData(leagueSlug, leagueData);
    } else {
        alert("Cannot add team to an unknown league.");
    }
};
var addPlayerToLeague = (playerName, leagueSlug) => {
    var leagueData = getLeagueData(leagueSlug);
    if (leagueData) {
        if (!leagueData.players) {
            leagueData.players = [playerName];
        } else {
            leagueData.players.push(playerName);
        }
        saveLeagueData(leagueSlug, leagueData);
    } else {
        alert("Cannot add player to an unknown league.");
    }
};

var saveLeagueData = (leagueSlug, data) => {
    if (localStorage == undefined || localStorage.setItem == undefined) {
        alert("Sorry, League Guru doesn't support your browser type yet.");
    } else {
        localStorage.setItem(leagueSlug, JSON.stringify(data));
    }
};
var getLeagueData = (leagueSlug) => {
    return JSON.parse(localStorage.getItem(leagueSlug));
};
var getAllLeagueSlugs = () => {
    var slugs = [];
    for (var i = 0; i < localStorage.length; i++) {
        slugs.push(localStorage.key(i));
    }
    return slugs;
}

var getLeagueSlugFromUrl = () => {
    var leagueInUrl = parseQuery(window.location.search)["league"];
    return leagueInUrl ? slugify(leagueInUrl) : null;
}
var generateLeagueUrl = (slug) => {
    return "show.html?league=" + slug;
};

var slugify = (name) => {
    return encodeURIComponent(name.toLowerCase().replace(/ /g, "-"));
};

var escape = (str) => {
    return str
        .replace(/\&/g, "&amp;")
        .replace(/\</g, "&lt;")
        .replace(/\>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/\'/g, "&#39;");
};

var parseQuery = (queryString) => {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

var replaceCurrentLeagueNameOnPage = () => {
    var leagueSlug = getLeagueSlugFromUrl();
    if (leagueSlug) {
        var leagueData = getLeagueData(leagueSlug);
        var leagueName = leagueData["name"];
        if (leagueName) {
            document.querySelectorAll(".current-league").forEach((elem) => {
                elem.innerHTML = escape(leagueName);
            });
        }
    }
}
var replaceListOfLeaguesOnPage = () => {
    var listOfLeagues = document.querySelector(".list-leagues");
    if (listOfLeagues) {
        var slugs = getAllLeagueSlugs();
        if (slugs.length > 0) {
            var html = "<ul>";
            slugs.forEach((slug) => {
                var league = getLeagueData(slug);
                var url = generateLeagueUrl(slug);
                html += [
                    "<li>",
                    `<a href='${url}'>${escape(league['name'])}</a>`,
                    "</li>"
                ].join("");
            });
            html += "</ul>";
            listOfLeagues.innerHTML = html;
        }
    }
}

var replaceTeamsOrPlayersOnPage = () => {
    var teamsOrPlayers = document.querySelector(".list-teams-or-players");
    if (teamsOrPlayers) {
        var slug = getLeagueSlugFromUrl();
        if (slug) {
            var leagueData = getLeagueData(slug);
            if (leagueData) {
                var html = "";
                if (leagueData.teams) {
                    html = "<ul>";
                    leagueData.teams.forEach((team) => {
                        html += `<li>${escape(team)}</li>`;
                    });
                    html += "</ul>";
                } else if (leagueData.players) {
                    html = "<ul>";
                    leagueData.players.forEach((player) => {
                        html += `<li>${escape(player)}</li>`;
                    });
                    html += "</ul>";
                }
                teamsOrPlayers.innerHTML = html;
            }
        }
    }
}

replaceCurrentLeagueNameOnPage();
replaceListOfLeaguesOnPage();
replaceTeamsOrPlayersOnPage();
