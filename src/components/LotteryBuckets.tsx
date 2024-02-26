import { Preferences } from "@/utils/constants";
import { by } from "@/utils";
import { ReactElement } from "react";

const ColumnMaxWidth = 20; // in ch units

type ColumnProps = {
	bucket: LotteryBucket;
};

function Column({
	bucket }: ColumnProps)
{
	const items = bucket.preferenceResults.map(({ lotteryNumber, hasVeteranPref }) => (
		<li key={lotteryNumber}>
			{lotteryNumber}{hasVeteranPref ? "*" : ""}
		</li>
	));

	return (
		<ol>
			{items}
		</ol>
	);
}

type LotteryBucketsProps = {
	buckets: LotteryBucket[]
}

export default function LotteryBuckets({
	buckets }: LotteryBucketsProps)
{
	const applicants = new Map();

		// combine all the buckets into one list with every applicant appearing once
	buckets.map(({ preferenceResults }) => preferenceResults).flat().forEach((applicant) => {
		applicants.set(applicant.lotteryNumber, applicant);
	});

		// create a bucket with a rank-ordered list of applicants
	const unfilteredBucket = {
		preferenceName: "Unfiltered",
		preferenceResults: [...applicants.values()].sort(by("lotteryRank")),
	};
		// put the bucket of unfiltered applicants first
	const combinedBuckets = [unfilteredBucket, ...buckets];
	const maxWidth = `${combinedBuckets.length * ColumnMaxWidth}ch`;
	const titleCells: ReactElement[] = [];
	const subtitleCells: ReactElement[] = [];
	const resultCells: ReactElement[] = [];

	combinedBuckets.forEach((bucket) => {
		const { id, subtitle } = Preferences[bucket.preferenceName];

		titleCells.push(
			<th>
				<h4 key={id}>{id}</h4>
			</th>
		);
		subtitleCells.push(
			<td>
				<h5 key={id}>{subtitle}</h5>
			</td>
		);
		resultCells.push(
			<td>
				<Column key={id} bucket={bucket} />
			</td>
		);
	});

		// to allow the table to expand, up to a point, when there's more room, we
		// have to put it inside a section that has a max-width set on it, based on
		// the number of columns.  we can't calculate that in CSS, unfortunately.
	return (
		<section style={{ maxWidth }}>
			<table>
				<thead>
					<tr className="row">
						{titleCells}
					</tr>
				</thead>
				<tbody>
					<tr className="row">
						{subtitleCells}
					</tr>
					<tr className="row">
						{resultCells}
					</tr>
				</tbody>
			</table>
		</section>
	);
}
