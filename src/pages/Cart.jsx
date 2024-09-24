import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { faL, faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Cart() {
   const { cartItems, removeItem, addItem, item_minus } = useContext(CartContext)
   const total_Ammount = cartItems.reduce((total, obj) => total + obj.quantities * obj.price, 0)
   const total_Quantities = cartItems.reduce((total, obj) => total + obj.quantities, 0)
   const [showPop, setShowPop] = useState(false);

   // const [showPop, setShowPop] = useState(false)

   return (
      <div className="sm:mx-10 m-4">
         {/* PlaceOrder */}
         {showPop &&
            <div className="z-10 w-full flex justify-center items-center fixed top-0 right-0 h-screen bg-[#00000015]">
               <div className="bg-purple-700 max-[400px]:w-full max-[400px]:h-screen shadow-2xl px-8 rounded-lg w-[420px] h-[500px] text-white">
                  <div className="flex relative">
                     <button onClick={() => setShowPop(false)} className="text-3xl absolute borde text-center font-semibold my-6"><FontAwesomeIcon icon={faXmark} className="text-xl" /></button>
                     <h1 className="text-3xl text-center font-bold mt-6 mb-3 mx-auto">Orders</h1>
                  </div>
                  <div className="bg-[#F3F1F5] my-5 rounded-lg h-10 ps-3 flex items-center">
                        <input type="text" autoComplete="email" placeholder="Name" className="text-[#00000095] bg-transparent outline-none font-semibold  w-full placeholder:text-[#00000095]" />
                    </div>
                  <div className="bg-[#F3F1F5] my-5 rounded-lg h-10 ps-3 flex items-center">
                        <input type="email" autoComplete="email" placeholder="Email" className="text-[#00000095] bg-transparent outline-none font-semibold  w-full placeholder:text-[#00000095]" />
                    </div>
                    <textarea name="" id="" className="w-full h-52 p-3 outline-none placeholder:text-[#00000095] text-[#00000095] font-semibold" placeholder="Address"></textarea>
                    <button className="bg-white text-[#6D28D9] font-semibold p-2 rounded-lg w-20 mx-auto block my-3">Save</button>
               </div>
            </div>
         }
         <h1 className="text-center text-4xl my-8 py-4 font-semibold bg-[#6D28D9] text-white">Cart Details</h1>
         
         {cartItems.length > 0 && <div className="flex">
            <div>
               <h1 className="font-semibold">Total Price: ${Math.floor(total_Ammount)}</h1>
               <h1 className="font-semibold">Total Quantity: {total_Quantities}</h1>
            </div>
            <button className="ms-auto bg-[#6D28D9] p-3 rounded-lg text-white font-semibold" onClick={() => setShowPop(true)}>Place Order</button>
         </div>}
         {cartItems.length > 0?
            cartItems.map((data) =>
               <div key={data.id} className="sm:flex my-4 h-auto border">
                  <div className="border-r flex min-w-36 justify-center">
                     <img src={data.thumbnail} alt="" className="h-[180px] max-w-36 my-auto" />
                  </div>
                  <div className="ps-2 py-3 w-full">
                     <p className="font-semibold text-2xl">{data.title}</p>
                     <p className="my-3">{data.description}</p>
                     <p className=""><span className="font-semibold">Price:</span> ${data.price}</p>
                     <div className="flex relative items-center gap-2 my-3">
                        <button disabled={data.quantities === 1} onClick={() => item_minus(data.id)}><FontAwesomeIcon icon={faMinus} className="bg-blue-400 cursor-pointer w-4 p-1 h-4 text-white rounded-full" /></button>
                        <span className="font-semibold text-xl">{data.quantities}</span>
                        <button onClick={() => addItem(data)}><FontAwesomeIcon icon={faPlus} className="bg-red-600 cursor-pointer w-4 p-1 h-4 text-white rounded-full" /></button>
                        <button onClick={() => removeItem(data.id)} className="absolute right-3 bg-red-600 text-white font-semibold p-2 rounded-lg">Remove Item</button>
                     </div>
                  </div>
               </div>
            ): <div className="flex justify-center items-center h-52 text-4xl font-semibold">No items ☹</div>
         }
      </div>

   )
}

export default Cart