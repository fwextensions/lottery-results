type Listing = {
	Id: string;
	Name: string;
	Lottery_Results_Date: string;
	Lottery_Status: "Not Yet Run" | "Lottery Complete";
};
type ListingResponse = {
	listings: Listing[];
};
