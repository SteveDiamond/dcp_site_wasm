/**
 * Quiz Expression Generator
 * Client-side equivalent of Django models.py expression generation logic
 */

/**
 * Generates a random expression based on possibilities and difficulty parameters
 * @param {Array} possibilities - Array of expression type constraints
 * @param {number} probTerminate - Probability of returning a terminal expression
 * @param {number} probIncrease - Factor by which termination probability increases each level
 * @param {boolean} dcp - Whether the expression should be DCP compliant
 * @returns {string} Generated expression string
 */
function getRandomExpression(possibilities, probTerminate, probIncrease, dcp = false) {
    const root = getRandomExpressionTree(possibilities, probTerminate, probIncrease);
    if (!dcp) {
        addDCPError(root);
    }
    return treeToString(root[0], root[1]);
}

/**
 * Generates a random parse tree representing an expression
 * @param {Array} possibilities - Array of expression type constraints
 * @param {number} probTerminate - Probability of returning a terminal expression
 * @param {number} probIncrease - Factor by which termination probability increases each level
 * @returns {Array} [operator, children] tree structure
 */
function getRandomExpressionTree(possibilities, probTerminate, probIncrease) {
    const terminal = Math.random() < probTerminate;
    
    // Filter operators based on possibilities and terminal constraint
    let candidateOperators = [];
    for (const possibility of possibilities) {
        const filtered = QUIZ_OPERATORS.filter(op => {
            // Terminal constraint is the most important for difficulty
            const terminalMatch = (op.terminal === terminal);
            
            // For now, be more permissive with curvature to focus on difficulty working
            const curvatureMatch = (possibility.convex && op.convex) || 
                                  (possibility.concave && op.concave) ||
                                  (!possibility.convex && !possibility.concave); // non-DCP case
            
            return terminalMatch && curvatureMatch;
        });
        candidateOperators = candidateOperators.concat(filtered);
    }
    
    if (candidateOperators.length === 0) {
        // Fallback to any terminal if no operators match
        candidateOperators = QUIZ_OPERATORS.filter(op => op.terminal);
    }
    
    const selectedOperator = weightedChoice(candidateOperators);
    const children = [];
    
    // Generate children based on operator argument requirements
    for (let i = 0; i < selectedOperator.num_args; i++) {
        const possibleArgs = selectedOperator.arguments.filter(arg => arg.position === i);
        const possibleTypes = possibleArgs.map(arg => ({
            positive: arg.positive,
            negative: arg.negative,
            convex: arg.convex,
            concave: arg.concave
        }));
        
        if (possibleTypes.length > 0) {
            children.push(getRandomExpressionTree(
                possibleTypes,
                probIncrease * probTerminate,
                probIncrease
            ));
        }
    }
    
    return [selectedOperator, children];
}

/**
 * Randomly select an operator from the list, taking operator weight into account
 * @param {Array} operators - List of operators
 * @returns {Object} Selected operator
 */
function weightedChoice(operators) {
    if (operators.length === 0) {
        throw new Error("No operators available for weighted choice");
    }
    
    const totalWeight = operators.reduce((sum, op) => sum + op.weight, 0);
    let choice = totalWeight * Math.random();
    
    for (const op of operators) {
        choice -= op.weight;
        if (choice <= 0) {
            return op;
        }
    }
    
    // Fallback - should not happen, but return last operator if we get here
    return operators[operators.length - 1];
}

/**
 * Converts a parse tree into a string
 * @param {Object} expression - The current node operator
 * @param {Array} children - The arguments of the expression
 * @returns {string} Expression string
 */
function treeToString(expression, children) {
    const names = [];
    for (let i = 0; i < children.length; i++) {
        const name = treeToString(children[i][0], children[i][1]);
        names.push(addParens(name, expression, children[i][0], i));
    }
    
    if (expression.infix) {
        return expression.prefix + names.join(expression.infix) + expression.suffix;
    } else {
        return expression.prefix + expression.suffix;
    }
}

/**
 * Add surrounding parentheses if needed for order of operations
 * @param {string} name - The name without parentheses
 * @param {Object} expression - The parent expression
 * @param {Object} arg - The argument operator
 * @param {number} argPosition - The position of the argument
 * @returns {string} Name with parentheses if needed
 */
function addParens(name, expression, arg, argPosition) {
    if (expression.infix === " - " && 
        [" - ", " + "].includes(arg.infix) && 
        argPosition === 1) {
        return "(" + name + ")";
    }
    return name;
}

/**
 * Add a DCP error by randomly replacing a non-root, non-terminal node
 * @param {Array} root - Tree structure [operator, children]
 */
function addDCPError(root) {
    const total = countNonTerminals(root[0], root[1]);
    if (total > 1) {
        const choice = Math.floor(Math.random() * (total - 1)) + 2; // 2 to total
        replaceNonTerminal(root, choice, {count: 0});
    }
}

/**
 * Count the number of non-terminals in the sub-tree rooted at the given node
 * @param {Object} node - The root node operator
 * @param {Array} children - The children of the root
 * @returns {number} Count of non-terminals
 */
function countNonTerminals(node, children) {
    if (children.length === 0) {
        return 0;
    }
    return 1 + children.reduce((sum, child) => sum + countNonTerminals(child[0], child[1]), 0);
}

/**
 * Replace a non-terminal node to introduce DCP errors
 * @param {Array} root - Tree structure [operator, children]
 * @param {number} choice - The number of the node to replace
 * @param {Object} countRef - Reference object to track count
 * @returns {number} Updated count
 */
function replaceNonTerminal(root, choice, countRef) {
    if (root[1].length === 0) {
        return countRef.count;
    }
    
    countRef.count += 1;
    if (countRef.count === choice) {
        // Find operators with same number of arguments but different curvature
        const options = QUIZ_OPERATORS.filter(op => 
            op.num_args === root[0].num_args &&
            op.convex === root[0].concave &&
            op.concave === root[0].convex
        );
        
        if (options.length > 0) {
            root[0] = weightedChoice(options);
        }
    }
    
    for (const child of root[1]) {
        countRef.count = replaceNonTerminal(child, choice, countRef);
    }
    
    return countRef.count;
}