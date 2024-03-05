import React, { useState } from "react";
import EasyEdit from "react-easy-edit";
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
	const [currentName, setCurrentName] = useState(name);
	const [currentAddress, setCurrentAddress] = useState(address);
	const [currentDate, setCurrentDate] = useState(date);

	return (
		<article>
			<header>
				<h1>
					Mayor's Office of Housing and Community Development
					<br />
					<img src="https://www.sf.gov/themes/custom/sfgovpl/logo.svg" alt="SF" className="seal" />
				</h1>
				<h2>
					<EasyEdit
						type="text"
						value={name}
						onSave={setCurrentName}
					/>
				</h2>
				<h3>
					<EasyEdit
						type="text"
						value={address}
						onSave={setCurrentAddress}
					/>
				</h3>
				<h3>
					Lottery date:
					{" "}
					<EasyEdit
						type="text"
						value={date}
						onSave={setCurrentDate}
					/>
				</h3>
				<blockquote>
					<h4>Press <kbd>ctrl</kbd><kbd>F</kbd> and enter your lottery ticket
						number to find your rank</h4>
					<h5>* indicates a US Military Veteran</h5>
				</blockquote>
			</header>
			<LotteryBuckets buckets={buckets} />
		</article>
	);
}
