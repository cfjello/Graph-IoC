# CxMeta

Simple Extended Javascript Type Detection for an instantiated javascript object. The getObjectTypes() returns an object in a json-schema like format, but due to the javascript specific data types the output is NOT compatible with the json-schema that has other data types. The detected javascript data types are: 

- symbol
- string
- number
- bigint
- Date
- boolean
- Regexp
- object
- Array
- function
- User defined classes

as well as:

- null
- undefined


You should Note: 
- Since the data type lookup is done on an instantiated javascript object you will have to initialize the object with values that allow for detection of the type - 'null' and 'undefined' are by definition not very telling.
- Some types like 'enum' in the TypeScript example below, as well all other non-primitive TypeScript types, are not detectable once compiled and assigned to a javascript object, but user defined classes are detected.
- This extented type detection has only been tested using the Deno default V8 (Typescript to) javascript compile target.

Given an instantiated object (the complete file can be found in the './examples' directory):

```
import { getObjectTypes } from "../metadata.ts"
(...)
let employee  = {
    recId: Symbol('REC-ID'),
    employeeNumber: BigInt(9007199254740991),
	lastName: "Hope",
	firstName: "Bob",
	extension: "A",
	email: "bob.hope@heaven.com",
	officeCode: undefined,
	reportsTo: null,
    jobTitle: "BS Manager",
    hired: new Date(2018, 11, 24, 10, 33, 30, 0),
    active: true,
    regexp: /^.*XXX.*$/,
    tools: ['pen', 10, Symbol('ARR-ID')],
    scoreText: DirectionText.Up,
    image: new Image('Office'),
    image2: new Image2('Cubicle'),
    images: [ new Image('Table'),  new Image2('Computer') ]
}


let dataTypes = getObjectTypes('Employee', employee)
console.log(JSON.stringify(dataTypes, undefined, 2))
```
and running it form within the examples directory: 

```
deno run -A --config ../../tsconfig.json ./employee.ts

```
produces the following output, where you should note:

- Even though the enum type is not detected, the correct type of the value it assign to the object is
- For an Array with multiple types are assigned, these types are correctly listed
- User defined classes are listed

```
{
  "$schema": "http://js-schema.org/draft-07/js-schema#",
  "$id": "http://example.com/Employee.schema.json",
  "title": "Employee",
  "type": "object",
  "properties": {
    "recId": {
      "type": "symbol"
    },
    "employeeNumber": {
      "type": "bigint"
    },
    "lastName": {
      "type": "string"
    },
    "firstName": {
      "type": "string"
    },
    "extension": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "officeCode": {
      "type": "undefined"
    },
    "reportsTo": {
      "type": "null"
    },
    "jobTitle": {
      "type": "string"
    },
    "hired": {
      "type": "Date"
    },
    "active": {
      "type": "boolean"
    },
    "regexp": {
      "type": "RegExp"
    },
    "tools": {
      "type": "Array",
      "items": {
        "type": [
          "string",
          "number",
          "symbol"
        ]
      }
    },
    "scoreText": {
      "type": "string"
    },
    "image": {
      "type": "Image"
    },
    "image2": {
      "type": "Image2"
    },
    "images": {
      "type": "Array",
      "items": {
        "type": [
          "Image",
          "Image2"
        ]
      }
    }
  }
}
```
The module will also correctly handle nested type as in:
```
type ProductlinesType = {
    productLine: string;
    textDescription?: string;
    htmlDescription?: string;
    image?: string | null;
} // End of productlinesType


export type ProductsType = {
    productCode: symbol;
    productName: string;
    productLine: ProductlinesType;
    productScale: string;
    productVendor: string;
    productDescription: string;
    quantityInStock: number;
    buyPrice: number;
    MSRP: number;
} // End of productsType

let products: ProductsType = {
    productCode: Symbol("ID"),
    productName: "Guitar String",
    productLine: {
        productLine: "Music",
        textDescription: "Music Store Inc.",
        htmlDescription: "<p>Deine Mega Store ins Germania<p>",
        image: null,
    },
    productScale: "46",
    productVendor: "Fender",
    productDescription: "A-String",
    quantityInStock:999,
    buyPrice: 10,
    MSRP: 999,
}
```
The resulting object will have the same nesting:
```
{
  "$schema": "http://js-schema.org/draft-07/js-schema#",
  "$id": "http://example.com/ProductType.schema.json",
  "title": "ProductType",
  "type": "object",
  "properties": {
    "productCode": {
      "type": "symbol"
    },
    "productName": {
      "type": "string"
    },
    "productLine": {
      "type": "object",
      "properties": {
        "productLine": {
          "type": "string"
        },
        "textDescription": {
          "type": "string"
        },
        "htmlDescription": {
          "type": "string"
        },
        "image": {
          "type": "null"
        }
      }
    },
    "productScale": {
      "type": "string"
    },
    "productVendor": {
      "type": "string"
    },
    "productDescription": {
      "type": "string"
    },
    "quantityInStock": {
      "type": "number"
    },
    "buyPrice": {
      "type": "number"
    },
    "MSRP": {
      "type": "number"
    }
  }
}
```