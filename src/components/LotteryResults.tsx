import { useLotteryResults } from "@/hooks/queries";

const Message = ({ message }: { message: string }) => (
	<div style={{ fontWeight: "bold", padding: "4rem", textAlign: "center" }}>{message}</div>
);

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

	if (!data) {
		return null;
	}

	return (
		<article>
			<header>
				<h1>
					Mayor's Office of Housing and Community Development
					<br />
					<img src="https://www.sf.gov/themes/custom/sfgovpl/logo.svg" alt="SF" className="seal" />
				</h1>
				<h2 id="address"></h2>
				<blockquote>
					Press <kbd>ctrl</kbd><kbd>F</kbd> and enter your lottery ticket
					number to see results
				</blockquote>
				<h3>
					Preference Lists
				</h3>
			</header>
			<pre>
				{JSON.stringify(data, null, 2)}
			</pre>
		</article>
	);
}
