// Simple debug script - just log what's happening
console.log("=== DEBUGGING EXPRESSION GENERATION ===");

// Test the exact parameters used in quiz
const convexTest = {convex: true, concave: false, positive: false, negative: false};
const prob_terminate = 0.05;

console.log("Testing convex expression generation with prob_terminate:", prob_terminate);

// Test termination decision 10 times
for (let i = 0; i < 10; i++) {
    const terminal = Math.random() < prob_terminate;
    console.log(`Trial ${i+1}: terminal=${terminal}`);
}

console.log("\n=== TESTING OPERATOR FILTERING ===");

// Count available operators for each case
const terminalOps = QUIZ_OPERATORS.filter(op => {
    const terminalMatch = (op.terminal === true);
    const positiveMatch = (op.positive === convexTest.positive) || (op.positive === true);
    const negativeMatch = (op.negative === convexTest.negative) || (op.negative === true);
    const convexMatch = (op.convex === convexTest.convex) || (op.convex === true);
    const concaveMatch = (op.concave === convexTest.concave) || (op.concave === true);
    
    return terminalMatch && positiveMatch && negativeMatch && convexMatch && concaveMatch;
});

const nonTerminalOps = QUIZ_OPERATORS.filter(op => {
    const terminalMatch = (op.terminal === false);
    const positiveMatch = (op.positive === convexTest.positive) || (op.positive === true);
    const negativeMatch = (op.negative === convexTest.negative) || (op.negative === true);
    const convexMatch = (op.convex === convexTest.convex) || (op.convex === true);
    const concaveMatch = (op.concave === convexTest.concave) || (op.concave === true);
    
    return terminalMatch && positiveMatch && negativeMatch && convexMatch && concaveMatch;
});

console.log(`Terminal operators available: ${terminalOps.length}`);
terminalOps.forEach(op => console.log(`  - ${op.prefix}${op.suffix} (convex:${op.convex}, concave:${op.concave})`));

console.log(`Non-terminal operators available: ${nonTerminalOps.length}`);
nonTerminalOps.forEach(op => console.log(`  - ${op.prefix}${op.infix}${op.suffix} (convex:${op.convex}, concave:${op.concave})`));

console.log("\n=== TESTING SINGLE GENERATION ===");
try {
    const expr = getRandomExpression([convexTest], 0.05, 20, true);
    console.log("Generated expression:", expr);
} catch (e) {
    console.error("Error:", e.message);
    console.error("Stack:", e.stack);
}