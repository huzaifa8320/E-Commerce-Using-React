import { createContext, useState } from "react";

export const CartContext = createContext()

function CartContextProvider({ children }) {

    const [cartItems, setCartItems] = useState([])


    // Add item 
    function addItem(item) {
        const arr = cartItems
        const itemIndex = cartItems.findIndex((data) => data.id ==item.id)

        if (itemIndex == -1) {
            arr.push({
                ...item,
                quantity : 1
            })
        }
        else{
            arr[itemIndex].quantity++;
        }
    }

    // Remove item 
    function removeItem( id ) {
        const arr = cartItems
        const itemIndex = cartItems.findIndex((data) => data.id ==id)
        arr.slice( itemIndex , 1)
        setCartItems([...arr])
    }

    // Is item added
    function isItemAdded( id ) {
        const arr = cartItems
        const itemIndex = cartItems.findIndex((data) => data.id ==id)
       if (itemIndex == -1) {
        return null
       }
       else{
        arr[itemIndex]
       }
       setCartItems(...arr)
    }




    return (
        <CartContext.Provider value={{cartItems , addItem , removeItem , isItemAdded}}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContextProvider