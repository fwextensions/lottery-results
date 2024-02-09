import { useRentalListings } from "@/hooks/queries";

export default function ListingPicker()
{
	const { isPending, isError, data, error } = useRentalListings();

	if (isPending) {
		return <span>Loading...</span>;
	}

	if (isError) {
		return <span>Error: {error.message}</span>;
	}

	const listings = data.listings.filter(({ Lottery_Status }) => Lottery_Status === "Lottery Complete");

	return (
		<ul>
			{listings.map((listing) => (
				<li key={listing.Id}>{listing.Name}</li>
			))}
		</ul>
	);
}
