import { convertToObject } from './typeConverter';

describe('convertToObject type test', () => {
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
      variant: "a" | 100 | false;
    };`;
      const expected = {
        Union: {
          variant: ['a', 100, false],
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
            result: true | 1;
            onClick: () => void;
            classList: string[];
        };`;
      const expected = {
        Button: {
          variant: ['solid', 'text', 'outlined'],
          disabled: 'boolean',
          'size?': ['small', 'medium', 'large'],
          role: ['button', 'input'],
          result: [true, 1],
          onClick: 'function',
          classList: 'Array',
        },
      };
      expect(convertToObject(typeStr)).toEqual(expected);
    });
  });
});

describe('convertToObject interface test', () => {
  describe('basic interface test', () => {
    it('should convert a simple interface', () => {
      const typeStr = `interface Simple {
      flag: boolean;
    };`;
      const expected = {
        Simple: {
          flag: 'boolean',
        },
      };
      expect(convertToObject(typeStr)).toEqual(expected);
    });

    it('should handle union types in interface', () => {
      const typeStr = `interface Union {
        variant: "a" | 100 | false;
      };`;
      const expected = {
        Union: {
          variant: ['a', 100, false],
        },
      };
      expect(convertToObject(typeStr)).toEqual(expected);
    });

    it('should handle optional properties', () => {
      const typeStr = `interface Optional {
      key?: string;
    };`;
      const expected = {
        Optional: {
          'key?': 'string',
        },
      };
      expect(convertToObject(typeStr)).toEqual(expected);
    });

    it('should handle array types in interface', () => {
      const typeStr = `interface ArrayType {
      list: number[];
    };`;
      const expected = {
        ArrayType: {
          list: 'Array',
        },
      };
      expect(convertToObject(typeStr)).toEqual(expected);
    });

    it('should handle number type in interface', () => {
      const typeStr = `interface NumberType {
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

  describe('complex interface test', () => {
    it('should convert for complex interface test', () => {
      const buttonInterfaceStr = `interface Button {
            variant: "solid" | "text" | "outlined";
            disabled: boolean;
            size? : "small" | "medium" | "large";
            role: ["button" , "input"];
            result: true | 1
            onClick: () => void;
            classList: string[];
        };`;
      const expected = {
        Button: {
          variant: ['solid', 'text', 'outlined'],
          disabled: 'boolean',
          'size?': ['small', 'medium', 'large'],
          role: ['button', 'input'],
          result: [true, 1],
          onClick: 'function',
          classList: 'Array',
        },
      };
      expect(convertToObject(buttonInterfaceStr)).toEqual(expected);
    });
  });
});

describe('parse invalid input test', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should return null for incomplete interface define', () => {
    // invalid interface input, should have ']', should have the close of curly braces
    const buttonInterfaceStr = `interface Button {
          variant: "solid" | "text" | "outlined";
          disabled: boolean;
          size? : "small" | "medium" | "large";
          role: ["button" ;`;
    const result = convertToObject(buttonInterfaceStr);
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain('Syntax error in input');
    expect(result).toBe(null);
  });

  it('should return null for incomplete type define', () => {
    // invalid interface input, should have the close of curly braces
    const buttonInterfaceStr = `type Button = {
          variant: "solid" | "te`;
    const result = convertToObject(buttonInterfaceStr);
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain('Syntax error in input');
    expect(result).toBe(null);
  });
})