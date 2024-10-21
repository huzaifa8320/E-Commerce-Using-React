import { createContext, useEffect, useState } from "react";
import { json } from "react-router";

export const CartContext = createContext()

function CartContextProvider({ children }) {

    const [cartItems, setCartItems] = useState([])
    const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false)


    // localStorage
    useEffect(() => {
        const localStorage_item = localStorage.getItem('cartItems');
        if (localStorage_item) {
            setCartItems([...JSON.parse(localStorage_item)]);
        }
        setIsLocalStorageLoaded(true);
    }, []);
    
    useEffect(() => {
        if (isLocalStorageLoaded) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems, isLocalStorageLoaded]);
    

    // Add item 
    function addItem(item) {
        const arr = cartItems
        const itemIndex = cartItems.findIndex((data) => data.id == item.id)

        if (itemIndex == -1) {
            arr.push({
                ...item,
                quantities: 1,
                fullFilled : 'pending'
            })
        }
        else {
            arr[itemIndex].quantities++;
        }
        setCartItems([...arr])
    }

    //    Item Minus 
    function item_minus(id) {
        const arr = cartItems
        const itemIndex = cartItems.findIndex((data) => data.id == id)
        arr[itemIndex].quantities--;
        setCartItems([...arr])
    }

    // Remove item 
    function removeItem(id) {
        const arr = cartItems
        const itemIndex = cartItems.findIndex((data) => data.id == id)
        arr.splice(itemIndex, 1)
        setCartItems([...arr])
    }

    // Is item added
    function isItemAdded(id) {
        const arr = cartItems
        const itemIndex = cartItems.findIndex((data) => data.id == id)
        if (itemIndex == -1) {
            return null
        }
        else {
            return arr[itemIndex]
        }
    }




    return (
        <CartContext.Provider value={{ cartItems, setCartItems, addItem, removeItem, isItemAdded, item_minus }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContextProvider