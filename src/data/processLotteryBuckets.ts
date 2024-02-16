import { Preferences } from "@/utils/constants";

export function processLotteryBuckets(
	buckets: LotteryBucket[])
{
		// we have to make a copy of the array because we mutate it in the loop below
	const bucketsQueue = [...buckets];
	const processed: LotteryBucket[] = [];

	bucketsQueue.forEach((bucket, index) => {
		const bucketInfo = Preferences[bucket.preferenceName];

		if (bucketInfo.isVeteran) {
				// mark all the applicants in this bucket as having the Veteran preference
			const veteranApplicants = bucket.preferenceResults.map((applicant) => ({ ...applicant, hasVeteranPref: true }));
				// we assume the list is always ordered by the Veteran preference and then
				// the related non-Veteran preference
			const relatedBucket = bucketsQueue[index + 1];
				// remove all the Veteran applicants from the related bucket
			const nonVeteranApplicants = relatedBucket.preferenceResults
				.filter(({ lotteryNumber }) => veteranApplicants.every((applicant) => applicant.lotteryNumber !== lotteryNumber));
			const combinedApplicants = [...veteranApplicants, ...nonVeteranApplicants];

				// remove the related bucket from the list so we skip it, since we just
				// processed it
			bucketsQueue.splice(index + 1, 1);

				// add the combined list of Veteran and non-Veteran applicants to the
				// non-Veteran bucket and return that bucket.  we discard the Veteran
				// bucket.
			relatedBucket.preferenceResults = combinedApplicants;
			processed.push(relatedBucket)
		} else {
			processed.push(bucket);
		}
	});

	return processed;
}
