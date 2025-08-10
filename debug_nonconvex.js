// Debug non-convex filtering
console.log("=== DEBUGGING NON-CONVEX FILTERING ===");

const nonConvexTest = {convex: false, concave: false, positive: false, negative: false};

console.log("Testing non-convex expression filtering...");

const nonConvexTerminals = QUIZ_OPERATORS.filter(op => {
    const terminalMatch = (op.terminal === true);
    const positiveMatch = (op.positive === nonConvexTest.positive) || (op.positive === true);
    const negativeMatch = (op.negative === nonConvexTest.negative) || (op.negative === true);
    const convexMatch = (op.convex === nonConvexTest.convex) || (op.convex === true);
    const concaveMatch = (op.concave === nonConvexTest.concave) || (op.concave === true);
    
    console.log(`Terminal ${op.prefix}${op.suffix}: convex=${convexMatch}(${op.convex}), concave=${concaveMatch}(${op.concave}) => ${terminalMatch && convexMatch && concaveMatch && positiveMatch && negativeMatch}`);
    
    return terminalMatch && positiveMatch && negativeMatch && convexMatch && concaveMatch;
});

const nonConvexNonTerminals = QUIZ_OPERATORS.filter(op => {
    const terminalMatch = (op.terminal === false);
    const positiveMatch = (op.positive === nonConvexTest.positive) || (op.positive === true);
    const negativeMatch = (op.negative === nonConvexTest.negative) || (op.negative === true);
    const convexMatch = (op.convex === nonConvexTest.convex) || (op.convex === true);
    const concaveMatch = (op.concave === nonConvexTest.concave) || (op.concave === true);
    
    console.log(`Non-terminal ${op.prefix}${op.infix}${op.suffix}: convex=${convexMatch}(${op.convex}), concave=${concaveMatch}(${op.concave}) => ${terminalMatch && convexMatch && concaveMatch && positiveMatch && negativeMatch}`);
    
    return terminalMatch && positiveMatch && negativeMatch && convexMatch && concaveMatch;
});

console.log(`Non-convex terminals: ${nonConvexTerminals.length}`);
console.log(`Non-convex non-terminals: ${nonConvexNonTerminals.length}`);

// The issue: for non-convex expressions {convex: false, concave: false}:
// - convexMatch = (op.convex === false) || (op.convex === true) 
// - concaveMatch = (op.concave === false) || (op.concave === true)
// 
// For affine variables: op.convex=true, op.concave=true
// - convexMatch = (true === false) || (true === true) = false || true = TRUE  
// - concaveMatch = (true === false) || (true === true) = false || true = TRUE
//
// For convex-only operators like max(): op.convex=true, op.concave=false  
// - convexMatch = (true === false) || (true === true) = false || true = TRUE
// - concaveMatch = (false === false) || (false === true) = true || false = TRUE
//
// So EVERYTHING matches! That's not right.