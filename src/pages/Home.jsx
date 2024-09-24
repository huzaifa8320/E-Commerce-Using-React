import { useContext, useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Category from "../components/Category";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCartPlus, faCartShopping, faL, faRotateRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../assets/logo.png"
import defaultProfile from "../assets/defaultProfile.png";
import { CartContext } from "../context/CartContext";
import { auth, db } from "../utils/firebase";
import { onSnapshot } from "firebase/firestore";


function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [signOpen, setSignOpen] = useState(false);
    const [category, setCategory] = useState([]);
    const [choosenCategory, setChoosenCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);
    const { user, setUser } = useContext(UserContext)
    const { cartItems } = useContext(CartContext)

    const [data_Limit, setData_Limit] = useState(30);
    const [data_Skip, setData_Skip] = useState(0);
    const [data_Total, setData_Total] = useState(0);
    const [data_Loading, setData_Loading] = useState(false);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user_real) => {
            if (user_real && user.isLogin) {
                console.log('User log');                
                setUserLoading(false)
            }
            else if(!user_real){
                localStorage.removeItem('cartItems')
                console.log('not log');
                setUserLoading(false)
            }
        });
        return () => unsubscribe();
    }, [user]);

    // Scroll data 
    useEffect(() => {
        const scrollData = () => {
            if (Math.ceil(window.innerHeight + document.documentElement.scrollTop) == document.documentElement.offsetHeight) {
                if (data_Limit < data_Total) {
                    setData_Limit(data_Limit + 20)
                }
            }
        };
        window.addEventListener('scroll', scrollData)
    }, [data_Limit, data_Loading])

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const openProfileDetails = () => {
        setSignOpen(!signOpen);
    };
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

    useEffect(() => {
        fetch('https://dummyjson.com/products/categories')
            .then(res => res.json())
            .then(setCategory)
            .catch(console.error);
    }, []);

    useEffect(() => {
        setData_Loading(true)
        const url = choosenCategory === "All"
            ? `https://dummyjson.com/products?limit=${data_Limit}&skip=${data_Skip}`
            : `https://dummyjson.com/products/category/${choosenCategory}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setProducts(data.products);
                setData_Total(data.total)
                setLoading(false);
                setData_Loading(false)
            })
            .catch(error => {
                console.error('Error', error);
                setLoading(false);
            });
    }, [choosenCategory, data_Limit]);

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );



    // Navbar 
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setIsOpen(false)
    };


    return (
        <div className="main">
            {/* Navbar Desktop  */}
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
                            onClick={toggleDropdown}
                        >
                            {choosenCategory === "All" ? "All" :
                                `${choosenCategory.length > 10
                                    ? choosenCategory.slice(0, 10).toUpperCase() + ' ...'
                                    : choosenCategory.slice(0, 1).toUpperCase() + choosenCategory.slice(1)}`
                            }
                        </button>

                        {isOpen && (
                            <div className="overflow-auto h-60 option_select bg-none absolute top-5 md:mt-20 z-10 w-4/6 rounded-md shadow-2xl">
                                <Category
                                    onClick={() => {
                                        setChoosenCategory("All")
                                        setIsOpen(false)
                                    }}
                                    isChoosen={choosenCategory === "All"}
                                    category={{ slug: "All", name: "All" }} />
                                {category.map((cat) => (
                                    <Category
                                        onClick={() => {
                                            setChoosenCategory(cat.slug)
                                            setIsOpen(false)
                                        }}
                                        isChoosen={cat.slug === choosenCategory}
                                        category={cat}
                                        key={cat.slug}
                                    />
                                ))}
                            </div>
                        )}
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

                {/* Navbar Mobile  */}
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
                                onClick={toggleDropdown}
                            >
                                {choosenCategory === "All" ? "All" :
                                    `${choosenCategory.length > 10
                                        ? choosenCategory.slice(0, 10).toUpperCase() + ' ...'
                                        : choosenCategory.slice(0, 1).toUpperCase() + choosenCategory.slice(1)}`
                                }
                            </button>

                            {isOpen && (
                                <div className="overflow-auto h-60 option_select bg-none absolute top-52 md:mt-20 z-10 w-4/6 rounded-md shadow-2xl">
                                    <Category
                                        onClick={() => {
                                            setChoosenCategory("All")
                                            setIsOpen(false)
                                            setMenuOpen(!menuOpen);

                                        }}
                                        isChoosen={choosenCategory === "All"}
                                        category={{ slug: "All", name: "All" }} />
                                    {category.map((cat) => (
                                        <Category
                                            onClick={() => {
                                                setChoosenCategory(cat.slug)
                                                setIsOpen(false)
                                                setMenuOpen(!menuOpen);
                                            }}
                                            isChoosen={cat.slug === choosenCategory}
                                            category={cat}
                                            key={cat.slug}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>



            {/* Product  */}
            <div className="container px-5 pt-36 mx-auto">
                {loading || userLoading ? (
                    <div className="bg-[#6D28D9] z-10 w-full h-screen fixed top-0 left-0 flex justify-center items-center">
                        <div className="loader"></div>
                    </div>
                ) : (
                    <div className="flex flex-wrap">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((item) => (
                                <ProductCard item={item} key={item.id} />
                            ))
                        ) : (
                            <p className="text-gray-600 text-center w-full text-3xl">No products found.</p>
                        )}
                    </div>
                )}
                {data_Loading &&
                    <FontAwesomeIcon className="mx-auto block my-10 text-5xl text-[#6D28D9]" icon={faRotateRight} spin />

                }
            </div>
        </div>
    );
}

export default Home;
