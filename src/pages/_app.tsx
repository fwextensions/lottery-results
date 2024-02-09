import type { AppProps } from "next/app";
import "../styles.css";

	// we have to create this component to wrap the main App so that we can include
	// global styles
export default function AppContainer({
	Component,
	pageProps }: AppProps)
{
	return <Component {...pageProps} />;
}
