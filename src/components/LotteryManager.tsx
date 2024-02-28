import LotteryResults from "@/components/LotteryResults";
import { useLotteryResults } from "@/hooks/queries";
import Message from "@/components/Message";
import { processLotteryBuckets } from "@/data/processLotteryBuckets";
import { processExcelData } from "@/data/processExcelData";

const LongDate = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

type LotteryManagerProps = {
	listing?: Listing;
	spreadsheetData?: ArrayBuffer;
	combineGroups?: boolean;
}

export default function LotteryManager({
	listing,
	spreadsheetData,
	combineGroups }: LotteryManagerProps)
{
	const { data, error, isFetching, isError } = useLotteryResults(listing?.Id);
	let name = "";
	let address = "";
	let date = "";
	let buckets;

	if (isError) {
		return <Message message={error.message} />
	}

	if ((!data || !listing) && !spreadsheetData) {
		if (isFetching) {
				// only show the loading message if we're fetching because we don't have
				// any data yet.  if there's cached data and the refetch is triggered,
				// we'll just show the cached data with no message.
			return <Message message="Loading..." />
		}

		return null;
	}

	if (spreadsheetData) {
		const { listing, results } = processExcelData(spreadsheetData);

		({ name, address, date } = listing);
		buckets = processLotteryBuckets(results.lotteryBuckets, combineGroups);
	} else if (data && listing) {
			// combine the Veteran and non-Veteran applicants into one bucket per
			// preference before passing it to the LotteryBuckets component
		buckets = processLotteryBuckets(data.lotteryBuckets, combineGroups);
		({ Name: name, Building_Street_Address: address } = listing);
			// the date on the lottery_ranking response is the date of the lottery, while
			// Lottery_Results_Date is the date when they become official and are posted
			// as a PDF.  we want to include the former here.
		date = LongDate.format(new Date(data.lotteryDate));
	}

	return (
		<LotteryResults
			name={name}
			address={address}
			date={date}
			buckets={buckets}
		/>
	);
}
