/***************************************
 🔐 TMDb API CONFIG
****************************************/
const TMDB_API_KEY = "7643425bb85d88b06247acc5c657fa17";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

document.addEventListener("DOMContentLoaded", () => {

    let selected = {
        genre: "",
        language: "",
        mood: ""
    };

    /***************************************
     BUTTON ACTIVATION
    ****************************************/
    function activateButtons(groupId, key) {

        const group = document.getElementById(groupId);
        if (!group) return;

        const buttons = group.querySelectorAll("button");

        buttons.forEach(btn => {
            btn.addEventListener("click", () => {

                buttons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                selected[key] = btn.innerText.trim();
            });
        });
    }

    activateButtons("genre", "genre");
    activateButtons("language", "language");
    activateButtons("mood", "mood");


    /***************************************
     GENRE MAP
    ****************************************/
    const genreMap = {
        Action: 28,
        Comedy: 35,
        Drama: 18,
        "Sci-Fi": 878,
        Thriller: 53,
        Romance: 10749,
        Horror: 27
    };

    /***************************************
     LANGUAGE MAP
    ****************************************/
    const languageMap = {
        English: "en",
        Hindi: "hi",
        Spanish: "es",
        Korean: "ko",
        French: "fr",
        German: "de"
    };


    /***************************************
     GET MOVIES
    ****************************************/
    async function getSuggestions() {

        const container = document.getElementById("movieContainer");
        container.innerHTML = "<p>Loading movies...</p>";

        const genreId = genreMap[selected.genre] || "";
        const languageCode = languageMap[selected.language] || "";

        let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc`;

        if (genreId) {
            url += `&with_genres=${genreId}`;
        }

        if (languageCode) {
            url += `&with_original_language=${languageCode}`;
        }

        try {

            const response = await fetch(url);
            const data = await response.json();

            container.innerHTML = "";

            if (!data.results || data.results.length === 0) {
                container.innerHTML = "<p>No movies found.</p>";
                return;
            }

            data.results.slice(0, 8).forEach(movie => {

                const card = document.createElement("div");
                card.classList.add("movie-card");

                const poster = movie.poster_path
                    ? IMAGE_BASE_URL + movie.poster_path
                    : "https://via.placeholder.com/300x450?text=No+Image";

                card.innerHTML = `
                    <img src="${poster}" alt="${movie.title}">
                    <h4>${movie.title}</h4>
                    <p>⭐ ${movie.vote_average}</p>
                    <p>${movie.release_date ? movie.release_date.substring(0,4) : ""}</p>
                `;

                container.appendChild(card);
            });

        } catch (error) {
            console.error(error);
            container.innerHTML = "<p>Error fetching movies.</p>";
        }
    }

    /***************************************
     BUTTON CLICK
    ****************************************/
    document.getElementById("suggestBtn")
        .addEventListener("click", getSuggestions);

});