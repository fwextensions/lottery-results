import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClientProvider } from "@tanstack/react-query";
import Favicon from "@/components/Favicon";
import { queryClient } from "@/hooks/queries";
import "../styles.css";

	// we have to create this component to wrap the main App so that we can include
	// global styles
export default function AppContainer({
	Component,
	pageProps }: AppProps)
{
	return (
		<>
			<Head>
				<title>Lottery Results</title>
			</Head>
			<Favicon />
			<QueryClientProvider client={queryClient}>
				<Component {...pageProps} />
			</QueryClientProvider>
		</>
	);
}
