// Debug the actual quiz generation
console.log("=== DEBUGGING ACTUAL QUIZ GENERATION ===");

// Simulate exactly what the quiz does
const EXPRESSION_TYPES = [
    {convex: true, concave: false, dcp:true},
    {convex: false, concave: true, dcp:true},
    {convex: false, concave: false, dcp:false},
];

const DIFFICULTY_MAP = {
    "Easy": {prob_terminate: 0.05, prob_increase: 20},
    "Medium": {prob_terminate: 0.01, prob_increase: 10},
    "Hard": {prob_terminate: 0.01, prob_increase: 5}
};

function testQuizGeneration() {
    const difficulty = "Easy";
    
    // Choose expression type randomly like the quiz does
    const choice = Math.floor(Math.random() * 3);
    const exprType = EXPRESSION_TYPES[choice];
    const difficultyParams = DIFFICULTY_MAP[difficulty];
    
    console.log("Expression type chosen:", exprType);
    console.log("Difficulty params:", difficultyParams);
    
    // Generate 5 expressions to see the variety
    for (let i = 0; i < 5; i++) {
        try {
            const expression = getRandomExpression(
                [exprType], 
                difficultyParams.prob_terminate,
                difficultyParams.prob_increase,
                exprType.dcp
            );
            console.log(`Expression ${i+1}:`, expression);
        } catch (error) {
            console.error(`Error generating expression ${i+1}:`, error);
        }
    }
}

// Run the test
testQuizGeneration();