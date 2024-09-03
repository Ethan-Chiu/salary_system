import { get_date_string } from "~/server/service/helper_function";

export function convertDatePropertiesToISOString<T extends object>(obj: T): T {
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop) && obj[prop] instanceof Date) {
            if (prop === "start_date" || prop === "end_date") {
                (obj[prop] as unknown) = get_date_string(obj[prop as keyof T]);
            } else {
                (obj[prop] as unknown) = (obj[prop as keyof T] as Date).toISOString();
            }
        }
    }
    return obj;
}

export function deleteProperties<T extends object>(obj: T, props: string[]): T {
    for (const prop of props) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        delete obj[prop as keyof T];
      }
    }
    return obj;
}
