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
        cardElement.classList.add("col-6", "col-lg-5");

        // Calcul de la couleur du tag selon le prix
        const averagePrice = card.cardmarket?.prices?.averageSellPrice || null;
        let priceClass = "price-default";

        if (averagePrice) {
            if (averagePrice <= 10) priceClass = "price-low";
            else if (averagePrice <= 50) priceClass = "price-medium";
            else priceClass = "price-high";
        }

        cardElement.innerHTML = `
            <div class="card">
                <div class="price-tag ${priceClass}">${averagePrice ? averagePrice.toFixed(2) + " €" : "Non dispo"}</div>
                <img src="${card.images.large}" class="card-img-top" alt="${card.name}">
                <div class="card-body">
                    <h5 class="card-title">${card.name}</h5>
                    <p class="card-text">Extension : ${card.set?.name || "Inconnu"}</p>
                    <p class="card-text">Illustrateur : ${card.artist || "Non disponible"}</p>
                    <p class="card-text">Année de sortie : ${card.set?.releaseDate || "Non disponible"}</p>
                </div>
            </div>
        `;
        resultsDiv.appendChild(cardElement);
    });
}
