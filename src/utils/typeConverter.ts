import * as ts from 'typescript';

type TypeObject = {
  [key: string]: VisitReturnType;
};

type VisitReturnType =
  | TypeObject
  | TypeObject[]
  | string
  | string[]
  | number
  | number[]
  | boolean
  | (string | number | boolean)[];

/**
 * Visits a TypeScript AST node and converts it to a JavaScript object representation.
 *
 * @param {ts.Node} node - The TypeScript AST node to visit.
 * @param {ts.SourceFile} sourceFile - The source file containing the node.
 * @returns {any} - The JavaScript object representation of the node.
 */
const visit = (node: ts.Node, sourceFile: ts.SourceFile): VisitReturnType => {
  // Handle type literals and interface declarations
  if (ts.isTypeLiteralNode(node) || ts.isInterfaceDeclaration(node)) {
    const properties: Record<string, any> = {};
    node.members.forEach((member) => {
      if (ts.isPropertySignature(member) && member.type) {
        // detect if the attribute is optional
        const key =
          `${member.name.getFullText(sourceFile)}${member.questionToken ? '?' : ''}`.trim();
        properties[key] = visit(member.type, sourceFile);
      }
    });
    return properties;
  } else if (ts.isUnionTypeNode(node)) {
    // check the union type
    return node.types.map((type) => getLiteralType(type, sourceFile));
  } else if (ts.isTupleTypeNode(node)) {
    // check the tuple type
    return node.elements.map((element) => getLiteralType(element, sourceFile));
  } else if (ts.isArrayTypeNode(node)) {
    return 'Array';
  } else if (ts.isFunctionTypeNode(node)) {
    return 'function';
  } else if (node.kind === ts.SyntaxKind.BooleanKeyword) {
    return 'boolean';
  } else if (node.kind === ts.SyntaxKind.StringKeyword) {
    return 'string';
  } else if (node.kind === ts.SyntaxKind.NumberKeyword) {
    return 'number';
  }
  // Default case for those unhandled types
  return 'unknown';
};

/**
 * Extracts the text of a literal type node.
 *
 * @param {ts.LiteralTypeNode} type - The literal type node.
 * @param {ts.SourceFile} sourceFile - The source file containing the node.
 * @returns {string} - The text of the literal type node.
 */
const getLiteralType = (
  type: ts.TypeNode,
  sourceFile: ts.SourceFile
): string | number | boolean => {
  if (ts.isLiteralTypeNode(type)) {
    const text = type.literal.getText(sourceFile);
    // Check if the literal is a number
    if (type.literal.kind === ts.SyntaxKind.NumericLiteral) {
      return parseFloat(text);
    }
    if (
      [ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword].includes(
        type.literal.kind
      )
    ) {
      return type.literal.kind === ts.SyntaxKind.TrueKeyword;
    }
    // Otherwise, treat it as a string and remove quotes
    return text.replace(/\"/g, '');
  }
  return 'unknown';
};

/**
 * Converts a TypeScript type string to a JavaScript object representation.
 *
 * @param {string} type - The TypeScript type string to convert.
 * @returns {any} - The JavaScript object representation of the type.
 */
export const convertToObject = (type: string): TypeObject | null => {
  // create the AST structure of the input string
  const sourceFile = ts.createSourceFile(
    'temp.ts',
    type,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );

  if (!checkSyntax(sourceFile)) {
    console.error('Syntax error in input. Conversion aborted.');
    return null;
  }
  let result: any = {};
  ts.forEachChild(sourceFile, (node) => {
    // Handle type alias and interface declarations
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      const typeName = node.name.getText(sourceFile).trim();
      const typeMembers = ts.isTypeAliasDeclaration(node) ? node.type : node;
      result[typeName] = visit(typeMembers, sourceFile);
    }
  });
  return result;
};

/**
 * Check if the parsed tyescript source file can construct a valid AST
 * This function accepts a parsed ts source file, and will return if it is a valid AST or not
 *
 * @param {ts.SourceFile} type - The parsed typescript source file
 */
const checkSyntax = (sourceFile: ts.SourceFile): boolean => {
  const program = ts.createProgram({
    rootNames: [sourceFile.fileName],
    options: {},
    // the min set to implement host interface
    host: {
      getSourceFile: (fileName) => (fileName === sourceFile.fileName ? sourceFile : undefined),
      writeFile: () => { },
      // Default library file.
      getDefaultLibFileName: () => 'lib.d.ts',
      useCaseSensitiveFileNames: () => true,
      getCanonicalFileName: (fileName) => fileName,
      // minimum implementation
      getCurrentDirectory: () => '',
      getNewLine: () => '\n',
      fileExists: (fileName) => fileName === sourceFile.fileName,
      // minimum implementation
      readFile: () => '',
    },
  });
  
  // Get the syntactic diagnostics (syntax errors) for the source file.
  const diagnostics = program.getSyntacticDiagnostics(sourceFile);

  if (diagnostics.length > 0) {
    diagnostics.forEach((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      console.error(`Syntax error in input: ${message}`);
    });
    return false;
  }

  return true;
}