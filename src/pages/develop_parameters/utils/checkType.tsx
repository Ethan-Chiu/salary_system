export const isNumber = (parameter: any) => (Object.prototype.toString.call(parameter) === "[object Number]")
export const isString = (parameter: any) => (Object.prototype.toString.call(parameter) === "[object String]")
export const isDate = (parameter: any) => (Object.prototype.toString.call(parameter) === "[object Date]")