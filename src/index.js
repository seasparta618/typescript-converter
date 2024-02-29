"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var visit = function (node, sourceFile) {
    if (ts.isTypeLiteralNode(node)) {
        var properties_1 = {};
        node.members.forEach(function (member) {
            if (ts.isPropertySignature(member) && member.type && member.name) {
                var key = member.name.getText(sourceFile).trim();
                properties_1[key] = visit(member.type, sourceFile);
            }
        });
        return properties_1;
    }
    return '';
};
var convertToObject = function (type) {
    var sourceFile = ts.createSourceFile("temp.ts", type, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
    var result = {};
    ts.forEachChild(sourceFile, function (node) {
        if (ts.isTypeAliasDeclaration(node)) {
            var typeName = node.name.getText(sourceFile).trim();
            result[typeName] = visit(node.type, sourceFile);
        }
    });
};
var typeStr = "type Button = {\n    variant: \"solid\" | \"text\" | \"outlined\";\n}";
console.log(convertToObject(typeStr));
