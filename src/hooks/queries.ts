import { QueryKey, useQuery } from "@tanstack/react-query";

const APIBaseURL = "https://proxy.cors.sh/https://housing.sfgov.org/api/v1/";

export async function callAPI<T>({
	queryKey }: { queryKey: QueryKey }): Promise<T>
{
	const response = await fetch(APIBaseURL + queryKey, {
		mode: "cors",
		headers: {
			"x-cors-api-key": "temp_1b9093b3d82bb13f461b244c1f0d910e",
			"Accept": "application/json, text/plain, */*",
		}
	});

	if (!response?.ok) {
		throw new Error("Bad response", { cause: response.statusText });
	}

	return response.json();
}

export function useRentalListings()
{
	return useQuery<ListingResponse>({
		queryKey: ["listings.json?type=rental&subset=browse"],
	});
}
