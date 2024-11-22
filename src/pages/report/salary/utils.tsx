import { z } from "zod";
export interface keyDict {
	[key: string]: string[];
}

export function getExcelData(Alldatas: any[]) {
    const excelData: any[] = [];
    Alldatas.map((sheetDatas: {name: string; data: any[]}) => {
        const name: string = sheetDatas.name;
        try {
            const datas = sheetDatas.data;
            const columns = Object.keys(datas[0]).map(
                (key: string) =>
                    // Translate(key)
                    key
            );
            const rows = datas.map((data: any, index: number) => {
                return Object.keys(data).map((key: string) => {
                    return data[key];
                });
            });
            rows.unshift(columns);
            excelData.push({ sheetName: name, data: rows });
        } catch (e) {
            excelData.push({
                sheetName: name,
                data: null,
            });
        }
    });
    return excelData;
}


export function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
    return Object.fromEntries(
        Object.entries(schema.shape as Record<string, any>).map(
            ([key, value]) => {
                if (value instanceof z.ZodDefault)
                    return [key, value._def.defaultValue()];
                return [key, undefined];
            }
        )
    );
}