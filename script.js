const API_KEY = "f75a5871-856d-4674-ad79-11ed09e607e0";
const API_URL = "https://api.pokemontcg.io/v2/cards";

// Gestion du formulaire
document.getElementById("search-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const cardName = document.getElementById("card-name").value.trim();
    const language = document.getElementById("language-select").value;
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "<p>Chargement...</p>";

    try {
        // Construction de la requête avec filtre de langue
        let query = `name:"${cardName}"`;
        if (language) {
            query += ` AND set.local: "${language}"`;
        }

        const response = await fetch(`${API_URL}?q=${query}`, {
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

        const averagePrice = card.cardmarket?.prices?.averageSellPrice || null;
        let priceClass = "price-default";

        if (averagePrice) {
            if (averagePrice <= 10) priceClass = "price-low";
            else if (averagePrice <= 50) priceClass = "price-medium";
            else priceClass = "price-high";
        }

        const releaseYear = card.set?.releaseDate?.split("-")[0] || "Inconnu";

        cardElement.innerHTML = `
            <div class="card">
                <div class="price-tag ${priceClass}">${averagePrice ? averagePrice.toFixed(2) + " €" : "Non dispo"}</div>
                <img src="${card.images.large}" class="card-img-top modal-trigger" alt="${card.name}" data-card-id="${card.id}">
                <div class="card-body">
                    <h5 class="card-title">${card.name}</h5>
                    <p class="card-text">Extension : ${card.set?.name || "Inconnu"}</p>
                    <p class="card-text">Illustrateur : ${card.artist || "Non disponible"}</p>
                    <p class="card-text">Année de sortie : ${releaseYear}</p>
                </div>
            </div>
        `;
        resultsDiv.appendChild(cardElement);
    });

    // Ajoute les événements pour ouvrir le modal
    addModalEvents(cards);
}

// Gestion des événements pour le modal
function addModalEvents(cards) {
    const modalTriggers = document.querySelectorAll(".modal-trigger");
    modalTriggers.forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            const cardId = event.target.getAttribute("data-card-id");
            const card = cards.find((c) => c.id === cardId);

            if (card) {
                populateModal(card);
            }
        });
    });
}

// Contenu du modal
function populateModal(card) {
    const modalContent = document.getElementById("modal-content");

    const releaseYear = card.set?.releaseDate?.split("-")[0] || "Inconnu";

    modalContent.innerHTML = `
        <div class="text-center">
            <img src="${card.images.large}" class="img-fluid mb-3" alt="${card.name}">
            <h3>${card.name}</h3>
            <p><strong>Extension :</strong> ${card.set?.name || "Inconnu"}</p>
            <p><strong>Illustrateur :</strong> ${card.artist || "Non disponible"}</p>
            <p><strong>Année de sortie :</strong> ${releaseYear}</p>
            <p><strong>Rare :</strong> ${card.rarity || "Inconnu"}</p>
            <p><strong>Prix moyen :</strong> ${
                card.cardmarket?.prices?.averageSellPrice
                    ? card.cardmarket.prices.averageSellPrice.toFixed(2) + " €"
                    : "Non disponible"
            }</p>
        </div>
    `;

    // Affiche le modal
    const modal = new bootstrap.Modal(document.getElementById("cardModal"));
    modal.show();
}
