const API_KEY = "f75a5871-856d-4674-ad79-11ed09e607e0";
const API_URL = "https://api.pokemontcg.io/v2/cards";

// Gestion du formulaire
document.getElementById("search-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const cardName = document.getElementById("card-name").value.trim();
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "<p>Chargement...</p>";

    try {
        // Requête API
        const response = await fetch(`${API_URL}?q=name:"${cardName}"`, {
            headers: {
                "X-Api-Key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }

        const data = await response.json();
        displayResults(data.data);
    } catch (error) {
        resultsDiv.innerHTML = `<p class="text-danger">Erreur : ${error.message}</p>`;
    }
});

// Affichage des résultats
function displayResults(cards) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (cards.length === 0) {
        resultsDiv.innerHTML = "<p>Aucune carte trouvée.</p>";
        return;
    }

    cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("col-md-4");

        cardElement.innerHTML = `
            <div class="card">
                <img src="${card.images.large}" class="card-img-top" alt="${card.name}">
                <div class="card-body">
                    <h5 class="card-title">${card.name}</h5>
                    <p class="card-text">Rare: ${card.rarity || "Inconnu"}</p>
                    <p class="card-text">Prix estimé: ${
                        card.cardmarket?.prices?.averageSellPrice
                            ? card.cardmarket.prices.averageSellPrice + " €"
                            : "Non disponible"
                    }</p>
                </div>
            </div>
        `;
        resultsDiv.appendChild(cardElement);
    });
}
