import { RuntimeValue, NumberValue, NullValue } from "./value.ts"
import { Statement, NumericLiteral, BinaryExpression } from "../frontend/ast.ts"
import { Program } from "../frontend/ast.ts";


function evaluate_program(program: Program): RuntimeValue {
    let lastEvaluated: RuntimeValue = { type: "null", value: "null" } as NullValue

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement)
    }

    return lastEvaluated
}

function evaluate_numeric_binary_expression(left: NumberValue, right: NumberValue, operator: string): NumberValue {
    let result = 0
    if (operator == "+") {
        result = left.value + right.value
    } else if (operator == "-") {
        result = left.value - right.value
    } else if (operator == "*") {
        result = left.value * right.value
    } else if (operator == "/") {
        result = left.value / right.value
    } else if (operator == "%") {
        result = left.value % right.value
    }

    return {
        type:"number",
        value: result,
    } as NumberValue
}

function evaluate_binary_expression(binaryExpression: BinaryExpression): RuntimeValue {
    const left = evaluate(binaryExpression.left)
    const right = evaluate(binaryExpression.right)
    const operator = binaryExpression.operator

    if (left.type == "number" && right.type == "number") {
        return evaluate_numeric_binary_expression(left as NumberValue, right as NumberValue, operator)
    }

    return { type: "null", value: "null" } as NullValue
}

export function evaluate(root: Statement): RuntimeValue {
    switch (root.kind) {
        case "NumericLiteral":
            return {
                value: (root as NumericLiteral).value,
                type: "number",
            } as NumberValue
        case "NullLiteral":
            return {
                value: "null",
                type: "null",
            } as NullValue
        case "BinaryExpression":
            return evaluate_binary_expression(root as BinaryExpression)
        case "Program":
            return evaluate_program(root as Program)
        default:
            console.error("This AST Node has not yet been able to be evaluated", root);
            Deno.exit(0)
    }
}