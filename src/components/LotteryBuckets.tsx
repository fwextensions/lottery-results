import { Preferences } from "@/utils/constants";
import { by } from "@/utils";

type ColumnProps = {
	bucket: LotteryBucket;
	title?: string;
	subtitle?: string;
};

function Column({
	bucket,
	title = Preferences[bucket.preferenceName].id,
	subtitle = Preferences[bucket.preferenceName].subtitle }: ColumnProps)
{
	const items = bucket.preferenceResults.map(({ lotteryNumber, hasVeteranPref }) => (
		<li key={lotteryNumber}>
			{lotteryNumber}{hasVeteranPref ? "*" : ""}
		</li>
	));

	return (
		<div>
			<h4>{title}</h4>
			<h5>{subtitle}</h5>
			<ol>
				{items}
			</ol>
		</div>
	);
}

type LotteryBucketsProps = {
	buckets: LotteryBucket[]
}

export default function LotteryBuckets({
	buckets }: LotteryBucketsProps)
{
	const columns = buckets.map((bucket) => (
		<Column key={bucket.preferenceName} bucket={bucket} />
	));
	const applicants = new Map();

		// combine all the buckets into one list with every applicant appearing once
	buckets.map(({ preferenceResults }) => preferenceResults).flat().forEach((applicant) => {
		applicants.set(applicant.lotteryNumber, applicant);
	});

		// create the rank-ordered list of applicants
	const applicantsByRank = [...applicants.values()].sort(by("lotteryRank"));

	return (
		<div className="row">
			<Column
				bucket={{
					preferenceResults: applicantsByRank,
					preferenceName: "Unfiltered"
				}}
				title="Unfiltered Rank"
				subtitle="Ticket #"
			/>
			{columns}
		</div>
	);
}
