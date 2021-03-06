import * as persil from "../../..";
import {terminals} from "./calc-terminals";

const PRIMARY = 0;
const TERM = 1;
const EXPR = 2;

const INT = 3;
const LPAR = 4;
const RPAR = 5;
const MOP = 6;
const AOP = 7;

const grammar = {
    symbols: [
        "primary", "term", "expr",
        {ext: "int"}, "(", ")", /^[*/]/, /^[+-]/
    ],
    rules: [
        // PRIMARY: INT | "(" START ")"
        [
            [INT],
            [LPAR, EXPR, RPAR]
        ],
        // TERM: (TERM [*/])* PRIMARY
        [
            [TERM, MOP, PRIMARY],
            [PRIMARY]
        ],
        // EXPR: (EXPR [+-])* TERM
        [
            [EXPR, AOP, TERM],
            [TERM]
        ]
    ]
};

export function actions(grammar, rule, production, data) {
    switch (grammar.symbols[rule]) {
        case "primary":
            switch (production) {
                case 0:
                    return parseInt(data[0].text);
                case 1:
                    return data[1];
            }
            break;
        case "term":
            if (production === 0) {
                switch (data[1].text) {
                    case "*":
                        return data[0] * data[2];
                    case "/":
                        return data[0] / data[2];
                }
            }
            break;
        case "expr":
            if (production === 0) {
                switch (data[1].text) {
                    case "+":
                        return data[0] + data[2];
                    case "-":
                        return data[0] - data[2];
                }
            }
    }
    return data[0];
}

const parseCalc = persil.parser(grammar, {start: "expr", actions, scan: persil.re.scanner(terminals)});

if (module === require.main) {
    const src = "56 + 37*2 - (8/75 + 904)";
    const expr = parseCalc(src);
    if (expr.error) {
        process.stderr.write(persil.error(src, expr) + "\n");
    }

    console.log(`Result = ${expr.data}`);
    console.log(`State count = ${expr.stateCount}`);
}
