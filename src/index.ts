import * as ts from "typescript";

const visit = (node: ts.Node, sourceFile: ts.SourceFile): any => {
    if (ts.isTypeLiteralNode(node)){
        const properties: Record<string, any> = {};
        node.members.forEach(member => {
            if(ts.isPropertySignature(member)){
                const key = member.name.getFullText(sourceFile).trim();
                properties[key] = visit(member, sourceFile);
            }
        })
        return properties;
    }
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
            const typeName = node.name.getFullText(sourceFile).trim();
            result[typeName] = visit(node.type, sourceFile);
        }
    })
    return result;
}

const typeStr = `type Button = {
    variant: "solid" | "text" | "outlined";
    disabled: boolean;
    size? : "small" | "medium" | "large";
    role: ["button" , "input"];
};`

console.log(convertToObject(typeStr));
