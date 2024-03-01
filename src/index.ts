import * as ts from "typescript";

const visit = (node: ts.Node, sourceFile: ts.SourceFile): any => {
    if (ts.isTypeLiteralNode(node)) {
        const properties: Record<string, any> = {};
        node.members.forEach(member => {
            if (ts.isPropertySignature(member) && member.type) {
                const key = member.name.getFullText(sourceFile).trim();
                properties[key] = visit(member.type, sourceFile);
            }
        })
        return properties;
    } else if (ts.isUnionTypeNode(node)) {
        return node.types.map(type => {
            if (ts.isLiteralTypeNode(type) && type.literal) {
                return type.literal.getText(sourceFile).replace(/\"/g, "");
            }
            return 'unknow';
        })
    } else if (ts.isIntersectionTypeNode(node)) {

    }
    return 'unknown';
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
        if (ts.isTypeAliasDeclaration(node)) {
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
