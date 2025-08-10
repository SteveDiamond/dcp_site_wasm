/**
 * Quiz Operator Definitions
 * Converted from Django populate_db.py to provide the same functionality client-side
 */

const DEFAULT_WEIGHT = 1000;

// Operator definitions with arguments
const QUIZ_OPERATORS = [
    // Terminals - Unknown sign variables
    {
        prefix: "x", infix: "", suffix: "",
        terminal: true, num_args: 0,
        weight: 0.1 * DEFAULT_WEIGHT / 6,
        positive: false, negative: false,
        convex: true, concave: true,
        arguments: []
    },
    {
        prefix: "y", infix: "", suffix: "",
        terminal: true, num_args: 0,
        weight: 0.1 * DEFAULT_WEIGHT / 6,
        positive: false, negative: false,
        convex: true, concave: true,
        arguments: []
    },
    {
        prefix: "z", infix: "", suffix: "",
        terminal: true, num_args: 0,
        weight: 0.1 * DEFAULT_WEIGHT / 6,
        positive: false, negative: false,
        convex: true, concave: true,
        arguments: []
    },
    {
        prefix: "u", infix: "", suffix: "",
        terminal: true, num_args: 0,
        weight: 0.1 * DEFAULT_WEIGHT / 6,
        positive: false, negative: false,
        convex: true, concave: true,
        arguments: []
    },
    {
        prefix: "v", infix: "", suffix: "",
        terminal: true, num_args: 0,
        weight: 0.1 * DEFAULT_WEIGHT / 6,
        positive: false, negative: false,
        convex: true, concave: true,
        arguments: []
    },
    {
        prefix: "w", infix: "", suffix: "",
        terminal: true, num_args: 0,
        weight: 0.1 * DEFAULT_WEIGHT / 6,
        positive: false, negative: false,
        convex: true, concave: true,
        arguments: []
    },

    // Affine expressions
    {
        prefix: "x / 2", infix: "", suffix: "",
        terminal: true, num_args: 0,
        weight: 0.1 * DEFAULT_WEIGHT / 3,
        positive: false, negative: false,
        convex: true, concave: true,
        arguments: []
    },
    {
        prefix: "y - 42", infix: "", suffix: "",
        terminal: true, num_args: 0,
        weight: 0.1 * DEFAULT_WEIGHT / 3,
        positive: false, negative: false,
        convex: true, concave: true,
        arguments: []
    },
    {
        prefix: "364 * z", infix: "", suffix: "",
        terminal: true, num_args: 0,
        weight: 0.1 * DEFAULT_WEIGHT / 3,
        positive: false, negative: false,
        convex: true, concave: true,
        arguments: []
    },

    // Binary + operators (convex case)
    {
        prefix: "", infix: " + ", suffix: "",
        terminal: false, num_args: 2,
        weight: DEFAULT_WEIGHT / 2,
        positive: false, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: false, negative: false, convex: true, concave: false},
            {position: 1, positive: false, negative: false, convex: true, concave: false}
        ]
    },
    // Binary + operators (concave case)
    {
        prefix: "", infix: " + ", suffix: "",
        terminal: false, num_args: 2,
        weight: DEFAULT_WEIGHT / 2,
        positive: false, negative: false,
        convex: false, concave: true,
        arguments: [
            {position: 0, positive: false, negative: false, convex: false, concave: true},
            {position: 1, positive: false, negative: false, convex: false, concave: true}
        ]
    },

    // Binary - operators (convex case)
    {
        prefix: "", infix: " - ", suffix: "",
        terminal: false, num_args: 2,
        weight: DEFAULT_WEIGHT / 2,
        positive: false, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: false, negative: false, convex: true, concave: false},
            {position: 1, positive: false, negative: false, convex: false, concave: true}
        ]
    },
    // Binary - operators (concave case)
    {
        prefix: "", infix: " - ", suffix: "",
        terminal: false, num_args: 2,
        weight: DEFAULT_WEIGHT / 2,
        positive: false, negative: false,
        convex: false, concave: true,
        arguments: [
            {position: 0, positive: false, negative: false, convex: false, concave: true},
            {position: 1, positive: false, negative: false, convex: true, concave: false}
        ]
    },

    // max operator
    {
        prefix: "max(", infix: ", ", suffix: ")",
        terminal: false, num_args: 2,
        weight: DEFAULT_WEIGHT,
        positive: false, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: false, negative: false, convex: true, concave: false},
            {position: 1, positive: false, negative: false, convex: true, concave: false}
        ]
    },

    // min operator
    {
        prefix: "min(", infix: ", ", suffix: ")",
        terminal: false, num_args: 2,
        weight: DEFAULT_WEIGHT,
        positive: false, negative: false,
        convex: false, concave: true,
        arguments: [
            {position: 0, positive: false, negative: false, convex: false, concave: true},
            {position: 1, positive: false, negative: false, convex: false, concave: true}
        ]
    },

    // log operator
    {
        prefix: "log(", infix: ", ", suffix: ")",
        terminal: false, num_args: 1,
        weight: DEFAULT_WEIGHT,
        positive: false, negative: false,
        convex: false, concave: true,
        arguments: [
            {position: 0, positive: false, negative: false, convex: false, concave: true}
        ]
    },

    // abs operator
    {
        prefix: "abs(", infix: ", ", suffix: ")",
        terminal: false, num_args: 1,
        weight: DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: true, negative: false, convex: true, concave: false},
            {position: 0, positive: false, negative: true, convex: false, concave: true},
            {position: 0, positive: false, negative: false, convex: true, concave: true}
        ]
    },

    // entr operator
    {
        prefix: "entr(", infix: ", ", suffix: ")",
        terminal: false, num_args: 1,
        weight: 0.5 * DEFAULT_WEIGHT,
        positive: false, negative: false,
        convex: false, concave: true,
        arguments: [
            {position: 0, positive: false, negative: false, convex: true, concave: true}
        ]
    },

    // exp operator
    {
        prefix: "exp(", infix: ", ", suffix: ")",
        terminal: false, num_args: 1,
        weight: DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: false, negative: false, convex: true, concave: false}
        ]
    },

    // geo_mean operator
    {
        prefix: "geo_mean(", infix: ", ", suffix: ")",
        terminal: false, num_args: 2,
        weight: DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: false, concave: true,
        arguments: [
            {position: 0, positive: false, negative: false, convex: false, concave: true},
            {position: 1, positive: false, negative: false, convex: false, concave: true}
        ]
    },

    // huber operator
    {
        prefix: "huber(", infix: ", ", suffix: ")",
        terminal: false, num_args: 1,
        weight: DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: true, negative: false, convex: true, concave: false},
            {position: 0, positive: false, negative: true, convex: false, concave: true},
            {position: 0, positive: false, negative: false, convex: true, concave: true}
        ]
    },

    // inv_pos operator
    {
        prefix: "inv_pos(", infix: ", ", suffix: ")",
        terminal: false, num_args: 1,
        weight: DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: false, negative: false, convex: false, concave: true}
        ]
    },

    // kl_div operator
    {
        prefix: "kl_div(", infix: ", ", suffix: ")",
        terminal: false, num_args: 2,
        weight: 0.25 * DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: false, negative: false, convex: true, concave: true},
            {position: 1, positive: false, negative: false, convex: true, concave: true}
        ]
    },

    // log_sum_exp operator
    {
        prefix: "log_sum_exp(", infix: ", ", suffix: ")",
        terminal: false, num_args: 2,
        weight: DEFAULT_WEIGHT,
        positive: false, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: false, negative: false, convex: true, concave: false},
            {position: 1, positive: false, negative: false, convex: true, concave: false}
        ]
    },

    // norm2 operator
    {
        prefix: "norm2(", infix: ", ", suffix: ")",
        terminal: false, num_args: 2,
        weight: 0.33 * DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: true, negative: false, convex: true, concave: false},
            {position: 0, positive: false, negative: true, convex: false, concave: true},
            {position: 0, positive: false, negative: false, convex: true, concave: true},
            {position: 1, positive: true, negative: false, convex: true, concave: false},
            {position: 1, positive: false, negative: true, convex: false, concave: true},
            {position: 1, positive: false, negative: false, convex: true, concave: true}
        ]
    },

    // norm1 operator
    {
        prefix: "norm1(", infix: ", ", suffix: ")",
        terminal: false, num_args: 2,
        weight: 0.33 * DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: true, negative: false, convex: true, concave: false},
            {position: 0, positive: false, negative: true, convex: false, concave: true},
            {position: 0, positive: false, negative: false, convex: true, concave: true},
            {position: 1, positive: true, negative: false, convex: true, concave: false},
            {position: 1, positive: false, negative: true, convex: false, concave: true},
            {position: 1, positive: false, negative: false, convex: true, concave: true}
        ]
    },

    // norm_inf operator
    {
        prefix: "norm_inf(", infix: ", ", suffix: ")",
        terminal: false, num_args: 2,
        weight: 0.33 * DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: true, negative: false, convex: true, concave: false},
            {position: 0, positive: false, negative: true, convex: false, concave: true},
            {position: 0, positive: false, negative: false, convex: true, concave: true},
            {position: 1, positive: true, negative: false, convex: true, concave: false},
            {position: 1, positive: false, negative: true, convex: false, concave: true},
            {position: 1, positive: false, negative: false, convex: true, concave: true}
        ]
    },

    // sqrt operator
    {
        prefix: "sqrt(", infix: ", ", suffix: ")",
        terminal: false, num_args: 1,
        weight: DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: false, concave: true,
        arguments: [
            {position: 0, positive: false, negative: false, convex: false, concave: true}
        ]
    },

    // pos operator
    {
        prefix: "pos(", infix: ", ", suffix: ")",
        terminal: false, num_args: 1,
        weight: DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: false, negative: false, convex: true, concave: false}
        ]
    },

    // square operator
    {
        prefix: "square(", infix: ", ", suffix: ")",
        terminal: false, num_args: 1,
        weight: DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: true, negative: false, convex: true, concave: false},
            {position: 0, positive: false, negative: true, convex: false, concave: true},
            {position: 0, positive: false, negative: false, convex: true, concave: true}
        ]
    },

    // quad_over_lin operator
    {
        prefix: "quad_over_lin(", infix: ", ", suffix: ")",
        terminal: false, num_args: 2,
        weight: DEFAULT_WEIGHT,
        positive: true, negative: false,
        convex: true, concave: false,
        arguments: [
            {position: 0, positive: true, negative: false, convex: true, concave: false},
            {position: 0, positive: false, negative: true, convex: false, concave: true},
            {position: 0, positive: false, negative: false, convex: true, concave: true},
            {position: 1, positive: false, negative: false, convex: false, concave: true}
        ]
    }
];