// Constants to be defined based on the Solidity contract
const MAX_LINEAR_SCALE = 1000000 // Replace with actual value
const PURE_LINEAR_SCALE = 10000 // Replace with actual value

function calculateLinearPurchaseCost(currentToken, initialCost, scalingFactor) {
    if (currentToken == 0) {
        return initialCost
    } else if (scalingFactor == PURE_LINEAR_SCALE) {
        return ((currentToken + 1) * initialCost * scalingFactor) / PURE_LINEAR_SCALE
    }

    let costAdjustment = getInitialCostAdjustment(initialCost, scalingFactor)
    let rawCost = ((currentToken + 1) * initialCost * scalingFactor) / PURE_LINEAR_SCALE
    return scalingFactor > PURE_LINEAR_SCALE ? rawCost - costAdjustment : rawCost + costAdjustment
}

function getInitialCostAdjustment(initialCost, scalingFactor) {
    let scaledInitialCost = (initialCost * scalingFactor) / PURE_LINEAR_SCALE
    return scalingFactor > PURE_LINEAR_SCALE ? scaledInitialCost - initialCost : initialCost - scaledInitialCost
}

function calculateLinTokenBasedPurchaseReturn(supply, initialCost, scalingFactor, amount) {
    // Linear Token Based: simple linear cost with scaling factor
    if (supply == 0 && amount == 1) {
        return initialCost
    }

    // Case for no scaling (pure linear case)
    if (scalingFactor == PURE_LINEAR_SCALE) {
        return initialCost * (amount * supply + (amount * (amount + 1)) / 2)
    }

    // Calculate the scaled initial cost and its adjustment
    let scaledInitialCost = (initialCost * scalingFactor) / PURE_LINEAR_SCALE
    let initialCostAdjustment =
        scalingFactor > PURE_LINEAR_SCALE ? scaledInitialCost - initialCost : initialCost - scaledInitialCost

    // Calculate the raw cost and the total adjustment based on amount
    let rawCost = scaledInitialCost * (amount * supply + (amount * (amount + 1)) / 2)
    let initialAdjustmentTotal = initialCostAdjustment * amount

    // If scaling factor is greater, subtract the adjustment, otherwise add it to the raw cost
    return scalingFactor > PURE_LINEAR_SCALE ? rawCost - initialAdjustmentTotal : rawCost + initialAdjustmentTotal
}

function calculateExponentialPurchaseCost(supply, initialCost, scalingFactor) {
    let amount = 1
    if (supply == 0) {
        if (amount == 1) {
            return initialCost
        } else {
            let sum = ((amount - 1) * amount * (2 * (amount - 1) + 1)) / 6
            return (sum * initialCost) / scalingFactor + initialCost * amount
        }
    } else {
        let sum1 = ((supply - 1) * supply * (2 * (supply - 1) + 1)) / 6
        let sum2 = ((supply - 1 + amount) * (supply + amount) * (2 * (supply - 1 + amount) + 1)) / 6
        let totalSum = sum2 - sum1
        console.log("totalSum", totalSum)
        console.log("initialCost", initialCost)
        console.log("scalingFactor", scalingFactor)
        let sum3 = (totalSum * initialCost) / scalingFactor
        console.log("sum3", sum3)
        let sum4 = initialCost * amount
        console.log("sum4", sum4)
        let totalCost = sum3 + sum4
        console.log("totalCost", totalCost)
        return totalCost
    }
}

function calculateBoncursPurchaseCost(supply, initialCost, reserveBalance, scalingFactor) {
    if (supply == 0) {
        return initialCost
    }

    let value = (reserveBalance * scalingFactor) / supply
    return value / PURE_LINEAR_SCALE
}

function calculateBoncursSaleReturn(supply, reserveBalance) {
    return reserveBalance / supply
}

// Function to calculate the purchase cost and sale return for each curve type
function calculateValues(supply, initialCost, reserveBalance, scalingFactor, reserveRatio, amount, curveType) {
    let purchaseCost, saleReturn

    switch (curveType) {
        case "linear":
            purchaseCost = calculateLinearPurchaseCost(supply, initialCost, scalingFactor)
            console.log("purchaseCost", purchaseCost)
            saleReturn = purchaseCost
            break

        case "linearTokenBased":
            purchaseCost = calculateLinTokenBasedPurchaseReturn(supply, initialCost, scalingFactor, amount)
            saleReturn = purchaseCost
            break

        case "exponentialTokenBased":
            purchaseCost = calculateExponentialPurchaseCost(supply, initialCost, scalingFactor)
            saleReturn = purchaseCost
            break

        case "boncurs":
            purchaseCost = calculateBoncursPurchaseCost(supply, initialCost, reserveBalance, scalingFactor)
            supply++
            reserveBalance += purchaseCost
            saleReturn = calculateBoncursSaleReturn(supply, reserveBalance)
            break

        default:
            purchaseCost = 0
            saleReturn = 0
            break
    }

    return { purchaseCost, saleReturn }
}

// Update graph and table when the user clicks the button
function updateGraph() {
    const initialCost = parseFloat(document.getElementById("initialCost").value)
    let reserveBalance = parseFloat(document.getElementById("reserveBalance").value)
    const scalingFactor = parseFloat(document.getElementById("scalingFactor")?.value)
    const reserveRatio = parseFloat(document.getElementById("reserveRatio")?.value)
    const amount = 1
    const curveType = document.getElementById("curveType").value

    const tokens = []
    const purchaseCosts = []
    const saleReturns = []

    if (isNaN(reserveBalance)) {
        reserveBalance = 0
    }

    // Generate values for the graph and table
    for (let supply = 0; supply <= 100; supply++) {
        const { purchaseCost, saleReturn } = calculateValues(
            supply,
            initialCost,
            reserveBalance,
            scalingFactor,
            reserveRatio,
            amount,
            curveType
        )
        reserveBalance += purchaseCost
        tokens.push(supply + 1)
        purchaseCosts.push(purchaseCost)
        saleReturns.push(saleReturn)
    }

    // Update the table
    updateTable(tokens, purchaseCosts, saleReturns)

    // Update the chart
    updateChart(tokens, purchaseCosts, saleReturns)
}

// Update table with values
function updateTable(tokens, purchaseCosts, saleReturns) {
    const tableBody = document.getElementById("tokenTable").getElementsByTagName("tbody")[0]
    tableBody.innerHTML = "" // Clear existing table data

    tokens.forEach((supply, index) => {
        const row = tableBody.insertRow()
        row.insertCell(0).textContent = supply
        row.insertCell(1).textContent = purchaseCosts[index]
        row.insertCell(2).textContent = saleReturns[index]
    })
}

// Update the chart with values
function updateChart(tokens, purchaseCosts, saleReturns) {
    const ctx = document.getElementById("tokenChart").getContext("2d")

    window.tokenChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: tokens,
            datasets: [
                {
                    label: "Purchase Cost",
                    data: purchaseCosts,
                    borderColor: "blue",
                    fill: false,
                },
                {
                    label: "Sale Return",
                    data: saleReturns,
                    borderColor: "red",
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    })
}

// Handle curve type change
document.getElementById("curveType").addEventListener("change", function () {
    const curveType = this.value
    const scalingFactorField = document.getElementById("scalingFactor")
    const scalingFactorLabel = document.getElementById("scalingFactorLabel")
    const reserveRatioField = document.getElementById("reserveRatio")
    const reserveRatioLabel = document.getElementById("reserveRatioLabel")
    const reserveBalanceField = document.getElementById("reserveBalance")
    const reserveBalanceLabel = document.getElementById("reserveBalanceLabel")

    if (curveType === "exponential") {
        scalingFactorField.style.display = "none"
        scalingFactorLabel.style.display = "none"
        reserveRatioField.style.display = "block"
        reserveRatioLabel.style.display = "block"
        reserveBalanceField.style.display = "block"
        reserveBalanceLabel.style.display = "block"
    } else {
        scalingFactorField.style.display = "block"
        scalingFactorLabel.style.display = "block"
        reserveRatioField.style.display = "none"
        reserveRatioLabel.style.display = "none"
        reserveBalanceField.style.display = "none"
        reserveBalanceLabel.style.display = "none"
    }
})
