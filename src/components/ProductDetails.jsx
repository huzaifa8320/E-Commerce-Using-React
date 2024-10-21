import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Image } from "antd";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(null);
    const { cartItems, addItem, isItemAdded } = useContext(CartContext)
    // const { all_products, setAll_Products } = useContext(DetailsContext)
    console.log(cartItems);
    console.log(product);


    // Updated data 

    // Get Product 
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Reference to the document with the specific id
                const docRef = doc(db, "Products", id);

                // Fetch the document
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct(
                        { id: docSnap.id, ...docSnap.data() }
                    );
                    setLoading(false);
                    // Document was found, log or return the data
                    console.log("Document data:", docSnap.data());
                } else {
                    setNotFound("Not Found 🚫");
                    setLoading(false);
                    // Document not found
                    console.log("No such document with ID:", id);
                }
            } catch (error) {
                setNotFound("Something went Wrong 🚫");
                setLoading(false);
                console.error("Error fetching document:", error);
            }
        };

        // Call the async function
        fetchProduct();
    }, [id]);
    // Updated data 




    // useEffect(() => {
    //     setNotFound(false);
    //     setLoading(true);

    //     fetch(`https://dummyjson.com/products/${id}`)
    //         .then((res) => {
    //             if (!res.ok) {
    //                 throw new Error('Product not found');
    //             }
    //             return res.json();
    //         })
    //         .then((data) => {
    //             setProduct(data);
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             setNotFound(true);
    //             setLoading(false);
    //             console.error('Error fetching product:', error);
    //         });
    // }, [id]);

    if (loading) {

        return <div className="bg-[#6D28D9] w-full h-screen fixed top-0 left-0 flex justify-center items-center">
            <div className="loader"></div>
        </div>
    }
    if (notFound) {
        return <h1 className="text-center text-5xl my-52 font-semibold text-[#6D28D9]">{notFound}</h1>;
    }

    if (!product) return null;

    return (
        <div className="min-h-screen flex justify-center">
            <div className="lg:w-4/5 px-3 py-5 gap-5 w-full flex flex-col sm:flex-row sm:flex flex-wrap lg:flex-nowrap justify-center items-center">
                <div className="w-full sm:w-1/2 flex justify-center">
                    <Image
                        alt="ecommerce"
                        src={product.image}
                        className="object-cover bg-center rounded-md"
                        style={{ height: '300px', width: '100%' }}
                    />
                </div>

                <div className="h-[300px] flex justify-center w-full sm:w-1/2">
                    <div className="p-4">
                        <h2 className="text-sm title-font text-gray-500 tracking-widest">
                            {product.category}
                        </h2>
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                            {product.title}
                        </h1>
                        <div className="flex mb-4">
                            <span className="flex py-2 border-gray-200 space-x-2">
                                <Link className="text-gray-500">
                                    <svg
                                        fill="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                    </svg>
                                </Link>
                                <Link className="text-gray-500">
                                    <svg
                                        fill="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                    </svg>
                                </Link>
                                <Link className="text-gray-500">
                                    <svg
                                        fill="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                                    </svg>
                                </Link>
                            </span>
                        </div>
                        <p className="leading-relaxed">
                            {product.discription}
                        </p>
                        <div className="flex my items-center">
                            <span className="title-font font-medium text-2xl text-gray-900">
                                ${product.price}
                            </span>

                            <button onClick={() => addItem(product)} className="flex my-10 ml-auto text-white bg-indigo-500 min-w-24 p-2 justify-center items-center focus:outline-none hover:bg-indigo-600 rounded">
                                {isItemAdded(product.id) ? `Added ${isItemAdded(product.id).quantities}` : `Add to Cart`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
