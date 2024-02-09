export function by(
	iteratee: any,
	descending = false)
{
	const order = descending ? -1 : 1;

	return (
		a: any,
		b: any) => {
		const keyA = typeof iteratee === "function" ? iteratee(a) : a[iteratee];
		const keyB = typeof iteratee === "function" ? iteratee(b) : b[iteratee];
		let result;

		if (typeof keyA === "string" && typeof keyB === "string") {
			const valueA = keyA.toUpperCase();
			const valueB = keyB.toUpperCase();

			if (valueA < valueB) {
				result = -1;
			} else if (valueA > valueB) {
				result = 1;
			} else {
				result = 0;
			}
		} else {
			result = keyA - keyB;
		}

		return result * order;
	};
}
