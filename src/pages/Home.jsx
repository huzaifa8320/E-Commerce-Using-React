import { useContext, useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCartPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../assets/logo.png"
import defaultProfile from "../assets/defaultProfile.png";
import { CartContext } from "../context/CartContext";
import { auth, db } from "../utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Select } from "antd";


function Home() {
    const [signOpen, setSignOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);
    const { user, setUser } = useContext(UserContext)
    const { cartItems } = useContext(CartContext)
    const [menuOpen, setMenuOpen] = useState(false);
    const [all_products, setAll_Products] = useState([]);
    const [chooseCategory, setChooseCategory] = useState('All');
    // Updated Data 
console.log(user);

    // Get all Products 
    useEffect(() => {
        const productsCollectionRef = collection(db, 'Products');

        const unsubscribe = onSnapshot(productsCollectionRef, (snapshot) => {

            if (!snapshot.empty) {
                const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log('Products data:', products);
                setAll_Products(products)
                setLoading(false)
            } else {
                console.log('No products found in the collection.');
                setLoading(false)
                setAll_Products([])
            }

        }, (error) => {
            console.error('Error fetching products:', error);
        });

    }, [])

    // Search Filter 
    const filteredProducts = all_products.filter((data) => {
        const matchesSearchTerm = data.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = chooseCategory === 'All' || data.category === chooseCategory; // Assuming each product has a 'category' field
        return matchesSearchTerm && matchesCategory;
    });

    // Check User Login 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user_real) => {
            if (user_real && user.isLogin) {
                console.log('User log');
                setUserLoading(false)
            }
            else if (!user_real) {
                setUserLoading(false)
                localStorage.removeItem('cartItems')
                console.log('not log');
            }
        });
        return () => unsubscribe();
    }, [user]);


    // Category Button 
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    //  Profile button 
    const openProfileDetails = () => {
        setSignOpen(!signOpen);
    };


    // Sign Out button 
    const handleSignOut = () => {
        signOut(auth).then(() => {
            console.log(
                "Sign-out successful."
            );
        }).catch((error) => {
            console.log(

                error
            );
        });
    };


    // Navbar Toggle 
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };


    // Categories Options

    const arr_category = [
        {
            value: 'All',
        },
        {
            value: 'Beauty',
        },
        {
            value: 'Groceries',
        },
        {
            value: 'Furniture',
        },
        {
            value: `Men's Clothing`,
        },
        {
            value: `Women's  Clothing`,
        },
        {
            value: `Footwear`,
        },
        {
            value: `Accessories`,
        },
        {
            value: `Skin-Care`,
        },
        {
            value: `Vehicle`,
        },
    ]

    //   Category Change 
    const handle_cat_Change = (value) => {
        setChooseCategory(value);
        setMenuOpen(false)
    }

    // Updated Data end




    // // Scroll data 
    // useEffect(() => {
    //     const scrollData = () => {
    //         if (Math.ceil(window.innerHeight + document.documentElement.scrollTop) == document.documentElement.offsetHeight) {
    //             if (data_Limit < data_Total) {
    //                 setData_Limit(data_Limit + 20)
    //             }
    //         }
    //     };
    //     window.addEventListener('scroll', scrollData)
    // }, [data_Limit, data_Loading])

    return (
        <div className="main">
            {loading || userLoading ?
                <div className="bg-[#6D28D9] z-10 w-full h-screen fixed top-0 left-0 flex justify-center items-center">
                    <div className="loader"></div>
                </div> :
                <div>
                    <nav className="bg-[#6D28D9] shadow-md px-3 lg:px-5 py-3 rounded-b w-full fixed">
                        <div className="flex items-center">
                            <a href="#" className="logo hidden md:flex items-center me-auto">
                                <div className="h-16 w-16">
                                    <img src={logo} alt="logo" />
                                </div>
                                <div className="logo_name mx-1">
                                    <p className='text-white font-bold text-2xl'>MH Store</p>
                                    <p className='text-white font-semibold mb-0'>Your Own Store</p>
                                </div>
                            </a>
                            <button onClick={toggleMenu} className="px-3 me-auto text-white text-2xl md:hidden focus:outline-none">
                                {menuOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
                            </button>

                            <div className="relative flex items-center md:hidden">
                                {
                                    user.isLogin &&
                                    <div className="relative">
                                        {cartItems.length ?
                                            <div className="absolute -top-2 -right-2 bg-red-700 text-white h-4 w-4 rounded-full text-center font-semibold text-xs">{cartItems.length}</div> : ''
                                        }
                                        <Link to={'/cart'}><FontAwesomeIcon icon={faCartPlus} className="cursor-pointer text-3xl text-white" /></Link>
                                    </div>
                                }
                                {
                                    user.isLogin ?
                                        <div>
                                            <img onClick={openProfileDetails} src={user?.userInfo?.img_user ? user.userInfo.img_user : defaultProfile} alt="" className="h-14 w-14 rounded-full ms-4 me-2 border-2 shadown_default cursor-pointer" />
                                            {signOpen && (
                                                <div className="absolute top-20 right-3 w-[150px] ">
                                                    <div className="bg-white shadow-2xl rounded-md text-[#6D28D9] font-semibold cursor-pointer border-2 ">
                                                        <Link to={"/profile"} className="block rounded-t text-center p-3 border-b-2 hover:bg-purple-500 hover:text-white">Your Profile</Link>
                                                        <div className="rounded-b justify-center flex hover:bg-purple-500 hover:text-white">
                                                            <button className="p-3" onClick={handleSignOut}>Sign out</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                            }
                                        </div> :

                                        <Link to="/Login"
                                            className="mx-auto my-2 md:mx-0 h-10 w-[100px] bg-white text-[#6D28D9] flex items-center justify-center font-semibold rounded-md">Login</Link>
                                }
                            </div>

                            <div id="menu" className="h-10 hidden md:flex justify-center me-auto">
                                <input
                                    type="text"
                                    className="outline-none ps-2 mx-auto rounded-md font-bold text-gray-800 placeholder-[#6D28D9]"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div id="menu"
                                className="hidden md:flex md:items-center ms-auto div_select w-auto relative my-3 md:m-0">
                                <button
                                    className="w-36 cursor-pointer bg-white text-[#6D28D9] font-semibold p-2 mx-7 rounded-md focus:outline-none"
                                >
                                    <Select value={chooseCategory} style={{ width: '100%' }} options={arr_category} onChange={handle_cat_Change} />
                                </button>
                                <div className="relative flex items-center">
                                    {
                                        user.isLogin &&
                                        <div className="relative">
                                            {cartItems.length ?
                                                <div className="absolute -top-2 right-1 bg-red-700 text-white h-4 w-4 rounded-full text-center font-semibold text-xs">{cartItems.length}</div> : ''
                                            }
                                            <Link to={'/cart'}><FontAwesomeIcon icon={faCartPlus} className="cursor-pointer mx-3 text-3xl text-white" /></Link>
                                        </div>
                                    }
                                    {
                                        user.isLogin ?
                                            <div>
                                                <img onClick={openProfileDetails} src={user?.userInfo?.img_user ? user.userInfo.img_user : defaultProfile} alt="" className="h-14 w-14 rounded-full ms-6 me-5 border-2 shadown_default hover:scale-110 cursor-pointer duration-300" />
                                                {signOpen && (
                                                    <div className="absolute top-20 right-3 w-[150px] ">
                                                        <div className="bg-white shadow-2xl rounded-md text-[#6D28D9] font-semibold cursor-pointer border-2 ">
                                                            <Link to={"/profile"} className="block rounded-t text-center p-3 border-b-2 hover:bg-purple-500 hover:text-white">Your Profile</Link>
                                                            <div className="rounded-b justify-center flex hover:bg-purple-500 hover:text-white">
                                                                <button className="p-3" onClick={handleSignOut}>Sign out</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                }
                                            </div> :

                                            <Link to="/Login"
                                                className="mx-auto my-4 md:mx-0 h-10 w-[100px] bg-white text-[#6D28D9] flex items-center justify-center font-semibold rounded-md">Login</Link>
                                    }
                                </div>
                            </div>
                        </div>

                        {/*Real Navbar Mobile  */}
                        <div className={`md:hidden overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
                            <div className="p-4 bg-[#6D28D9]">
                                <div className="flex justify-center me-auto h-10 mb-5">
                                    <input
                                        type="text"
                                        className="outline-none ps-2 mx-auto rounded-md font-bold text-gray-800 placeholder-[#6D28D9]"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)

                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-36 cursor-pointer bg-white text-[#6D28D9] font-semibold p-2 mx-7 rounded-md focus:outline-none"
                                        
                                    >
                                        <Select value={chooseCategory} style={{ width: '100%' }} options={arr_category} onChange={handle_cat_Change} />

                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>



                    {/* Product  */}
                    <div className="container px-5 pt-36 pb-14 mx-auto">

                        <div className="flex border- gap-5 flex-wrap">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((item) => (
                                    <ProductCard item={item} key={item.id} />
                                ))
                            ) : (
                                <p className="text-gray-600 text-center w-full text-3xl">No products found.</p>
                            )}
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

export default Home;
