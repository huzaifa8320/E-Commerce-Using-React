import { useEffect, useState } from "react";
import { auth, db, storage } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from "react-router";
import Admin_bg_1 from "../assets/Admin_bg-1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCaretRight, faCircleCheck, faCircleExclamation, faEllipsis, faFilter, faLeftLong, faPlus, faSpinner, faUpload, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import CategoryButton from "../components/CategoryButton";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Image, Select } from "antd";
import { Firestore } from "firebase/firestore";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons/faAnglesLeft";




function Admin() {
    const [loading, setLoading] = useState(true)
    const [product_loading, setProduct_Loading] = useState(true)
    const [order_loading, setOrder_Loading] = useState(true)
    const [update_loading, setUpdate_Loading] = useState(false)
    const [current_user_data, setCurrent_User_Data] = useState(null)
    const [popUp_Product, setPopUp_Product] = useState(false)
    const [text_success_alert, setText_Success_Alert] = useState(null)
    const [error_Alert_Text, setError_Alert_Text] = useState(null)
    const [product_title, setProduct_title] = useState('')
    const [product_discription, setProduct_Discription] = useState('')
    const [product_price, setProduct_Price] = useState('')
    const [product_category, setProduct_Category] = useState('Select a Category')
    const [product_image, setProduct_Image] = useState(null)
    const [firebase_loading, setFirebase_Loading] = useState(false)
    const [image, setImage] = useState(null);
    const [all_products, setAll_Products] = useState(null)
    const [all_Orders, setAll_Orders] = useState(null)
    const [show_menu, setShow_Menu] = useState(null)
    const [view_order, setView_Order] = useState();
    const [filter, setFilter] = useState('All');
    const [filter_Orders, setFilter_Orders] = useState(null);
    const [slide_bar, setSlide_Bar] = useState(false);
    // alert(slide_bar)

    const { item } = useParams()


    const slide_open = () => {
        setSlide_Bar(!slide_bar)

    }
    const navigate = useNavigate()

    // Default show Products 
    useEffect(() => {
        if (!item) {
            navigate('/admin/products');
        }
    }, [item, navigate]);

    // Show Product menu 
    const handleMenuToggle = (productId) => {
        if (show_menu === productId) {
            setShow_Menu(null);
        } else {
            setShow_Menu(productId);
        }
    };


    // Delete Product from db 
    const deleteProduct = async (id) => {
        try {
            const productDocRef = doc(db, "Products", id);
            await deleteDoc(productDocRef);
            setText_Success_Alert('Delete Successfully ✅')
        }
        catch (error) {
            setError_Alert_Text('Something went Wrong ⚠')
        }
        setTimeout(() => {
            setText_Success_Alert(null)
            setError_Alert_Text(null)
        }, 2000);
    }


    // Get all Products 
    useEffect(() => {
        setFilter('All')
        const productsCollectionRef = collection(db, 'Products');

        const unsubscribe = onSnapshot(productsCollectionRef, (snapshot) => {

            if (!snapshot.empty) {
                const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAll_Products(products)
                
                setProduct_Loading(false)
            } else {
                setAll_Products(null)
                setProduct_Loading(false)
            }

        }, (error) => {
            console.error('Error fetching products:', error);
        });

    }, [item])



    //   Filter Change 
    const handle_filter_Change = (value) => {
        setFilter(value)
        if (value === 'All') {
            setFilter_Orders(all_Orders);            // Show all orders if "All" is selected
        } else {
            const filtered = all_Orders?.filter(all_Orders => all_Orders.status === value);
            setFilter_Orders(filtered);
        }
    }




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

    // Get all Orders 
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Orders'), (snapshot) => {
            const all_order = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAll_Orders(all_order)
            setOrder_Loading(false)
            // setFilter('All')

        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [item]);

    useEffect(() => {
        setFilter_Orders(all_Orders);
        // setOrder_Loading(false)
    }, [all_Orders]);





    // Image show locally 
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setProduct_Image(file)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    // Check Admin Valid 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (current_user) => {
            if (current_user?.email == 'admin1@gmail.com') {
                setCurrent_User_Data(current_user)
                setLoading(false)
            }
            else {
                navigate("/");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }



    // Function to upload an image and return the URL
    const uploadImage = async (product_image) => {
        const storageRef = ref(storage, `images/${product_image.name}`);

        try {
            await uploadBytes(storageRef, product_image);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image: ", error);
            throw error;
        }
    };


    // Add Product db 
    const add_product_db = async () => {
        if (!product_title) {
            setError_Alert_Text('Please Enter Title')
        }
        else if (!product_discription) {
            setError_Alert_Text('Please Enter Discription')
        }
        else if (!product_price) {
            setError_Alert_Text('Please Enter Price')
        }
        else if (product_category == 'Select a Category') {
            setError_Alert_Text('Please Select Category')
        }
        else if (!product_image) {
            setError_Alert_Text('Please Select Image')
        }
        else {
            setFirebase_Loading(true)
            const imageUrl = await uploadImage(product_image);
            if (!imageUrl) {
                setError_Alert_Text('Network Error')
            }
            try {
                const docRef = await addDoc(collection(db, "Products"), {
                    title: product_title,
                    discription: product_discription,
                    price: product_price,
                    category: product_category,
                    image: imageUrl
                });
                setFirebase_Loading(false)
            } catch (error) {
                setFirebase_Loading(false)
                setError_Alert_Text('Something Went Wrong ⚠️')
            }
            setText_Success_Alert('Add Product Successfully')
            setProduct_title('')
            setProduct_Discription('')
            setProduct_Price('')
            setProduct_Category('Select a Category')
            setImage(null)
            setProduct_Image(null)
            setPopUp_Product(false)
        }
        setTimeout(() => {
            setText_Success_Alert(null)
            setError_Alert_Text(null)
        }, 2000);
    }

    // Close Alert 
    const closeAlert = () => {
        setText_Success_Alert(null)
        setError_Alert_Text(null)
    }

    // viewOrder 
    const viewOrder = (order) => {
        setView_Order(
            order
        )
    }

    // Aprrove Order 
    const approve_Order = async (viewOrder) => {
        try {
            setUpdate_Loading(true)
            // Reference the order document by its ID
            const orderRef = doc(db, "Orders", viewOrder.id);

            // Update the status field to 'success'
            await updateDoc(orderRef, {
                status: "Success"
            });

            setText_Success_Alert('Order Approved Successfully ✅')
            setUpdate_Loading(false)
            setView_Order(null)

        } catch (error) {
            setUpdate_Loading(false)
        }
        setTimeout(() => {
            setText_Success_Alert(null)
        }, 2000);

    }

    return (
        <div className="min-h-screen flex">
            {/* Changes alert  */}
            {text_success_alert &&
                <div className="z-10 cursor-pointer alert shadow-2xl p-3 rounded-lg bg-[#C5F3D7] border-l-8 border-green-400 show fixed right-3 top-5">
                    <span className="text-green-600"><FontAwesomeIcon icon={faCircleCheck} /></span>
                    <span className="px-3 msg text-green-600 font-semibold">{text_success_alert}</span>
                    <span onClick={closeAlert} className="text-green-600"><FontAwesomeIcon icon={faXmark} /></span>
                </div>

            }
            {/* Changes alert Error  */}
            {error_Alert_Text &&
                <div className="z-10 cursor-pointer alert shadow-2xl p-3 rounded-lg bg-[#FEDA9E] border-l-8 border-[#FEA601] show fixed right-3 top-5">
                    <span className="text-[#DA7F0B]"><FontAwesomeIcon icon={faCircleExclamation} /></span>
                    <span className="px-3 msg text-[#BE9049] font-semibold">{error_Alert_Text}</span>
                    <span onClick={closeAlert} className="text-[#DA7F0B]"><FontAwesomeIcon icon={faXmark} /></span>
                </div>

            }

            {/* Side bar  */}
            <div
                className={`${slide_bar ? 'translate-x-0' : '-translate-x-full'
                    } sm:translate-x-0 transition-transform duration-300 absolute sm:relative border-e sm:border-transparent flex z-10 sm:flex w-64 h-screen flex-col`}
            >
                <div className="p-6 gap-2 items-center flex bg-[#214162] relative">
                    <div className="absolute sm:hidden top-3 right-3 text-white text-xl cursor-pointer" onClick={() => slide_open()}><FontAwesomeIcon icon={faXmark} /></div>
                    <div className="shadow-xl rounded-full bg-white w-14 h-14 flex">
                        {current_user_data?.photoURL ? (
                            <Image src={current_user_data?.photoURL} style={{width: '56px', height:'56px'}} alt="Photo" className="object-cover rounded-full"/>
                        ) : (
                            <FontAwesomeIcon icon={faUser} className="m-auto text-gray-400" />
                        )}
                    </div>
                    <div className="text-[15px]">
                        <p className="text-white font-semibold">
                            {current_user_data?.displayName || 'No Name'}
                        </p>
                        <p className="text-white font-semibold">{current_user_data?.email}</p>
                    </div>
                </div>
                <div
                    style={{ backgroundImage: `url(${Admin_bg_1})` }}
                    className="bg-[#15283c] relative flex-grow"
                >
                    <p className="p-5 border-b-2 border-[#FF5722] text-[18px] text-white font-semibold">General</p>
                    {/* Data */}
                    <div className="text-white mt-3 text-[18px] cursor-pointer flex flex-col">
                        <Link to={'/admin/products'} onClick={() => slide_open()}>
                            <div className={`h-14 ${item === 'products' && 'bg-gray-200 text-black font-medium'} m-2 p-4 rounded-md flex items-center`}>
                                📦 Products
                            </div>
                        </Link>
                        <Link to={'/admin/orders'} onClick={() => slide_open()}>
                            <div className={`h-14 ${item === 'orders' && 'bg-gray-200 text-black font-medium'} p-4 m-2 rounded-md flex items-center`}>
                                🛒 Orders
                            </div>
                        </Link>
                    </div>
                    <div className="absolute bottom-8 w-full px-3 items- flex flex-col gap-5">
                        <Link to={'/admin/profile'} className="bg-white p-3 rounded-md w-full font-semibold">📋 Go To Profile</Link>
                        <Link to={'/'} className="text-white flex gap-3 items-center text-xl font-semibold">
                            <FontAwesomeIcon icon={faAnglesLeft} />
                            <span>Back To Site 🌐</span>
                        </Link>
                    </div>
                </div>
            </div>



            {/* Main Bar  */}
            <div className="w-full flex flex-col max-h-screen overflow-y-auto">
                {/* Show All Products  */}
                <div className="">
                    <div className="flex border-s bg-[#214162] relative w-full items-center">
                        <div className="text-white text-2xl mx-5 sm:hidden cursor-pointer" onClick={() => slide_open()}><FontAwesomeIcon icon={faBars} /></div>
                        <h1 className="text-3xl w-full relative font-medium sm:text-center p-4 bg-[#214162] text-white">{item == 'products' ? 'Products' : 'Order'}</h1>
                        {item == 'orders' && <Select className="absolute w-24 right-5" value={filter} options={arr_filter} onChange={handle_filter_Change} />}
                    </div>
                </div>
                {item == 'products' &&
                    <div className="h-full">
                        {product_loading ? <div className="flex justify-center items-center max-h-full h-full"><FontAwesomeIcon icon={faSpinner} spinPulse className="text-3xl" /></div> :
                            <div className="flex py-5 justify-center mx-3 mt-3 mb-10 flex-wrap gap-10">
                                {all_products ?
                                    all_products.map((item) => (
                                        <div key={item.id} className="shadow-md rounded-md  cursor-pointer duration-150 w-52">
                                            <div className="w-full h-52">
                                                <Image src={item.image} style={{height:'208px', width: '208px'}} className="object-cover rounded-t-md" />
                                            </div>
                                            <div className="m-3 flex flex-col gap-2 relative">

                                                <p className="text-xs tracking-widest text-gray-500">{item.category.toUpperCase()}</p>
                                                <p className="font-medium text-lg">{item.title.length > 20 ? item.title.slice(0, 1).toUpperCase() + item.title.slice(1, 19) + '...' : item.title}</p>
                                                <p className="h-14">{item.discription.length > 43 ? item.discription.slice(0, 43) + '...' : item.discription}</p>
                                                <p>${item.price}</p>
                                                <button className="absolute right-0 bottom-0">
                                                    <FontAwesomeIcon icon={faEllipsis} onClick={() => handleMenuToggle(item.id)} />
                                                    {show_menu === item.id &&
                                                        <div className="absolute h-[70px] z-50 w-[86px] flex flex-col justify-evenly right-full  shadow bg-[#214162] text-white font-medium rounded-md">
                                                            <button onClick={() => deleteProduct(item.id)} className="hover:bg-white hover:text-[#214162] mx-1">Delete</button>
                                                            <button className="hover:bg-white hover:text-[#214162] mx-1">Edit</button>
                                                        </div>
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    ))

                                    : 'No Product Try to Add Some 😀'}
                            </div>
                        }
                        <button onClick={() => setPopUp_Product(true)} className="bg-[#1C2F42] w-14 h-14 rounded-full fixed bottom-0 right-0 m-5">
                            <FontAwesomeIcon icon={faPlus} color="#ffff" />
                        </button>
                    </div>
                }
                {/* Show All Orders  */}
                {item == 'orders' &&
                    <div className="relative h-full">
                        {order_loading ? <div className="flex justify-center items-center max-h-full h-full"><FontAwesomeIcon icon={faSpinner} spinPulse className="text-3xl" /></div> :
                            <div className="flex py-5 justify-center mx-3 mt-3 mb-10 flex-wrap gap-10">
                                {filter_Orders?.length > 0 ?
                                    filter_Orders.map((order) => (
                                        <div key={order.id} item={order} className="shadow-md p-3 border- h-52 rounded-md  cursor-pointer duration-150 w-64">
                                            <div className=" flex flex-col gap-2 relative border- h-full justify-between">
                                                <button className={`border ${order.status == 'Pending' && 'bg-[#FEDA9E] text-[#BE9049] border-[#BE9049]'} ${order.status == 'Success' && 'bg-[#C5F3D7] border-green-400 text-green-600'} font-medium p-1 rounded-md text-[15px] absolute right-0 top-0`}>{order.status}</button>
                                                <p className="text-[18px] font-semibold">Name: {order.name.length > 10 ? order.name.slice(0, 1).toUpperCase() + order.name.slice(1, 9) + '...' : order.name.slice(0, 1).toUpperCase() + order.name.slice(1)}</p>
                                                <p className="font-medium text-sm break-words">Email: {order.email.length > 21 ? order.email.slice(0,21) + '...' : order.email}</p>
                                                <p>Total Amount: ${order.totalAmount}</p>
                                                <p>Total Item: {order.item.length}</p>
                                                <button onClick={() => viewOrder(order)} className="bg-[#214162] w-32 mx-auto p-2 text-white rounded-md">View Order 📦</button>
                                            </div>
                                        </div>
                                    ))

                                    : <p>No Order ☹</p>}
                            </div>
                        }
                    </div>
                }

                {/* Pop Up View Order  */}
                {view_order &&
                    <div className="bg-[#00000058] z-10 flex fixed top-0 left-0 w-full h-screen">
                        <div className="bg-[#14273A] flex flex-col shadow-lg sm:rounded-md text-white m-auto sm:w-[700px] relative h-screen w-full sm:h-[550px]">
                            <div className="flex items-center">
                                <p className="text-3xl font-medium m-5">Items 📦</p>
                            </div>
                            <button onClick={() => setView_Order(null)} className="absolute top-0 right-0 m-7 text-xl"><FontAwesomeIcon icon={faXmark} /></button>
                            <div className="flex justify-center px-5 sm:justify-between h-full overflow-auto scrollable-div my-5 flex-wrap gap-5">
                                {
                                    view_order &&
                                    view_order.item.map((item) => (
                                        <div key={item.id} className="text-red-700 w-44 h-48 rounded-md relative cursor-pointer">
                                            <Image src={item.image} style={{ height: '176px', width: '176px' }} className="w-full z-50 h-full object-cover rounded-md" />
                                            <div className="w-full font-medium flex rounded-b-md absolute bottom-0 z-0" style={{ boxShadow: 'inset 0 -25px 20px rgba(0, 0, 0, 1)' }} >
                                                <div className="mt-auto px-3 mb-2">
                                                    <p className="text-white">{item.title}</p>
                                                    <p className="text-gray-300">{item.price}$</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="bg-[#14273A] my-3 mx-4 shadow-md">
                                <div className="h-24 overflow-auto scrollable-div mb-3 text-gray-200">
                                <p className="m-1 break-words">Name : {view_order.name.slice(0,1).toUpperCase() + view_order.name.slice(1)}</p>
                                <p className="m-1 break-words">Email : {view_order.email}</p>
                                <p className="m-1 break-words">Address : {view_order.address}</p>
                                </div>
                                <div className="flex justify-center">
                                    <div className="rounded-full relative w-full px-5 bg-white p-1 text-[#14273A] font-semibold">
                                        <p className="text-xs my-2 sm:text-[16px]">Total Items: {view_order.item.length}</p>
                                        <p className="text-xs my-2 sm:text-[16px]">Total Amount: ${view_order.totalAmount}</p>
                                        {view_order.status != 'Success' && <button onClick={() => approve_Order(view_order)} className="absolute top-1/2 right-0 transform mx-5 -translate-y-1/2 bg-[#214162] text-white rounded p-2">Approve{update_loading ? <FontAwesomeIcon icon={faSpinner} spinPulse className="ms-2" /> : <FontAwesomeIcon icon={faCaretRight} className="ms-2" />}</button>}
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                }

                {/* Pop Up add product  */}
                {popUp_Product &&
                    <div className="bg-[#00000058] z-20 flex justify-center  fixed top-0 left-0 w-full h-screen overflow-auto">
                        <div className="sm:w-[450px] w-full h-screen bg-white shadow-2xl m-auto sm:max-h-[580px] overflow-auto sm:rounded-lg p-5 pb-2">
                            <p className="font-medium relative">
                                Add New Product
                                <button onClick={() => setPopUp_Product(false)} className="absolute top-0 right-0"><FontAwesomeIcon icon={faXmark} /></button>
                            </p>

                            <div className="flex mt-3">
                                <div className={`${image ? 'shadow' : 'border-2 border-dotted'} relative border-gray-300 w-32 h-32 flex justify-center items-center rounded`}>
                                    <div className="w-full h-full absolute">
                                        <input
                                            type="file"
                                            accept="image/*" // Accept only image files
                                            className="w-full h-full inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    {image ? (
                                        <img
                                            src={image}
                                            alt="Selected"
                                            className="object-contain w-full h-full rounded"
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faUpload} className="text-gray-500" />
                                    )}
                                </div>
                                <p className="flex gap-3 items-center ms-3 font-medium"><FontAwesomeIcon icon={faLeftLong} />Click to upload</p>
                            </div>
                            <div className="flex flex-col gap-2 my-3">
                                <p>Product Title :</p>
                                <input value={product_title} onChange={(e) => setProduct_title(e.target.value)} type="text" className="outline-none border-2 rounded-md p-2" placeholder="Enter Title" />
                                <p>Product Description :</p>
                                <input value={product_discription} onChange={(e) => setProduct_Discription(e.target.value)} type="text" className="outline-none border-2 rounded-md p-2" placeholder="Enter Description" />

                                <p>Product Price :</p>
                                <div className="border-2 rounded-md p-2">$<input value={product_price} onChange={(e) => setProduct_Price(e.target.value)} type="number" className="outline-none ps-2 custom-input" placeholder="Enter Price" /></div>
                                <div className="mt-3">
                                    <CategoryButton setSelectedValue={setProduct_Category} defaultValue={product_category} />
                                    <button onClick={add_product_db} className="bg-[#15283C] text-white mt-4 ms-auto flex items-center gap-2 p-3 rounded-md">Add Product {firebase_loading ? <FontAwesomeIcon icon={faSpinner} spinPulse /> : <FontAwesomeIcon icon={faCaretRight} />}</button>
                                </div>
                            </div>


                        </div>
                    </div>
                }
                {/* {item && item} */}
            </div>
        </div>
    )
}

export default Admin