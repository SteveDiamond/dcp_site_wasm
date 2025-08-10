// Compare working vs broken cases directly
console.log("=== COMPARING WORKING vs BROKEN CASES ===");

function compareGenerations() {
    console.log("=== WORKING CASE (convex, manually specified) ===");
    const workingType = {convex: true, concave: false, positive: false, negative: false};
    
    for (let i = 0; i < 5; i++) {
        const expr = getRandomExpression([workingType], 0.05, 20, true);
        console.log(`Working ${i+1}: ${expr}`);
    }
    
    console.log("\n=== BROKEN CASE (concave, from quiz logic) ===");
    const brokenType = {convex: false, concave: true, positive: false, negative: false, dcp: true};
    
    for (let i = 0; i < 5; i++) {
        const expr = getRandomExpression([brokenType], 0.05, 20, brokenType.dcp);
        console.log(`Broken ${i+1}: ${expr}`);
    }
    
    console.log("\n=== TESTING CONCAVE NON-TERMINALS ===");
    const concaveNonTerminals = QUIZ_OPERATORS.filter(op => {
        const terminalMatch = (op.terminal === false);
        const positiveMatch = (op.positive === brokenType.positive) || (op.positive === true);
        const negativeMatch = (op.negative === brokenType.negative) || (op.negative === true);
        const convexMatch = (op.convex === brokenType.convex) || (op.convex === true);
        const concaveMatch = (op.concave === brokenType.concave) || (op.concave === true);
        
        return terminalMatch && positiveMatch && negativeMatch && convexMatch && concaveMatch;
    });
    
    console.log(`Concave non-terminals available: ${concaveNonTerminals.length}`);
    concaveNonTerminals.forEach(op => {
        console.log(`  - ${op.prefix}${op.infix || ''}${op.suffix} (weight: ${op.weight})`);
    });
    
    // Test weighted choice directly
    console.log("\n=== TESTING WEIGHTED CHOICE ===");
    for (let i = 0; i < 10; i++) {
        const chosen = weightedChoice(concaveNonTerminals);
        console.log(`Choice ${i+1}: ${chosen.prefix}${chosen.infix || ''}${chosen.suffix}`);
    }
}

compareGenerations();