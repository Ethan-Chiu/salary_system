import { Round } from "~/server/service/helper_function";

export function deleteProperties<T extends object>(obj: T, props: string[]): T {
    for (const prop of props) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        delete obj[prop as keyof T];
      }
    }
    return obj;
}

export function roundProperties<T extends object>(obj: T, decimal: number): T {
    const dataValueObj = obj["dataValues" as keyof T] as T ?? obj;
    for (const prop in dataValueObj) {
        if (Object.prototype.hasOwnProperty.call(dataValueObj, prop) && typeof dataValueObj[prop] === "number") {
            (dataValueObj[prop] as unknown) = Round(dataValueObj[prop] as number, decimal);
        }
    }
    return obj;
}
