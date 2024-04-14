export enum TokenType {
    Number,
    Identifier,
    Assign,
    OpenParen, CloseParen,
    BinaryOperator,
    Let,
    EOF,
}

const KEYWORDS: Record<string, TokenType> = {
    'let': TokenType.Let,
}

export interface Token {
    type: TokenType,
    value: string,
}

export function make_token(value = '', type: TokenType): Token {
    return { value, type }
}

export function isalpha(src: string): boolean {
    return src.toUpperCase() != src.toLowerCase()
}

export function isskippable(src: string): boolean {
    return src == ' ' || src == '\t' || src == '\n'
}

export function isdigit(src: string): boolean {
    const ch = src.charCodeAt(0)
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]
    return (ch >= bounds[0] && ch <= bounds[1])
}

export function tokenize(source: string): Token[] {
    const tokens = new Array<Token>();
    const src = source.split('');

    while (src.length > 0) {
        if (isskippable(src[0])) {
            src.shift();
        } else if (src[0] == '(') {
            tokens.push(make_token(src.shift(), TokenType.OpenParen));
        } else if (src[0] == ')') {
            tokens.push(make_token(src.shift(), TokenType.CloseParen));
        } else if (src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/') {
            tokens.push(make_token(src.shift(), TokenType.BinaryOperator));
        } else if (src[0] == '=') {
            tokens.push(make_token(src.shift(), TokenType.Assign));
        } else {
            if (isdigit(src[0])) {
                let number = ''
                while (src.length > 0 && isdigit(src[0])) {
                    number += src.shift()
                }

                tokens.push(make_token(number, TokenType.Number));
            } else if (isalpha(src[0])) {
                let identifier = ''
                while (src.length > 0 && isalpha(src[0])) {
                    identifier += src.shift()
                }

                const reserved = KEYWORDS[identifier]
                if (reserved == undefined) {
                    tokens.push(make_token(identifier, TokenType.Identifier));
                } else {
                    tokens.push(make_token(identifier, reserved));
                }

            } else {
                console.log("Unrecognized character found in source:",src[0]);
                Deno.exit(1);
            }
        }

    }

    tokens.push(make_token("EndOfFile", TokenType.EOF))

    return tokens;
}

const source = await Deno.readTextFile("./test.txt")
for (const token of tokenize(source)) {
    console.log(token)
}