import { useState } from "react";
import { SingleValue } from "react-select";
import ListingPicker from "@/components/ListingPicker";
import LotteryResults from "@/components/LotteryResults";

export default function App()
{
	const [currentListing, setCurrentListing] = useState<Listing | undefined>();

	const handleListingChange = (listing: SingleValue<Listing>) => {
		setCurrentListing(listing ?? undefined);
	}

	return (
		<main>
			<header>
				<ListingPicker onChange={handleListingChange} />
			</header>
			<LotteryResults listing={currentListing} />
		</main>
	);
}
