import Parser from "./frontend/parser.ts"

repl()

function repl() {
    const parser = new Parser()
    console.log("\naya v0.1.0")
    while(true) {
        const input = prompt("aya >")
        if (!input || input.includes("exit")) {
            Deno.exit(1)
        }

        const program = parser.produceAST(input)
        console.log(program)
    }
}