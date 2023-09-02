export function onPromise<T>(promise: (...args: never) => Promise<T>) {
	return (...args: never) => {
		if (promise) {
			promise(...args).catch((error) => {
				console.log("Unexpected error", error);
			});
		}
	};
}
