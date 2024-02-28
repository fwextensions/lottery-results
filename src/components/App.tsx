import { useEffect, useState } from "react";
import Head from "next/head";
import { useNavigate, useParams } from "react-router-dom";
import { SingleValue } from "react-select";
import ListingPicker from "@/components/ListingPicker";
import LotteryManager from "@/components/LotteryManager";
import DropTarget from "@/components/DropTarget";
import { useListing } from "@/hooks/queries";

import type { DragEvent } from "react";

export default function App()
{
		// somewhat awkwardly, we have two sources for the current listing: the
		// listing selected in the menu and the one specified by listing ID in the
		// URL.  one sets the other, depending on which is set first.
	const [menuListing, setMenuListing] = useState<Listing | undefined>();
	const [combineGroups, setCombineGroups] = useState(true);
	const [showDropTarget, setShowDropTarget] = useState(false);
	const [spreadsheetData, setSpreadsheetData] = useState<ArrayBuffer | undefined>();
	const { listingID } = useParams();
	const navigate = useNavigate();
	const { data: listing } = useListing(listingID, menuListing);
	const title = menuListing ? `Lottery Results - ${menuListing.Name}` : "";

	useEffect(() => {
		if (listing?.Id !== menuListing?.Id) {
				// if we get here, it's probably because we were loaded from a URL that
				// contained a listing and the menu defaults to nothing being selected
			setMenuListing(listing);
			setSpreadsheetData(undefined)
		}
	}, [listing]);

	const handleMenuChange = (changedListing: SingleValue<Listing>) => {
			// when the menu changes, we also want to clear any existing spreadsheet data
		setMenuListing(changedListing ?? undefined);
		setSpreadsheetData(undefined)

		if (changedListing) {
				// set the URL to the new listing's ID so the user can navigate back and
				// forth between listings and share a direct link to a listing
			navigate("/" + changedListing.Id);
		}
	};

	const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
			// don't show the drop target if the user is not dragging a file
		if (event.dataTransfer.types.includes("Files")) {
			setShowDropTarget(true);
		}
	};

	const handleDragLeave = () => setShowDropTarget(false);

	const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation()
		setShowDropTarget(false);

		if (event.dataTransfer.types.includes("Files")) {
			const [file] = event.dataTransfer.files;
			const data = await file.arrayBuffer();

				// set the URL back to root to clear any existing listing ID, since we're
				// replacing the results with the dropped file
			navigate("/");
			setSpreadsheetData(data);
		}
	};

	return (
		<>
			{title &&
				<Head>
					<title>{title}</title>
				</Head>
			}
			<main
				onDragEnter={handleDragEnter}
				onDrop={handleDrop}
			>
				<header className="toolbar">
					<ListingPicker
						value={listing}
						onChange={handleMenuChange}
					/>
					<label htmlFor="combine-groups">
						<input
							id="combine-groups"
							type="checkbox"
							checked={combineGroups}
							onChange={(event) => setCombineGroups(event.target.checked)}
						/>
						Combine groups
					</label>
				</header>
				<LotteryManager
					listing={listing}
					spreadsheetData={spreadsheetData}
					combineGroups={combineGroups}
				/>
			</main>
			{showDropTarget &&
				<DropTarget
					onDrop={handleDrop}
					onLeave={handleDragLeave}
				/>
			}
		</>
	);
}
