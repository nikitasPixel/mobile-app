import React, { useState } from "react";
import CartContext from "./CartContext";

const CartProvider = ({ children }) => {
	const [cart_items, setCartItems] = useState([]);

	return (
		<CartContext.Provider
			value={{ cart_items, setCartItems }}>
			{children}
		</CartContext.Provider>
	);
}

export default CartProvider;