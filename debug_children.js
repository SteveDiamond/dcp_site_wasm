// Debug children generation for log_sum_exp
console.log("=== DEBUGGING CHILDREN GENERATION ===");

const logSumExpOp = QUIZ_OPERATORS.find(op => op.prefix === "log_sum_exp(");
const geoMeanOp = QUIZ_OPERATORS.find(op => op.prefix === "geo_mean(");

console.log("log_sum_exp operator:", logSumExpOp);
console.log("geo_mean operator:", geoMeanOp);

if (logSumExpOp && geoMeanOp) {
    console.log("\nlog_sum_exp argument constraints:");
    logSumExpOp.arguments.forEach((arg, i) => {
        console.log(`  Position ${i}: convex=${arg.convex}, concave=${arg.concave}, positive=${arg.positive}, negative=${arg.negative}`);
    });
    
    console.log("\ngeo_mean properties:");
    console.log(`  convex=${geoMeanOp.convex}, concave=${geoMeanOp.concave}, positive=${geoMeanOp.positive}, negative=${geoMeanOp.negative}`);
    
    // Test if geo_mean would be filtered for log_sum_exp's first argument
    const argConstraint = logSumExpOp.arguments.find(arg => arg.position === 0);
    console.log("\nTesting if geo_mean matches log_sum_exp's first argument constraint:");
    
    if (argConstraint) {
        const possibleType = {
            positive: argConstraint.positive,
            negative: argConstraint.negative,
            convex: argConstraint.convex,
            concave: argConstraint.concave
        };
        
        console.log("Required type:", possibleType);
        
        // Test the filtering logic
        const positiveMatch = (geoMeanOp.positive === possibleType.positive) || (geoMeanOp.positive === true);
        const negativeMatch = (geoMeanOp.negative === possibleType.negative) || (geoMeanOp.negative === true);
        const convexMatch = (geoMeanOp.convex === possibleType.convex) || (geoMeanOp.convex === true);
        const concaveMatch = (geoMeanOp.concave === possibleType.concave) || (geoMeanOp.concave === true);
        
        console.log("Filtering results:");
        console.log(`  positive: ${geoMeanOp.positive} === ${possibleType.positive} || ${geoMeanOp.positive} === true => ${positiveMatch}`);
        console.log(`  negative: ${geoMeanOp.negative} === ${possibleType.negative} || ${geoMeanOp.negative} === true => ${negativeMatch}`);
        console.log(`  convex: ${geoMeanOp.convex} === ${possibleType.convex} || ${geoMeanOp.convex} === true => ${convexMatch}`);
        console.log(`  concave: ${geoMeanOp.concave} === ${possibleType.concave} || ${geoMeanOp.concave} === true => ${concaveMatch}`);
        
        const wouldMatch = positiveMatch && negativeMatch && convexMatch && concaveMatch;
        console.log(`  OVERALL MATCH: ${wouldMatch}`);
        
        if (wouldMatch) {
            console.log("❌ BUG: geo_mean incorrectly matches log_sum_exp's argument constraints!");
        } else {
            console.log("✅ CORRECT: geo_mean correctly rejected for log_sum_exp arguments");
        }
    }
}