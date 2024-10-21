import { useState, useContext, useEffect } from "react"; // Added useState here
import { UserContext } from "../context/UserContext";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { Image } from "antd";
import { height } from "@fortawesome/free-regular-svg-icons/faAddressBook";
import { useNavigate } from "react-router";
import { onAuthStateChanged } from "firebase/auth";

function MyOrders() {
    // Step 1: Initialize state for orders
    const [my_orders, setMy_Orders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);  // Destructure user from UserContext
    const navigate = useNavigate()


    
    // Check User Login 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user_real) => {
            if (user_real && user.isLogin) {
                // console.log('User log');
                setLoading(false)
            }
            else if (!user_real) {
                navigate('/')
            }
        });
        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        // Step 2: Check if the user object is loaded before running the logic
        if (user && user.userInfo && user.userInfo.id) {
            const q = query(
                collection(db, 'Orders'), // Ensure the collection name is correct
                where('order_user', '==', user.userInfo.id) // Adjust according to your data structure
            );

            // Set up a real-time listener
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const ordersData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMy_Orders(ordersData);
            }, (error) => {
                console.error("Error fetching orders: ", error); // Error handling
            });

            // Cleanup listener on unmount
            return () => unsubscribe();
        }
    }, [user]);
    
    // Added user as a dependency to re-run if the user changes
    console.log(my_orders);


    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="border-4 min-h-screen px-3">
            <h1 className="bg-[#6D28D9] text-center text-white font-semibold text-4xl mx-2 sm:mx-9 my-8 p-4">
                Order 🚚
            </h1>
            {my_orders.length > 0 ? (
                <div className="mx-2 sm:mx-9">
                    {my_orders.map((order) => (
                        <div className="my-10 fle border-2 shadow p-4" key={order.id}> {/* Added padding for spacing */}
                            <div className="flex gap-2 relative mb-5 mt-2 justify-center flex-col font-semibold">
                                {/* <h2>Order ID: {order.id}</h2> */}
                                <h2>Amount: ${order.totalAmount}</h2>
                                <button className={`border ${order.status == 'pending' && 'bg-[#FEDA9E]'} absolute right-0 p-2  text-[15px] rounded-md text-[#BE9049]`}>{order.status.slice(0, 1).toUpperCase() + order.status.slice(1)}</button>
                            </div>
                            <div className="justify-center sm:justify-normal flex gap-4 flex-wrap"> {/* Updated to use Tailwind CSS classes for consistency */}
                                {order.item.map((item, index) => (
                                    <div
                                        key={index}
                                        className="shadow hover:shadow-lg h-72 rounded-lg  w-48 text-center" // Use Tailwind CSS classes
                                    >
                                        <div className="w-full h-1/2 flex overflow-hidden">
                                            <Image
                                                src={item.image}
                                                className="object-cover rounded-t-md bg-center min-w-full min-h-full"
                                                alt={item.title} // Always include alt for accessibility
                                            />
                                        </div>

                                        <div className="h-1/2  flex flex-col justify-center">

                                            <h3 className="font-medium mb-0 h-10">{item.title.length > 20 ? item.title.slice(0, 20) + '...' : item.title}</h3>
                                            <p className="h-10">Quantity: {item.quantities}</p>
                                            <p className="h-10">Price: ${item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No orders available.</p> // Updated to provide a clearer fallback message
            )}
        </div>

    );
}

export default MyOrders;
