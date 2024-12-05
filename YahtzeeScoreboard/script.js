// Categories for Yahtzee
const categories = [
    { name: "Ones", description: "Count and add only Ones" },
    { name: "Twos", description: "Count and add only Twos" },
    { name: "Threes", description: "Count and add only Threes" },
    { name: "Fours", description: "Count and add only Fours" },
    { name: "Fives", description: "Count and add only Fives" },
    { name: "Sixes", description: "Count and add only Sixes" },
    { name: "Subtotal", description: "Automatically calculated", className: "subtotal" },
    { name: "Bonus (if >= 63)", description: "Score 35 if Subtotal ≥ 63", className: "bonus" },
    { name: "Total (Upper Section)", description: "Subtotal + Bonus", className: "total" },
    { name: "Three of a Kind", description: "Add total of all dice" },
    { name: "Four of a Kind", description: "Add total of all dice" },
    { name: "Full House", description: "Score 25" },
    { name: "Small Straight", description: "Score 30" },
    { name: "Large Straight", description: "Score 40" },
    { name: "Yahtzee", description: "Score 50" },
    { name: "Chance", description: "Add total of all dice" },
    { name: "Yahtzee Bonus", description: "Score 100 per bonus", inputEnabled: true },
    { name: "Total (Lower Section)", description: "Automatically calculated", className: "total" },
    { name: "Grand Total", description: "Sum of Upper and Lower Totals", className: "grand-total" }
];

// DOM elements
const playerCountSelect = document.getElementById("playerCount");
const setPlayersButton = document.getElementById("setPlayersButton");
const scoreTable = document.getElementById("scoreTable");
const scoreboardHeader = document.querySelector("#scoreboard thead tr");

// Function to set the number of players and build the table
function setPlayers() {
    const playerCount = parseInt(playerCountSelect.value);

    // Clear existing table content
    scoreboardHeader.innerHTML = `
        <th>Category</th>
        <th>How to Score</th>
    `;
    scoreTable.innerHTML = "";

    // Add player columns to the header
    for (let i = 1; i <= playerCount; i++) {
        const playerHeader = document.createElement("th");
        playerHeader.textContent = `Player ${i}`;
        scoreboardHeader.appendChild(playerHeader);
    }

    // Populate categories and inputs dynamically
    categories.forEach(category => {
        const row = document.createElement("tr");
        if (category.className) row.classList.add(category.className);

        const categoryCell = document.createElement("td");
        categoryCell.textContent = category.name;
        row.appendChild(categoryCell);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = category.description;
        row.appendChild(descriptionCell);

        for (let i = 1; i <= playerCount; i++) {
            const scoreCell = document.createElement("td");

            // Special rows for calculated values
            if (category.className && !category.inputEnabled) {
                const span = document.createElement("span");
                span.id = `${category.name.replace(/\s+/g, "")}_Player${i}`;
                span.textContent = "0";
                scoreCell.appendChild(span);
            } else {
                // Input rows for scores
                const input = document.createElement("input");
                input.type = "number";
                input.min = "0";
                input.value = "0";
                input.classList.add(`player${i}`, `${category.name.replace(/\s+/g, "").toLowerCase()}`);
                input.addEventListener("input", calculateTotals);
                scoreCell.appendChild(input);
            }
            row.appendChild(scoreCell);
        }

        scoreTable.appendChild(row);
    });

    calculateTotals(); // Initialize totals
}

// Function to calculate totals dynamically
function calculateTotals() {
    const playerCount = parseInt(playerCountSelect.value);

    for (let player = 1; player <= playerCount; player++) {
        // Upper Section Calculations
        let upperSubtotal = 0;
        document.querySelectorAll(`.player${player}.ones, .player${player}.twos, .player${player}.threes, .player${player}.fours, .player${player}.fives, .player${player}.sixes`).forEach(input => {
            upperSubtotal += parseInt(input.value) || 0;
        });
        document.getElementById(`Subtotal_Player${player}`).textContent = upperSubtotal;

        const bonus = upperSubtotal >= 63 ? 35 : 0;
        document.getElementById(`Bonus(if>=63)_Player${player}`).textContent = bonus;

        const upperTotal = upperSubtotal + bonus;
        document.getElementById(`Total(UpperSection)_Player${player}`).textContent = upperTotal;

        // Lower Section Calculations
        let lowerTotal = 0;
        document.querySelectorAll(`.player${player}.threeofakind, .player${player}.fourofakind, .player${player}.fullhouse, .player${player}.smallstraight, .player${player}.largestraight, .player${player}.yahtzee, .player${player}.chance, .player${player}.yahtzeebonus`).forEach(input => {
            lowerTotal += parseInt(input.value) || 0;
        });
        document.getElementById(`Total(LowerSection)_Player${player}`).textContent = lowerTotal;

        // Grand Total
        const grandTotal = upperTotal + lowerTotal;
        document.getElementById(`GrandTotal_Player${player}`).textContent = grandTotal;
    }
}

// Event listener for setting players
setPlayersButton.addEventListener("click", setPlayers);
