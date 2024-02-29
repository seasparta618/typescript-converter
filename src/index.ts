import * as ts from "typescript";

const visit = (node: ts.Node, sourceFile: ts.SourceFile): any => {
    return '';
}


const convertToObject = (type: string): any => {
    // create the AST structure of the input string
    const sourceFile = ts.createSourceFile(
        "temp.ts",
        type,
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TS
    );
    let result: any = {};
    ts.forEachChild(sourceFile, node => {
        // type Button = {} is a typeAliasDeclaration
        if(ts.isTypeAliasDeclaration(node)){
            const typeName = node.name.getText(sourceFile).trim();
            result[typeName] = visit(node.type, sourceFile);
        }
    })
    return result;
}

const typeStr = `type Button = {
    variant: "solid" | "text" | "outlined";
}`

console.log(convertToObject(typeStr));
