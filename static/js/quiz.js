/**
 * Quiz Module - Client-side version
 * Handles page load for quiz using client-side expression generation
 */
(function($) {
    // Level constants and variables.
    let rightStreakLength = 0;
    let wrongStreakLength = 0;
    let level = 0;
    const STREAK_TO_LEVEL_UP = 5;
    const STREAK_TO_LEVEL_DOWN = 5;
    const MAX_LEVEL = 2;
    
    // Difficulty constants.
    const EASY_KEY = "Easy";
    const MEDIUM_KEY = "Medium";
    const HARD_KEY = "Hard";
    const LEVEL_TO_DIFFICULTY = [EASY_KEY, MEDIUM_KEY, HARD_KEY];

    const DIFFICULTY_MAP = {
        [EASY_KEY]: {prob_terminate: 0.05, prob_increase: 20},
        [MEDIUM_KEY]: {prob_terminate: 0.01, prob_increase: 10},
        [HARD_KEY]: {prob_terminate: 0.01, prob_increase: 5}
    };

    const EXPRESSION_TYPES = [
        {convex: true, concave: false, positive: false, negative: false, dcp:true},
        {convex: false, concave: true, positive: false, negative: false, dcp:true},
        {convex: false, concave: false, positive: false, negative: false, dcp:false},
    ];
    
    // Internal curvature name to display name.
    const CURVATURE_DISPLAY_NAME = {
        "constant": "constant",
        "affine": "affine",
        "convex": "convex",
        "concave": "concave",
        "non-convex": "non-DCP"
    };
    
    const CONTINUE_BUTTON = "<button type=\"button\" " +
                          "id=\"newExpression\" " +
                          "class=\"btn btn-primary new-expression\">" +
                          "New Expression</button>";

    // Global variable to track if we're initialized
    let quizInitialized = false;
    
    // Function to start quiz after Pyodide is ready
    window.startQuiz = function() {
        console.log('startQuiz called, quizInitialized:', quizInitialized);
        if (quizInitialized) {
            console.log('Quiz already initialized, returning');
            return;
        }
        quizInitialized = true;
        
        console.log('Starting quiz...');
        
        // Start with answers hidden.
        $(".answers").hide();
        // Nodes in the parse tree cannot be edited.
        TreeConstructor.editable = false;
        // Start with an expression.
        loadNewExpression();
        // Listen to the answer buttons.
        $(".answer").click(showParseTree);
        // Listen for change in difficulty.
        $(window).bind('hashchange', setDifficulty);
        // Set up event delegation for "New Expression" button (created dynamically)
        $(document).on('click', '#newExpression', function(e) {
            console.log('New Expression button clicked');
            e.preventDefault();
            loadNewExpression();
        });
        
        console.log('Quiz started successfully');
    };

    // Generate and display a random expression.
    function loadNewExpression() {
        console.log('loadNewExpression called');
        console.log('window.pyodideReady:', window.pyodideReady);
        
        // Check if Pyodide is ready
        if (!window.pyodideReady) {
            console.log('Pyodide not ready yet, waiting...');
            setTimeout(loadNewExpression, 500);  // Try again in 500ms
            return;
        }
        
        console.log('Pyodide is ready, proceeding with expression generation...');
        
        const difficulty = getDifficulty();
        
        // Display the current difficulty.
        displayDifficulty(difficulty);
        
        // Choose expression type randomly
        const choice = Math.floor(Math.random() * 3);
        const exprType = EXPRESSION_TYPES[choice];
        const difficultyParams = DIFFICULTY_MAP[difficulty];
        
        try {
            // Generate expression using client-side generator
            const expression = getRandomExpression(
                [exprType], 
                difficultyParams.prob_terminate,
                difficultyParams.prob_increase,
                exprType.dcp
            );
            
            console.log('Generated expression:', expression);
            
            // Display the expression
            function displayExpression(root) {
                console.log('displayExpression called with root:', root);
                TreeConstructor.setLeafLegendText(root);
                $(".alert").alert('close');
                // Don't show help for the box with the expression.
                TreeConstructor.promptActive = true;
                const expressionNode = {name: expression};
                console.log('About to call processParseTree with:', expressionNode);
                TreeConstructor.processParseTree(expressionNode);
                console.log('processParseTree completed');
                // Hide the new expression button until the user selects an answer.
                $(".new-expression").hide();
                $(".answers").show();
                console.log('UI updated - answers shown, new expression button hidden');
            }
            
            // Parse the expression to display it
            console.log('About to parse expression:', expression);
            TreeConstructor.parseObjective(expression, displayExpression, function(error) {
                console.error('Error parsing expression:', error);
            });
            
        } catch (error) {
            console.error('Error generating expression:', error);
            // Fallback to a simple expression
            const fallbackExpression = "x + y";
            function displayFallback(root) {
                TreeConstructor.setLeafLegendText(root);
                $(".alert").alert('close');
                TreeConstructor.promptActive = true;
                const expressionNode = {name: fallbackExpression};
                TreeConstructor.processParseTree(expressionNode);
                $(".new-expression").hide();
                $(".answers").show();
            }
            TreeConstructor.parseObjective(fallbackExpression, displayFallback);
        }
    }

    // Get the current difficulty.
    function getDifficulty() {
        return LEVEL_TO_DIFFICULTY[level];
    }

    /**
     * Show the current difficulty.
     */
    function displayDifficulty(difficulty) {
        $("#difficulty").html("Difficulty: " + difficulty + 
                              " <b class=\"caret\"></b>");
    }

    /**
     * Loads a new expression with the difficulty
     * specified by the hash and resets level variables.
     */
     function setDifficulty() {
        const hash = window.location.hash;
        if (hash.length > 1) {
            const hashContent = hash.substr(1);
            const newLevel = LEVEL_TO_DIFFICULTY.indexOf(hashContent);
            if (newLevel !== -1) {
                level = newLevel;
                rightStreakLength = 0;
                wrongStreakLength = 0;
                loadNewExpression();
            }
            window.location.hash = "";
        }
     }

    /**
     * Show the full parse tree for the current expression.
     */
    function showParseTree() {
        // Hide the answers until the user generates a new expression.
        $(".new-expression").show();
        $(".answers").hide();
        const expression = $("#"+TreeConstants.ROOT_TAG).text();
        // Show help if active.
        TreeConstructor.promptActive = false;
        const fn = partial(feedbackForAnswer, this.id);
        TreeConstructor.createParseTree(expression, TreeConstants.ROOT_TAG, fn);
    }

    /**
     * Show feedback for the user's answer
     * answer - the user's answer.
     */
    function feedbackForAnswer(answer) {
        const curvature = TreeConstructor.root.curvature;
        const suffix = ". " + CONTINUE_BUTTON;
        
        if (curvature === answer) {
            const message = "The expression is " + 
                          CURVATURE_DISPLAY_NAME[curvature] + suffix;
            $(TreeConstants.ERROR_DIV).html('<div class="alert alert-success">' +
            '<span><strong>Correct!</strong> ' + message + '</span></div>');
        } else {
            const message = "The expression is " + CURVATURE_DISPLAY_NAME[curvature] + 
                          ", but you answered " + CURVATURE_DISPLAY_NAME[answer] +
                           suffix;
            $(TreeConstants.ERROR_DIV).html('<div class="alert alert-error">' +
            '<span><strong>Incorrect!</strong> ' + message + '</span></div>');
        }
        
        // Increase/decrease difficulty
        updateLevel(curvature === answer);
        // Event handler for "New Expression" button is already set up in startQuiz()
    }

    /**
     * Increase/decrease difficulty in response to streaks of correct/incorrect
     * answers.
     * correct - was the user's answer correct?
     */
    function updateLevel(correct) {
        if (correct) {
            rightStreakLength++;
            wrongStreakLength = 0;
        } else {
            rightStreakLength = 0;
            wrongStreakLength++;
        }
        // Increase/decrease difficulty based on performance.
        if (rightStreakLength >= STREAK_TO_LEVEL_UP) {
            rightStreakLength = 0;
            level = Math.min(level + 1, MAX_LEVEL);
        } else if (wrongStreakLength >= STREAK_TO_LEVEL_DOWN) {
            wrongStreakLength = 0;
            level = Math.max(level - 1, 0);
        }
    }

    // Utility function to call functions with some arguments supplied.
    // http://stackoverflow.com/questions/321113/how-can-i-pre-set-arguments-in-javascript-function-call-partial-function-appli
    function partial(func /*, 0..n args */) {
        const args = Array.prototype.slice.call(arguments, 1);
        return function() {
            return func.apply(this, args);
        };
    }
    
})(jQuery);