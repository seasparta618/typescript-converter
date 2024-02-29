import * as ts from "typescript";

const convertToObject = (type: string): any => {

}

const typeStr = `type Button = {
    variant: "solid" | "text" | "outlined";
}`

console.log(convertToObject(typeStr));
