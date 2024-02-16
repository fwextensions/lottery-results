import { useEffect, useState } from "react";
import Head from "next/head";
import { useNavigate, useParams } from "react-router-dom";
import { SingleValue } from "react-select";
import ListingPicker from "@/components/ListingPicker";
import LotteryResults from "@/components/LotteryResults";
import { useListing } from "@/hooks/queries";

export default function App()
{
		// somewhat awkwardly, we have two sources for the current listing: the
		// listing selected in the menu and the one specified by listing ID in the
		// URL.  one sets the other, depending on which is set first.
	const [menuListing, setMenuListing] = useState<Listing | undefined>();
	const { listingID } = useParams();
	const navigate = useNavigate();
	const { data: listing } = useListing(listingID, menuListing);
	const title = menuListing ? `Lottery Results - ${menuListing.Name}` : "";

	useEffect(() => {
		if (listing?.Id !== menuListing?.Id) {
				// if we get here, it's probably because we were loaded from a URL that
				// contained a listing and the menu defaults to nothing being selected
			setMenuListing(listing);
		}
	}, [listing]);

	const handleMenuChange = (changedListing: SingleValue<Listing>) => {
		setMenuListing(changedListing ?? undefined);

		if (changedListing) {
				// set the URL to the new listing's ID so the user can navigate back and
				// forth between listings and share a direct link to a listing
			navigate("/" + changedListing.Id);
		}
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
					<ListingPicker
						value={listing}
						onChange={handleMenuChange}
					/>
				</header>
				<LotteryResults
					listing={listing}
				/>
			</main>
		</>
	);
}
