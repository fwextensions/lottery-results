import {
	DefaultError,
	QueryClient,
	QueryKey,
	useQuery
} from "@tanstack/react-query";

const APIBaseURL = "/dahlia/";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: callAPI,
		},
	},
});

export async function callAPI<T>({
	queryKey }: { queryKey: QueryKey }): Promise<T>
{
	const response = await fetch(APIBaseURL + queryKey);

	if (!response?.ok) {
		throw new Error("Bad response", { cause: response.statusText });
	}

	return response.json();
}

export function useRentalListings()
{
		// we have to pass in the original response type and just the bare Listing
		// array type to make TS happy, since we're returning just the array
	return useQuery<ListingResponse, DefaultError, Listing[]>({
		queryKey: ["listings.json?type=rental&subset=browse"],
		select: ({ listings }) => listings
	});
}

export function useLotteryResults(
	listingID?: string)
{
	return useQuery<LotteryResponse>({
		queryKey: [`listings/${listingID}/lottery_ranking?lottery_number=`],
		enabled: Boolean(listingID),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
}
