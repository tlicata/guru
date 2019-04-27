var createLeagueForm = document.querySelector("form[action='leagues'][method='POST']");
if (createLeagueForm) {
    createLeagueForm.addEventListener("submit", (event) => {
        event.preventDefault();
        var name = event.target.name.value;
        var slug = slugify(name);
        if (getLeagueData(slug) != null) {
            alert("League name is already taken, please try another.");
        } else {
            saveLeagueData(slug, { name: name });
            window.location = generateLeagueUrl(slug);
        }
    });
}

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

var getLeagueFromUrl = () => {
    return parseQuery(window.location.search)["league"];
}
var generateLeagueUrl = (slug) => {
    return "show.html?league=" + slug;
};

var slugify = (name) => {
    return encodeURIComponent(name.toLowerCase().replace(" ", "-"));
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
    var leagueSlug = getLeagueFromUrl();
    if (leagueSlug) {
        var leagueData = getLeagueData(leagueSlug);
        var leagueName = leagueData["name"];
        if (leagueName) {
            document.querySelectorAll(".current-league").forEach((elem) => {
                elem.innerHTML = leagueName;
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
                    `<a href='${url}'>${league['name']}</a>`,
                    "</li>"
                ].join("");
            });
            html += "</ul>";
            listOfLeagues.innerHTML = html;
        }
    }
}

replaceCurrentLeagueNameOnPage();
replaceListOfLeaguesOnPage();
