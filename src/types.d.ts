type Listing = {
	Id: string;
	Name: string;
	Lottery_Results_Date: string;
	Lottery_Status: "Not Yet Run" | "Lottery Complete";
	Building_Name: string;
	Building_Street_Address: string;
};

type ListingResponse = {
	listings: Listing[];
};
