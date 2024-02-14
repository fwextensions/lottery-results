import { useRouter } from "next/router";
import { useListing } from "@/hooks/queries";
import LotteryResults from "@/components/LotteryResults";

export default function LotteryResultsPage()
{
	const router = useRouter();
	const { args } = router.query;
	const { data } = useListing(args?.[0]);

	if (!data) {
		return null;
	}

	return (
		<main>
			<LotteryResults listing={data} />
		</main>
	);
}
