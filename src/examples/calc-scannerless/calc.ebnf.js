import * as persil from "../../..";
import * as grammar from "./calc.ebnf.grammar";

const methods = {
    start: {
        get result() {
            return this.body.result;
        }
    },

    expr: {
        get result() {
            const first = this.first.result;
            return this.operations ?
                this.operations.reduce((prev, curr) =>
                    curr.operator === "+" ?
                        prev + curr.operand.result :
                        prev - curr.operand.result,
                    first) :
                first;
        }
    },

    term: {
        get result() {
            const first = this.first.result;
            return this.operations ?
                this.operations.reduce((prev, curr) =>
                    curr.operator === "*" ?
                        prev * curr.operand.result :
                        prev / curr.operand.result,
                    first) :
                first;
        }
    },

    primary: {
        get result() {
            return this.value.result;
        }
    },

    int: {
        get result() {
            return parseInt(this.$text);
        }
    }
};

const parseCalc = persil.ast.parser(grammar, {methods});
const src = "56 + 37*2 - (8/75 + 904)";
const expr = parseCalc(src);

if (expr.error) {
    process.stderr.write(persil.error(src, expr) + "\n");
}

console.log(`Result = ${expr.data.result}`);
console.log(`State count = ${expr.stateCount}`);