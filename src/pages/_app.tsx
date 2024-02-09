import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { callAPI } from "@/hooks/queries";
import "../styles.css";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: callAPI,
		},
	},
});

	// we have to create this component to wrap the main App so that we can include
	// global styles
export default function AppContainer({
	Component,
	pageProps }: AppProps)
{
	return (
		<QueryClientProvider client={queryClient}>
			<Component {...pageProps} />
		</QueryClientProvider>
	);
}
