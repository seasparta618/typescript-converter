import * as ts from "typescript";

const visit = (node: ts.Node, sourceFile: ts.SourceFile): any => {
    if (ts.isTypeLiteralNode(node)) {
        const properties: Record<string, any> = {};
        node.members.forEach(member => {
            if (ts.isPropertySignature(member) && member.type) {
                // detect if the attribute is optional
                const key = `${member.name.getFullText(sourceFile)}${member.questionToken ? '?' : ''}`.trim();
                properties[key] = visit(member.type, sourceFile);
            }
        })
        return properties;
    } else if (ts.isUnionTypeNode(node)) {
        // check the union type
        return node.types.map(type => {
            if (ts.isLiteralTypeNode(type) && type.literal) {
                return type.literal.getText(sourceFile).replace(/\"/g, "");
            }
            return 'unknown';
        })
    } else if (ts.isTupleTypeNode(node)) {
        // check the tuple type
        return node.elements.map(element => {
            if (ts.isLiteralTypeNode(element) && element.literal) {
                return element.literal.getText(sourceFile).replace(/\"/g, "");
            }
            return 'unknow';
        })
    } else if (ts.isIntersectionTypeNode(node)) {
        const mergedTypes: Record<string, any> = {};
        node.types.forEach(type => {
            const typeObject = visit(type, sourceFile);
            Object.assign(mergedTypes, typeObject);
        });
        return mergedTypes;
    } else if (ts.isArrayTypeNode(node)) {
        return 'Array';
    } else if (ts.isFunctionTypeNode(node)) {
        return 'function';
    } else if (node.kind === ts.SyntaxKind.BooleanKeyword) {
        return 'boolean';
    } else if (node.kind === ts.SyntaxKind.StringKeyword){
        return 'string';
    } else if (node.kind === ts.SyntaxKind.NumberKeyword){
        return 'number';
    }
    return 'unknown';
}


export const convertToObject = (type: string): any => {
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
    onClick: () => void;
    classList: string[];
};`

console.log(convertToObject(typeStr));
