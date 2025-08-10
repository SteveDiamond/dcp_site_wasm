// Debug probability logic
console.log("=== DEBUGGING PROBABILITY LOGIC ===");

function testProbabilityDistribution() {
    console.log("Testing termination probability with prob_terminate = 0.05");
    
    let terminalCount = 0;
    let nonTerminalCount = 0;
    const trials = 1000;
    
    for (let i = 0; i < trials; i++) {
        const terminal = Math.random() < 0.05;
        if (terminal) {
            terminalCount++;
        } else {
            nonTerminalCount++;
        }
    }
    
    console.log(`Out of ${trials} trials:`);
    console.log(`Terminal: ${terminalCount} (${(terminalCount/trials*100).toFixed(1)}%)`);
    console.log(`Non-terminal: ${nonTerminalCount} (${(nonTerminalCount/trials*100).toFixed(1)}%)`);
    
    // Now test the actual generation multiple times
    console.log("\nTesting actual expression generation 20 times:");
    
    const convexType = {convex: true, concave: false, positive: false, negative: false};
    
    for (let i = 0; i < 20; i++) {
        try {
            // Step through the logic manually
            const terminal = Math.random() < 0.05;
            console.log(`Trial ${i+1}: terminal decision = ${terminal}`);
            
            if (terminal) {
                console.log("  -> Will choose terminal operator");
            } else {
                console.log("  -> Will choose non-terminal operator");
                
                // Check what non-terminals are available
                const nonTerminals = QUIZ_OPERATORS.filter(op => {
                    const terminalMatch = (op.terminal === false);
                    const positiveMatch = (op.positive === convexType.positive) || (op.positive === true);
                    const negativeMatch = (op.negative === convexType.negative) || (op.negative === true);
                    const convexMatch = (op.convex === convexType.convex) || (op.convex === true);
                    const concaveMatch = (op.concave === convexType.concave) || (op.concave === true);
                    
                    return terminalMatch && positiveMatch && negativeMatch && convexMatch && concaveMatch;
                });
                
                console.log(`  -> ${nonTerminals.length} non-terminal operators available`);
            }
            
        } catch (error) {
            console.error(`  -> Error: ${error.message}`);
        }
    }
}

testProbabilityDistribution();