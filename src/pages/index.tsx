import { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";
import App from "@/components/App";

export default function RoutesContainer()
{
		// react-router-dom requires access to the document, so it can't run on the
		// server when next.js first renders the page.  so assume we're on the server
		// during the first render and return null in that case.
  const [isServer, setIsServer] = useState(true);

  useEffect(() => {
    setIsServer(false);
  }, []);

  if (isServer) {
		return null;
	}

		// we want to share the same element across all / routes
	const app = <App />;

	return (
		<Router>
			<Routes>
				<Route path="/:listingID" element={app} />
				<Route path="/" element={app} />
			</Routes>
		</Router>
	);
}
