import { convertToObject } from './typeConverter';

describe('convertToObject', () => {
  describe('basic type test', () => {
    it('should convert a simple type', () => {
      const typeStr = `type Simple = {
      flag: boolean;
    };`;
      const expected = {
        Simple: {
          flag: 'boolean',
        },
      };
      expect(convertToObject(typeStr)).toEqual(expected);
    });

    it('should handle union types', () => {
      const typeStr = `type Union = {
      variant: "a" | "b" | "c";
    };`;
      const expected = {
        Union: {
          variant: ['a', 'b', 'c'],
        },
      };
      expect(convertToObject(typeStr)).toEqual(expected);
    });

    it('should handle optional properties', () => {
      const typeStr = `type Optional = {
      key?: string;
    };`;
      const expected = {
        Optional: {
          'key?': 'string',
        },
      };
      expect(convertToObject(typeStr)).toEqual(expected);
    });

    it('should handle array types', () => {
      const typeStr = `type ArrayType = {
      list: number[];
    };`;
      const expected = {
        ArrayType: {
          list: 'Array',
        },
      };
      expect(convertToObject(typeStr)).toEqual(expected);
    });

    it('should handle number type', () => {
        const typeStr = `type NumberType = {
        num: number;
      };`;
        const expected = {
          NumberType: {
            num: 'number',
          },
        };
        expect(convertToObject(typeStr)).toEqual(expected);
      });
  });

  describe('complex type test', () => {
    it('should convert for complex type test', () => {
        const typeStr = `type Button = {
            variant: "solid" | "text" | "outlined";
            disabled: boolean;
            size? : "small" | "medium" | "large";
            role: ["button" , "input"];
            onClick: () => void;
            classList: string[];
        };`;
      const expected = {
        Button: {
          variant: [ 'solid', 'text', 'outlined' ],
          disabled: 'boolean',
          'size?': [ 'small', 'medium', 'large' ],
          role: [ 'button', 'input' ],
          onClick: 'function',
          classList: 'Array'
        }
      };
      expect(convertToObject(typeStr)).toEqual(expected);
    });
  });
});
