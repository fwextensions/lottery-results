import { useLotteryResults } from "@/hooks/queries";
import { processLotteryBuckets } from "@/data/processLotteryBuckets";
import LotteryBuckets from "@/components/LotteryBuckets";
import Message from "@/components/Message";

type LotteryResultsProps = {
	listing?: Listing;
}

export default function LotteryResults({
	listing }: LotteryResultsProps)
{
	const { data, error, isFetching, isError } = useLotteryResults(listing?.Id);

	if (isError) {
		return <Message message={error.message} />
	}

	if (isFetching) {
		return <Message message="Loading..." />
	}

	if (!data || !listing) {
		return null;
	}

		// combine the Veteran and non-Veteran applicants into one bucket per
		// preference before passing it to the LotteryBuckets component
	const buckets = processLotteryBuckets(data.lotteryBuckets);
	const { Name, Building_Street_Address, Lottery_Results_Date } = listing;

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
					<br />
					{Building_Street_Address}
					<br />
					{Lottery_Results_Date}
				</h2>
				<blockquote>
					Press <kbd>ctrl</kbd><kbd>F</kbd> and enter your lottery ticket
					number to see results
				</blockquote>
				<h3>
					Preference Lists
				</h3>
				<aside>
					* = Veteran
				</aside>
			</header>
			<LotteryBuckets buckets={buckets} />
		</article>
	);
}
