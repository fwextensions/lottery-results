import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ListingPicker from "@/components/ListingPicker";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<main>
				<header>
					<h1>
						Mayor's Office of Housing and Community Development
						<br />
						<img src="https://www.sf.gov/themes/custom/sfgovpl/logo.svg" alt="SF" className="seal" />
					</h1>
					<h2 id="address"></h2>
					<blockquote>
						Press <kbd>ctrl</kbd><kbd>F</kbd> and enter your lottery ticket
						number
						to see results
					</blockquote>
					<h3>
						Preference Lists
					</h3>
				</header>
				<div id="lists">
					<div id="list-headers" className="row"></div>
					<div id="list-columns" className="row"></div>
				</div>
				<ListingPicker />
			</main>
		</QueryClientProvider>
	);
}
