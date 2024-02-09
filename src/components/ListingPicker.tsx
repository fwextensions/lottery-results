import { useQuery } from "@tanstack/react-query";

type Listing = {
	Id: string;
	Name: string;
	Lottery_Results_Date: string;
	Lottery_Status: string;
};
type ListingResponse = {
	listings: Listing[];
}

const ListingsURL = "https://proxy.cors.sh/https://housing.sfgov.org/api/v1/listings.json?type=rental&subset=browse";
//const ListingsURL = "https://housing.sfgov.org/api/v1/listings.json?type=rental&subset=browse";

async function fetchListings(): Promise<ListingResponse>
{
	const response = await fetch(ListingsURL, {
		mode: "cors",
		headers: {
			"x-cors-api-key": "temp_1b9093b3d82bb13f461b244c1f0d910e",
			"Accept": "application/json, text/plain, */*",
		}
	});

	if (!response.ok) {
		throw new Error("Bad response", { cause: response.statusText });
	}

	return response.json();
}

export default function ListingPicker()
{
	const { isPending, isError, data, error } = useQuery({
		queryKey: ["listings"],
		queryFn: fetchListings,
	});

	if (isPending) {
		return <span>Loading...</span>;
	}

	if (isError) {
		return <span>Error: {error.message}</span>;
	}

	return (
		<ul>
			{data?.listings.map((listing) => (
				<li key={listing.Id}>{listing.Name}</li>
			))}
		</ul>
	);
}
