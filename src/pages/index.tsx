import { useState } from "react";
import { SingleValue } from "react-select";
import Head from "next/head";
import ListingPicker from "@/components/ListingPicker";
import LotteryResults from "@/components/LotteryResults";

export default function App()
{
	const [currentListing, setCurrentListing] = useState<Listing | undefined>();
	const title = currentListing ? `Lottery Results - ${currentListing.Name}` : "";

	const handleListingChange = (listing: SingleValue<Listing>) => {
		setCurrentListing(listing ?? undefined);
	}

	return (
		<>
			{title &&
				<Head>
					<title>{title}</title>
				</Head>
			}
			<main>
				<header className="toolbar">
					<ListingPicker onChange={handleListingChange} />
				</header>
				<LotteryResults listing={currentListing} />
			</main>
		</>
	);
}
