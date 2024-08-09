export function convertDatePropertiesToISOString(obj: any): any {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] instanceof Date) {
            obj[prop] = obj[prop].toISOString();
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