import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { faAnglesLeft, faCaretRight, faCircleCheck, faCircleExclamation, faL, faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../context/UserContext";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { Image } from "antd";

function Cart() {
   const { cartItems, setCartItems, removeItem, addItem, item_minus } = useContext(CartContext)
   const total_Ammount = cartItems.reduce((total, obj) => total + obj.quantities * obj.price, 0)
   const total_Quantities = cartItems.reduce((total, obj) => total + obj.quantities, 0)
   const [showPop, setShowPop] = useState(false);
   const [details_Name, setDetails_Name] = useState('');
   const [details_Email, setDetails_Email] = useState('');
   const [details_Address, setDetails_Address] = useState('');
   const [error_Alert_Text, setError_Alert_Text] = useState("")
   const [text_success_alert, setText_Success_Alert] = useState("")
   const { user, setUser } = useContext(UserContext)
   const [save_Order, setSave_Order] = useState(false)

   const navigate = useNavigate()
   useEffect(() => {
      if (user?.userInfo?.email) {
         setDetails_Email(user.userInfo.email);
      }
   }, [user]);

   // Place Order
   const send_details = async () => {
      if (!details_Name) {
         setError_Alert_Text('Please Enter Name')
      }
      else if (!user?.userInfo?.email) {
         setError_Alert_Text('Please Enter Email')
      }
      else if (!details_Address) {
         setError_Alert_Text('Please Enter Address')
      }
      else {

         // Prepare cart details
         let cartDetails = {
            name: details_Name,
            email: details_Email,
            address: details_Address,
            createdAt: serverTimestamp(),
            item: cartItems,
            totalAmount: total_Ammount,
            order_user: user.userInfo.uid,
            status: 'Pending'
         };

         try {
            setSave_Order(true)
            // Create a reference to the 'orders' collection
            const ordersCollectionRef = collection(db, "Orders");

            // Add the cart details as a new document in the collection
            await addDoc(ordersCollectionRef, cartDetails);

            setText_Success_Alert('Order Created Successfully ✅');
            localStorage.removeItem('cartItems');
            setSave_Order(false)
            setShowPop(false);
            setCartItems([]);
            navigate('/my_orders')
         } catch (error) {
            console.error('Error adding document: ', error);
            setSave_Order(false)
         }
      }

      setTimeout(() => {
         setError_Alert_Text('')
         setText_Success_Alert('')
      }, 3000);
   }
   // Place Order end


   const closeAlert = () => {
      setError_Alert_Text('')
      setText_Success_Alert('')
   }

   const closePopUp = () => {
      setDetails_Name('')
      setDetails_Email('')
      setDetails_Address('')
      setShowPop(false)
   }


   const redirect_to_login = () => {
      setError_Alert_Text('Please Login First')
      setTimeout(() => {
         navigate('/login')
      }, 2000);
   }

   return (
      <div className="sm:mx-10 m-4">
         {user.isLogin ?
            <Link to={'/my_orders'} className="fixed bottom-0 text-xl font-semibold bg-[#6D28D9] text-white p-2 rounded-lg flex justify-center items-center right-0 m-1 z-10">
               Orders 📦
            </Link>
            :
            <button
               onClick={redirect_to_login}
               className="fixed bottom-0 shine-box text-xl font-semibold bg-[#6D28D9] text-white p-2 rounded-lg flex justify-center items-center right-0 m-1 z-10"
            >
               Orders 📦
            </button>

         }
         {/* Alert Error  */}
         {error_Alert_Text &&
            <div className="z-20 cursor-pointer alert shadow-2xl p-3 rounded-lg bg-[#FEDA9E] border-l-8 border-[#FEA601] show fixed right-3 top-5">
               <span className="text-[#DA7F0B]"><FontAwesomeIcon icon={faCircleExclamation} /></span>
               <span className="px-3 msg text-[#BE9049] font-semibold">{error_Alert_Text}</span>
               <span onClick={closeAlert} className="text-[#DA7F0B]"><FontAwesomeIcon icon={faXmark} /></span>
            </div>

         }

         {/* Changes alert  */}
         {text_success_alert &&
            <div className="z-20 cursor-pointer alert shadow-2xl p-3 rounded-lg bg-[#C5F3D7] border-l-8 border-green-400 show fixed right-3 top-5">
               <span className="text-green-600"><FontAwesomeIcon icon={faCircleCheck} /></span>
               <span className="px-3 msg text-green-600 font-semibold">{text_success_alert}</span>
               <span onClick={closeAlert} className="text-green-600"><FontAwesomeIcon icon={faXmark} /></span>
            </div>

         }

         {/* PlaceOrder */}
         {showPop &&
            <div className="z-10 w-full flex justify-center items-center fixed top-0 right-0 h-screen bg-[#00000015]">
               <div className="bg-purple-700 max-[400px]:w-full max-[400px]:h-screen shadow-2xl px-8 rounded-lg w-[420px] h-[500px] text-white">
                  <div className="flex relative">
                     <button onClick={closePopUp} className="text-3xl absolute borde text-center font-semibold my-6"><FontAwesomeIcon icon={faXmark} className="text-xl" /></button>
                     <h1 className="text-3xl text-center font-bold mt-6 mb-3 mx-auto">Orders</h1>
                  </div>
                  <div className="bg-[#F3F1F5] my-5 rounded-lg h-10 ps-3 flex items-center">
                     <input onChange={(e) => setDetails_Name(e.target.value)} type="text" autoComplete="name" placeholder="Name" className="text-[#00000095] bg-transparent outline-none font-semibold  w-full placeholder:text-[#00000095]" />
                  </div>
                  <div className="bg-[#F3F1F5] my-5 rounded-lg h-10 ps-3 flex items-center">
                     <input onChange={(e) => setDetails_Email(e.target.value)} defaultValue={user?.userInfo?.email || ''} type="email" autoComplete="email" placeholder="Email" className="text-[#00000095] bg-transparent outline-none font-semibold  w-full placeholder:text-[#00000095]" />
                  </div>
                  <textarea onChange={(e) => setDetails_Address(e.target.value)} name="" id="" className="w-full h-52 p-3 outline-none placeholder:text-[#00000095] text-[#00000095] font-semibold" placeholder="Address"></textarea>
                  <button onClick={send_details} className="bg-white text-[#6D28D9] font-semibold p-2 rounded-lg w-20 mx-auto block my-3">Save {save_Order ? <FontAwesomeIcon icon={faSpinner} spinPulse /> : <FontAwesomeIcon icon={faCaretRight} />}</button>
               </div>
            </div>
         }
         <div className="bg-[#6D28D9] rounded-md flex justify-between  items-center relative text-white font-semibold text-4xl my-8 p-4">
            <Link to={'/'} className="text-2xl absolute sm:text-3xl"><FontAwesomeIcon icon={faAnglesLeft} className="" /></Link>
            <p className="text-3xl sm:text-4xl w-full text-center flex justify-center gap-1 items-center">Cart Details <span className="hidden sm:flex">🚚</span></p>
         </div>
         {cartItems.length > 0 && <div className="flex">
            <div>
               <h1 className="font-semibold">Total Price: ${Math.floor(total_Ammount)}</h1>
               <h1 className="font-semibold">Total Quantity: {total_Quantities}</h1>
            </div>
            <button className="ms-auto relative shine-box bg-[#6D28D9] p-3 rounded-lg text-white font-semibold" onClick={user?.isLogin ? () => setShowPop(true) : redirect_to_login}>Place Order</button>
         </div>}
         {cartItems.length > 0 ?
            cartItems.map((data) =>
               <div key={data.id} className="sm:flex my-4 h-auto border">
                  <div className="border-r flex mx-auto w-36 justify-center">
                     <Image src={data.image} alt="" className="h-full object-cover w-full my-auto" />
                  </div>
                  <div className="ps-2 py-3 w-full">
                     <p className="font-semibold text-xl">{data.title}</p>
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
            ) : <div className="flex justify-center items-center h-52 text-4xl font-semibold">No items ☹</div>
         }
      </div>

   )
}

export default Cart