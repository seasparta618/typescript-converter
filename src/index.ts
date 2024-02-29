import * as ts from "typescript";

const convertToObject = (type: string): any => {
    const sourceFile = ts.createSourceFile(
        "temp.ts",
        type,
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TS
    );
}

const typeStr = `type Button = {
    variant: "solid" | "text" | "outlined";
}`

console.log(convertToObject(typeStr));
