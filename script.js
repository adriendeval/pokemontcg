const API_URL = "https://api.tcgdex.dev/v2/";

document.getElementById("search-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const cardName = document.getElementById("card-name").value.trim().toLowerCase();
    const language = document.getElementById("language-select").value;
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "<p>Chargement...</p>";

    try {
        // Récupérer toutes les cartes pour la langue choisie
        const response = await fetch(`${API_URL}${language}/cards`);
        if (!response.ok) {
            throw new Error(`Erreur API : ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Filtrer les cartes par nom (côté client)
        const filteredCards = data.filter(card => card.name.toLowerCase().includes(cardName));

        // Afficher les résultats
        if (filteredCards.length === 0) {
            resultsDiv.innerHTML = "<p>Aucune carte trouvée.</p>";
        } else {
            displayResults(filteredCards);
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p class="text-danger">Erreur : ${error.message}</p>`;
        console.error(error);
    }
});

function displayResults(cards) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("col-6", "col-lg-5");

        const releaseYear = card.set?.releaseDate?.split("-")[0] || "Inconnu";

        cardElement.innerHTML = `
            <div class="card">
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

    addModalEvents(cards);
}

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
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById("cardModal"));
    modal.show();
}
