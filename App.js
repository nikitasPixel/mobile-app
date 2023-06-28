import React from "react";

import Router from "./components/Router";

import AuthProvider from "./context/AuthProvider";
import CartProvider from "./context/CartProvider";
import ActiveBakerProvider from "./context/ActiveBakerProvider";
import CategoryProvider from "./context/CategoryProvider";

const App = () => {

	return (
		<AuthProvider>
			<ActiveBakerProvider>
				<CartProvider>
					<CategoryProvider>
						<Router />
					</CategoryProvider>
				</CartProvider>
			</ActiveBakerProvider>
		</AuthProvider>
	);
}

export default App;