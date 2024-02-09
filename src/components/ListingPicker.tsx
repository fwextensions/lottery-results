import Select from "react-select";
import { useRentalListings } from "@/hooks/queries";
import { by } from "@/utils";

const ListingPickerLabel = ({ name, date }: { name: string, date: string }) => (
	<span>
		{name}
		<span style={{ color: "#aaa", paddingLeft: ".75rem" }}>
			({date})
		</span>
	</span>
);

const getListingLabel = (listing: Listing) => `${listing.Name} (${listing.Lottery_Results_Date})`;
const getListingValue = (listing: Listing) => listing.Id;
const formatListingLabel = (listing: Listing) => (
	<ListingPickerLabel name={listing.Name} date={listing.Lottery_Results_Date} />
);

export default function ListingPicker()
{
	const { isPending, isError, data, error } = useRentalListings();

	if (isError) {
		return <span>Error: {error.message}</span>;
	}

	const listings = isPending
		? []
		: data
			.filter(({ Lottery_Status }) => Lottery_Status === "Lottery Complete")
			.sort(by("Lottery_Results_Date", true));

	return (
		<Select
			options={listings}
			getOptionValue={getListingValue}
			getOptionLabel={getListingLabel}
			formatOptionLabel={formatListingLabel}
			isLoading={isPending}
		/>
	);
}
