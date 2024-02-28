import LotteryBuckets from "@/components/LotteryBuckets";

type LotteryResultsProps = {
	name?: string;
	address?: string;
	date?: string;
	buckets?: LotteryBucket[];
}

export default function LotteryResults({
	name,
	address,
	date,
	buckets }: LotteryResultsProps)
{
	return (
		<article>
			<header>
				<h1>
					Mayor's Office of Housing and Community Development
					<br />
					<img src="https://www.sf.gov/themes/custom/sfgovpl/logo.svg" alt="SF" className="seal" />
				</h1>
				<h2>
					{name}
				</h2>
				<h3>
					{address}
					<br />
					Lottery date: {date}
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
