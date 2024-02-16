import { useId } from "react";
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
	value?: Listing;
	onChange?: (listing: SingleValue<Listing>) => void;
}

export default function ListingPicker({
	value,
	onChange }: ListingPickerProps)
{
	const { isPending, isError, data, error } = useRentalListings();
		// we need to use this hook to get a stable, globally unique ID to use on
		// the react-select to avoid a hydration warning error with next.js.  ffs
	const selectID = useId();

	if (isError) {
		return <span>Error: {error.message}</span>;
	}

		// show just listings with complete lotteries, sorted descending by date
	const listings = isPending
		? []
		: data
			.filter(({ Lottery_Status }) => Lottery_Status.includes("Complete"))
			.sort(by("Lottery_Results_Date", true));

	return (
		<Select
			instanceId={selectID}
			value={value ?? null}
			options={listings}
			getOptionValue={getListingValue}
			getOptionLabel={getListingLabel}
			formatOptionLabel={formatListingLabel}
			isLoading={isPending}
			placeholder="Select a listing"
			onChange={onChange}
			styles={{
				control: widthStyle,
				menu: widthStyle,
			}}
		/>
	);
}
