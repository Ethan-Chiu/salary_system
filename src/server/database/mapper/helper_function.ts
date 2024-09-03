import { get_date_string, Round } from "~/server/service/helper_function";

export function convertDatePropertiesToISOString(obj: any): any {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] instanceof Date) {
            if (prop === "start_date" || prop === "end_date") {
                obj[prop] = get_date_string(obj[prop]);
            } else {
                obj[prop] = obj[prop].toISOString();
            }
        }
    }
    return obj;
}

export function deleteProperties(obj: any, props: string[]): any {
    for (const prop of props) {
        if (obj.hasOwnProperty(prop)) {
            delete obj[prop];
        }
    }
    return obj;
}

export function roundProperties(obj: any, decimal: number): any {
    for (const prop in obj["dataValues"]) {
        if (obj["dataValues"].hasOwnProperty(prop) && typeof obj["dataValues"][prop] === "number") {
            obj["dataValues"][prop] = Round(obj["dataValues"][prop], decimal);
        }
    }
    return obj;
}