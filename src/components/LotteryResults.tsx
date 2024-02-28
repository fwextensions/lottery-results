import { useLotteryResults } from "@/hooks/queries";
import { processLotteryBuckets } from "@/data/processLotteryBuckets";
import LotteryBuckets from "@/components/LotteryBuckets";
import Message from "@/components/Message";

const LongDate = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

type LotteryResultsProps = {
	listing?: Listing;
	combineGroups?: boolean;
}

export default function LotteryResults({
	listing,
	combineGroups }: LotteryResultsProps)
{
	const { data, error, isFetching, isError } = useLotteryResults(listing?.Id);

	if (isError) {
		return <Message message={error.message} />
	}

	if (!data || !listing) {
		if (isFetching) {
				// only show the loading message if we're fetching because we don't have
				// any data yet.  if there's cached data and the refetch is triggered,
				// we'll just show the cached data with no message.
			return <Message message="Loading..." />
		}

		return null;
	}

		// combine the Veteran and non-Veteran applicants into one bucket per
		// preference before passing it to the LotteryBuckets component
	const buckets = processLotteryBuckets(data.lotteryBuckets, combineGroups);
	const { Name, Building_Street_Address } = listing;
		// the date on the lottery_ranking response is the date of the lottery, while
		// Lottery_Results_Date is the date when they become official and are posted
		// as a PDF.  we want to include the former here.
	const lotteryDateString = LongDate.format(new Date(data.lotteryDate));

	return (
		<article>
			<header>
				<h1>
					Mayor's Office of Housing and Community Development
					<br />
					<img src="https://www.sf.gov/themes/custom/sfgovpl/logo.svg" alt="SF" className="seal" />
				</h1>
				<h2>
					{Name}
				</h2>
				<h3>
					{Building_Street_Address}
					<br />
					Lottery date: {lotteryDateString}
				</h3>
				<blockquote>
					<h4>Press <kbd>ctrl</kbd><kbd>F</kbd> and enter your lottery ticket
						number to find your rank</h4>
					<h5>* indicates a Veteran applicant</h5>
				</blockquote>
			</header>
			<LotteryBuckets buckets={buckets} />
		</article>
	);
}
