import { Preferences } from "@/utils/constants";
import { ReactElement } from "react";
import { by } from "@/utils";

type ColumnProps = {
	bucket: LotteryBucket;
	title?: string | ReactElement;
};

function Column({
	bucket,
	title = Preferences[bucket.preferenceName].id }: ColumnProps)
{
	const items = bucket.preferenceResults.map(({ lotteryNumber }) => (
		<li key={lotteryNumber}>{lotteryNumber}</li>
	));

	return (
		<div>
			<h4>{title}</h4>
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

	buckets.map(({ preferenceResults }) => preferenceResults).flat().forEach((applicant) => {
		applicants.set(applicant.lotteryNumber, applicant);
	});

	const applicantsByRank = [...applicants.values()].sort(by("lotteryRank"));

	return (
		<div className="row">
			<Column
				bucket={{
					preferenceResults: applicantsByRank,
					preferenceName: "Unfiltered"
				}}
				title={<>Unfiltered Rank<br/>Ticket #</>}
			/>
			{columns}
		</div>
	);
}
