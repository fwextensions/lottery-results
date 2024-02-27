import { useEffect, useState } from "react";
import Head from "next/head";
import { useNavigate, useParams } from "react-router-dom";
import { SingleValue } from "react-select";
import ListingPicker from "@/components/ListingPicker";
import LotteryResults from "@/components/LotteryResults";
import { useListing } from "@/hooks/queries";
import DropTarget from "@/components/DropTarget";
import type { DragEvent } from "react";
import { processExcelData } from "@/data/processExcelData";

export default function App()
{
		// somewhat awkwardly, we have two sources for the current listing: the
		// listing selected in the menu and the one specified by listing ID in the
		// URL.  one sets the other, depending on which is set first.
	const [menuListing, setMenuListing] = useState<Listing | undefined>();
	const [combineGroups, setCombineGroups] = useState(true);
	const [showDropTarget, setShowDropTarget] = useState(false);
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

			processExcelData(data);
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
				<LotteryResults
					listing={listing}
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
