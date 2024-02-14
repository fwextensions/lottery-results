type Listing = {
	Id: string;
	Name: string;
	Lottery_Results_Date: string;
	Lottery_Status:
		| "Not Yet Run"
		| "Lottery Complete"
		| "Pre Lottery Test Complete";
	Building_Name: string;
	Building_Street_Address: string;
};

type ListingsResponse = {
	listings: Listing[];
};

type ListingResponse = {
	listing: Listing;
};

type Applicant = {
	lotteryNumber: string;
	lotteryRank: number;
	applicationID: string;
}

type LotteryBucket = {
	preferenceName: string;
	preferenceResults: Applicant[];
}

type LotteryResponse = {
	lotteryBuckets: LotteryBucket[];
	lotteryDate: string;
	lotteryResultsURL: string;
	lotteryStatus: string;
}
