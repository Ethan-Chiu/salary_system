
export type Exact<T, Shape> =
	T extends Shape ? 
	Exclude<keyof T, keyof Shape> extends never ? 
	T : never : never;

export function isKeyOfExactType<Type extends {}, T>(keys: any, obj: Exact<T, Type>): keys is keyof Type {
	return keys in obj;
}