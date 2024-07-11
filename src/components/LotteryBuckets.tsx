import { Preferences, Units100Pct, Units100PctRemaining, Units20Pct, Units40Pct, UnitsRemaining } from "@/utils/constants";
import { by } from "@/utils";
import { ReactElement, useState } from "react";
import EasyEdit from "react-easy-edit";

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
	buckets?: LotteryBucket[]
}

const EditableSubtitle = ({ type }: { type: string }) => {
  const [subtitleCOP, setSubtitleCOP] = useState(Units100Pct)
  const [subtitleDTHP, setSubtitleDTHP] = useState(Units20Pct)
  const [subtitleNRHP, setSubtitleNRHP] = useState(Units40Pct)
  const [subtitleLW, setSubtitleLW] = useState(Units100PctRemaining)
  const [subtitleGeneral, setSubtitleGeneral] = useState(UnitsRemaining)
  const [subtitleUnfiltered, setSubtitleUnfiltered] = useState("Ticket #")

  switch (type) {
    case "COP":
        return (
          <h5>
            <EasyEdit
              type="text"
              value={subtitleCOP}
              onSave={setSubtitleCOP}
            />
          </h5>
        )
    case "DTHP":
      return (
        <h5>
          <EasyEdit
            type="text"
            value={subtitleDTHP}
            onSave={setSubtitleDTHP}
          />
        </h5>
      )
    case "NRHP":
      return (
        <h5>
          <EasyEdit
            type="text"
            value={subtitleNRHP}
            onSave={setSubtitleNRHP}
          />
        </h5>
      )
    case "LW":
      return (
        <h5>
          <EasyEdit
            type="text"
            value={subtitleLW}
            onSave={setSubtitleLW}
          />
        </h5>
      )
    case "General List":
      return (
        <h5>
          <EasyEdit
            type="text"
            value={subtitleGeneral}
            onSave={setSubtitleGeneral}
          />
        </h5>
      )
    case "Unfiltered Rank":
      return (
        <h5>
          <EasyEdit
            type="text"
            value={subtitleUnfiltered}
            onSave={setSubtitleUnfiltered}
          />
        </h5>
      )
  }
}

export default function LotteryBuckets({
	buckets = [] }: LotteryBucketsProps)
{
	const applicants = new Map();

		// combine all the buckets into one list with every applicant appearing once
	buckets?.map(({ preferenceResults }) => preferenceResults).flat().forEach((applicant) => {
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
		const { id, shortName, subtitle } = Preferences[bucket.preferenceName];

		titleCells.push(
			<th key={id}>
				<h4>{shortName}</h4>
			</th>
		);
		subtitleCells.push(
			<td key={id}>
        <EditableSubtitle type={id} />
			</td>
		);
		resultCells.push(
			<td key={id}>
				<Column bucket={bucket} />
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
