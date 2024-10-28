import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { Image, Select } from "antd";
import { Link, useNavigate } from "react-router-dom"; // Corrected import
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";

function MyOrders() {
    // States 
    const [my_orders, setMy_Orders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataloading, setDataLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [filter_Orders, setFilter_Orders] = useState(null);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // // Check User Login 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user_real) => {
            if (user_real && user?.isLogin) {
                setLoading(false);
            } else if (!user_real) {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [user, navigate]);

    // My Orders 
    useEffect(() => {
        if (user && user.userInfo && user.userInfo.uid) {
            const q = query(
                collection(db, 'Orders'),
                where('order_user', '==', user.userInfo.uid)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                if (!snapshot.empty) {
                    const ordersData = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setMy_Orders(ordersData);
                    setDataLoading(false)
                } else {
                    setDataLoading(false)
                    setMy_Orders([]);
                }
            }, (error) => {
                console.error("Error fetching orders: ", error);
            });

            return () => unsubscribe();
        }
    }, [user]);

    // Set Filter Order When Orders Found 
    useEffect(() => {

        setFilter_Orders(my_orders);

    }, [my_orders]);

    // Filter Values 
    const arr_filter = [
        {
            value: 'All',
        },
        {
            value: 'Success',
        },
        {
            value: 'Pending',
        },
    ]


    //   Filter Change 
    const handle_filter_Change = (value) => {
        setFilter(value)
        if (value === 'All') {
            setFilter_Orders(my_orders);
        } else {
            const filtered = my_orders?.filter(my_orders => my_orders.status === value);
            setFilter_Orders(filtered);
        }
    }


    if (loading || dataloading) {
        return <div className="flex justify-center items-center text-5xl text-[#6D28D9] h-screen">
            <FontAwesomeIcon icon={faSpinner} spinPulse />
        </div>;
    }
    return (
        <div className="min-h-screen px-2">
            <div className="bg-[#6D28D9] rounded-md flex  items-center relative text-white font-semibold text-4xl mx-2 sm:mx-9 my-8 p-4">
                <Link to={'/'} className="sm:me-auto text-2xl mx-1 sm:text-3xl"><FontAwesomeIcon icon={faAnglesLeft} className="" /></Link>
                <p className="text-3xl sm:text-4xl me-auto flex gap-1 items-center">Order <span className="hidden sm:flex">🚚</span></p>
                <Select options={arr_filter} value={filter} onChange={handle_filter_Change} className="absolute w-24 right-5" />

            </div>
            {filter_Orders.length > 0 ? (
                <div className="mx-2 sm:mx-9">
                    {filter_Orders.map((order) => (
                        <div className="my-10 fle border-2 shadow p-4" key={order.id}>
                            <div className="flex gap-2 relative mb-5 mt-2 justify-center flex-col font-semibold">
                                <h2>Amount: ${order.totalAmount}</h2>
                                <button className={`border ${order.status == 'Pending' && 'bg-[#FEDA9E] text-[#BE9049] border-[#BE9049]'} ${order.status == 'Success' && 'bg-[#C5F3D7] border-green-400 text-green-600'} absolute right-0 p-2  text-[15px] rounded-md`}>{order.status}</button>
                            </div>
                            <div className="justify-center sm:justify-normal flex gap-4 flex-wrap">
                                {order.item.map((item, index) => (
                                    <div
                                        key={index}
                                        className="shadow hover:shadow-lg h-72 rounded-lg  w-48 text-center"
                                    >
                                        <div className="w-full h-1/2 flex overflow-hidden">
                                            <Image
                                                src={item.image}
                                                className="object-cover rounded-t-md bg-center min-w-full min-h-full"
                                                alt={item.title}
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
                <p className="m-auto text-center text-2xl font-medium py-10">No orders available. 😕</p>
            )}
        </div>

    );
}

export default MyOrders;