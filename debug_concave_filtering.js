// Debug concave filtering specifically
console.log("=== DEBUGGING CONCAVE FILTERING SPECIFICALLY ===");

const concaveType = {convex: false, concave: true, positive: false, negative: false};

console.log("Concave type:", concaveType);

// Check each operator individually
const concaveOps = [];
QUIZ_OPERATORS.forEach(op => {
    if (op.terminal === false) {
        const terminalMatch = true; // We're only looking at non-terminals
        const positiveMatch = (op.positive === concaveType.positive) || (op.positive === true);
        const negativeMatch = (op.negative === concaveType.negative) || (op.negative === true);
        const convexMatch = (op.convex === concaveType.convex) || (op.convex === true);
        const concaveMatch = (op.concave === concaveType.concave) || (op.concave === true);
        
        const overallMatch = terminalMatch && positiveMatch && negativeMatch && convexMatch && concaveMatch;
        
        console.log(`${op.prefix}${op.infix||''}${op.suffix}:`);
        console.log(`  op.positive=${op.positive}, match=${positiveMatch} (${op.positive} === ${concaveType.positive} || ${op.positive} === true)`);
        console.log(`  op.negative=${op.negative}, match=${negativeMatch} (${op.negative} === ${concaveType.negative} || ${op.negative} === true)`);
        console.log(`  op.convex=${op.convex}, match=${convexMatch} (${op.convex} === ${concaveType.convex} || ${op.convex} === true)`);
        console.log(`  op.concave=${op.concave}, match=${concaveMatch} (${op.concave} === ${concaveType.concave} || ${op.concave} === true)`);
        console.log(`  OVERALL: ${overallMatch}`);
        console.log('');
        
        if (overallMatch) {
            concaveOps.push(op);
        }
    }
});

console.log(`Total concave non-terminals found: ${concaveOps.length}`);

// Look specifically at min operator
const minOp = QUIZ_OPERATORS.find(op => op.prefix === "min(");
if (minOp) {
    console.log("MIN OPERATOR DETAILS:");
    console.log("  prefix:", minOp.prefix);
    console.log("  convex:", minOp.convex);
    console.log("  concave:", minOp.concave);
    console.log("  positive:", minOp.positive);  
    console.log("  negative:", minOp.negative);
    console.log("  terminal:", minOp.terminal);
    
    // Test filtering on min specifically
    const positiveMatch = (minOp.positive === concaveType.positive) || (minOp.positive === true);
    const negativeMatch = (minOp.negative === concaveType.negative) || (minOp.negative === true);
    const convexMatch = (minOp.convex === concaveType.convex) || (minOp.convex === true);
    const concaveMatch = (minOp.concave === concaveType.concave) || (minOp.concave === true);
    
    console.log("MIN OPERATOR FILTERING:");
    console.log(`  positive: ${minOp.positive} vs ${concaveType.positive} => ${positiveMatch}`);
    console.log(`  negative: ${minOp.negative} vs ${concaveType.negative} => ${negativeMatch}`);
    console.log(`  convex: ${minOp.convex} vs ${concaveType.convex} => ${convexMatch}`);
    console.log(`  concave: ${minOp.concave} vs ${concaveType.concave} => ${concaveMatch}`);
    console.log(`  SHOULD MATCH: ${positiveMatch && negativeMatch && convexMatch && concaveMatch}`);
} else {
    console.log("MIN OPERATOR NOT FOUND!");
}