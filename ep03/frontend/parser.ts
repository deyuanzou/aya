// deno-lint-ignore-file no-explicit-any
import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier } from "../frontend/ast.ts"
import { tokenize, Token, TokenType } from "../frontend/lexer.ts"

export default class Parser {
    private tokens: Token[] = [];

    private at(): Token {
        return this.tokens[0] as Token
    }

    private eat() {
        const prev = this.tokens.shift() as Token
        return prev
    }

    private expect(type: TokenType,err:any) {
        const prev = this.tokens.shift() as Token
        if(!prev||prev.type !== type) {
            console.error("Parser error:\n",err,prev,"Expected:",type)
            Deno.exit(1)
        } 
        return prev
      }

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF
    }

    private parse_statement(): Statement {
        return this.parse_expression()
    }

    private parse_expression(): Expression {
        return this.parse_additive_expression()
    }

    private parse_additive_expression(): Expression {
        let left = this.parse_multiplicitave_expression()

        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value
            const right = this.parse_multiplicitave_expression()
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator,
            } as BinaryExpression
        }

        return left

    }

    private parse_multiplicitave_expression(): Expression {
        let left = this.parse_primary_expression()

        while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%") {
            const operator = this.eat().value
            const right = this.parse_primary_expression()
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator,
            } as BinaryExpression
        }

        return left

    }


    private parse_primary_expression(): Expression {
        const current_token_type = this.at().type
        switch (current_token_type) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral
            case TokenType.OpenParen:
                {
                    this.eat()
                    const value = this.parse_expression()
                    this.expect(
                        TokenType.CloseParen,
                        "Unexpected token found inside parenthesised expression.Expected ')'"
                    )
                    return value
                }
            default:
                console.error("Unexpected token found during parsing!", this.at())
                Deno.exit(1)
        }
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode)
        const program: Program = {
            kind: "Program",
            body: [],
        }

        while (this.not_eof()) {
            program.body.push(this.parse_statement())
        }

        return program
    }
}

