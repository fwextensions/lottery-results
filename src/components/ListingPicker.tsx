import Select, { CSSObjectWithLabel, SingleValue } from "react-select";
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
const widthStyle = (base: CSSObjectWithLabel) => ({
	...base,
	width: "30rem"
});

type ListingPickerProps = {
	onChange?: (listing: SingleValue<Listing>) => void;
}

export default function ListingPicker({
	onChange }: ListingPickerProps)
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
			onChange={onChange}
			styles={{
				control: widthStyle,
				menu: widthStyle,
			}}
		/>
	);
}
