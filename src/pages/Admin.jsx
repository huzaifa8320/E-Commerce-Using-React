import { useEffect, useState } from "react";
import { auth, db, storage } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from "react-router";
import Admin_bg_1 from "../assets/Admin_bg-1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCircleCheck, faCircleExclamation, faLeftLong, faPlus, faSpinner, faUpload, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import CategoryButton from "../components/CategoryButton";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";




function Admin() {
    const [loading, setLoading] = useState(true)
    const [current_user_data, setCurrent_User_Data] = useState(null)
    const [popUp_Product, setPopUp_Product] = useState(false)
    const [text_success_alert, setText_Success_Alert] = useState(null)
    const [error_Alert_Text, setError_Alert_Text] = useState(null)
    const [product_title, setProduct_title] = useState('')
    const [product_discription, setProduct_Discription] = useState('')
    const [product_price, setProduct_Price] = useState('')
    const [product_category, setProduct_Category] = useState('Select a Category')
    const [product_image, setProduct_Image] = useState(null)
    const [firebase_loading , setFirebase_Loading] = useState(false)
    const [image, setImage] = useState(null);
    const [all_products , setAll_Products] = useState(null)

    const options = ['Option 1', 'Option 2', 'Option 3'];

    const { item } = useParams()

    const navigate = useNavigate()



    useEffect(() => {

        if (item == 'products') {

            const productsCollectionRef = collection(db, 'Products');

            const unsubscribe = onSnapshot(productsCollectionRef, (snapshot) => {

                if (!snapshot.empty) {
                    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log('Products data:', products);
                    setAll_Products(products)
                } else {
                    console.log('No products found in the collection.');
                    setAll_Products(null)
                }

            }, (error) => {
                console.error('Error fetching products:', error);
            });
        }
    }, [item])


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
                console.log(current_user.email);
                console.log(current_user);
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
    const add_product_db =async () => {
        if (!product_title) {
            setError_Alert_Text('Please Enter Title')
        }
        else if (!product_discription){
            setError_Alert_Text('Please Enter Discription')
        }
        else if (!product_price){
            setError_Alert_Text('Please Enter Price')
        }
        else if (product_category == 'Select a Category'){
            setError_Alert_Text('Please Select Category')
        }
        else if (!product_image){
            setError_Alert_Text('Please Select Image')
        }
        else{
            setFirebase_Loading(true)
            const imageUrl = await uploadImage(product_image);
            if (!imageUrl) {
                setError_Alert_Text('Network Error')
            }
            try {
                const docRef = await addDoc(collection(db, "Products"), {
                  title : product_title,
                  discription : product_discription,
                  price : product_price,
                  category : product_category,
                  image : imageUrl
                });
                console.log("Document written with ID: ", docRef.id);  // Success log
                setFirebase_Loading(false)
              } catch (error) {
                setFirebase_Loading(false)
                setError_Alert_Text('Something Went Wrong ⚠️')
                console.error("Error adding document: ", error);  // Error log
              }
            // console.log('Working');
            setText_Success_Alert('Add Product Successfully')
            setProduct_title('')
            setProduct_Discription('')
            setProduct_Price('')
            setProduct_Category('Select a Category')
            setImage(null)
            setProduct_Image(null)
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

    return (
        <div className="border-4 min-h-screen flex">
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
            {/* <h1>Hello Admin</h1> */}

            {/* Side bar  */}
            <div className="border-4  hidden sm:flex border-red-900 w-64 min-h-full  flex-col">
                <div className="p-6 gap-2 items-center flex bg-[#214162]">
                    <div className="shadow rounded-full bg-white w-14 h-14 flex">
                        {current_user_data?.photoURL ? <img src={current_user_data?.photoURL} alt="Photo" /> :
                            <FontAwesomeIcon icon={faUser} className="m-auto text-gray-400" />}
                    </div>
                    <div className="text-[15px]">
                        <p className="text-white font-semibold">{current_user_data?.displayName ? current_user_data?.displayName : 'No Name'}</p>
                        <p className="text-white font-semibold">{current_user_data?.email}</p>
                    </div>
                </div>
                <div
                    style={{ backgroundImage: `url(${Admin_bg_1})` }}
                    className="bg-[#15283c] flex-grow"
                >
                    <p className="p-5 border-b-2 border-[#FF5722] text-[18px] text-white font-semibold">General</p>

                    {/* Data  */}
                    <div className=" text-white mt-3  text-[18px]  cursor-pointer flex flex-col">
                        <Link to={'/admin/products'}><div className={`h-14 ${item == 'products' && 'bg-gray-200 text-black font-medium'}  m-1 p-4 rounded-md flex  items-center`}>📦 Products</div></Link>
                        <Link to={'/admin/orders'}><div className={`h-14 ${item == 'orders' && 'bg-gray-200 text-black font-medium'}  p-4 m-1 rounded-md flex items-center`}>🛒 Orders</div></Link>
                    </div>

                </div>
            </div>


            {/* Main Bar  */}
            <div className="max-w-full">
                {item == 'products' &&
                    <div>
                        <h1 className="text-3xl font-medium text-center m-5">Products</h1>
                        <div className="m-3 flex flex-wrap">
                            {all_products ? 
                                  all_products.map((item) => (
                                    <div key={item.id} item={item} className="border w-52">
                                        <img src={item.image} alt="" className="w-full"/>
                                        <p>{item.title}</p>
                                        <p>{item.discription}</p>
                                        <p>{item.price}</p>
                                        <p>{item.category}</p>
                                    </div> // Render a Card for each product
                                  ))
                            
                            : 'No Doc'}
                        </div>
                        <button onClick={() => setPopUp_Product(true)} className="bg-[#1C2F42] w-14 h-14 rounded-full absolute bottom-0 right-0 m-5">
                            <FontAwesomeIcon icon={faPlus} color="#ffff" />
                        </button>
                    </div>
                }

                {/* Pop Up add product  */}
                {popUp_Product &&
                    <div className="bg-[#00000058] flex justify-center  fixed top-0 left-0 w-full h-screen overflow-auto">
                        <div className="w-[450px] bg-white shadow-2xl m-auto max-h-[580px] overflow-auto rounded-lg p-5 pb-2">
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
                                <div className="border-2 rounded-md p-2">$<input value={product_price} onChange={(e) => setProduct_Price(e.target.value)} type="text" className="outline-none ps-2" placeholder="Enter Price" /></div>
                                <div className="mt-3">
                                    <CategoryButton setSelectedValue={setProduct_Category} defaultValue={product_category}/>
                                    <button onClick={add_product_db} className="bg-[#15283C] text-white mt-4 ms-auto flex items-center gap-2 p-3 rounded-md">Add Product {firebase_loading ? <FontAwesomeIcon icon={faSpinner} spinPulse /> :<FontAwesomeIcon icon={faCaretRight} />}</button>
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