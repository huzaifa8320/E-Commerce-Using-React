import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import defaultProfile from "../assets/defaultProfile.png";
import { useNavigate } from "react-router";
import { faCircleCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Profile() {
    const { user, setUser } = useContext(UserContext);
    const [details, setDetails] = useState();
    const [loading, setLoading] = useState(true);
    const [percentUpload, setPercentUpload] = useState();
    const [username_update, setUsername_update] = useState();
    const [read, setRead] = useState(true);
    const [isVisible_Alert, setIsVisible_Alert] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const storage = getStorage();


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user_real) => {
            if (user_real) {
                console.log("User Is Login");
            }
            else{
                
                navigate("/");
            }
        });
        return () => unsubscribe(); 
    }, [navigate]);


    useEffect(() => {
        const fetchData = async () => {
            if (user.isLogin) {
                setDetails(user.userInfo);
                setUsername_update(user.userInfo.username)
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setPercentUpload(`${progress}`);
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    const data = doc(db, 'User Data', user.userInfo.id);
                    await setDoc(data, {
                        img_user: downloadURL
                    }, { merge: true });
                    setIsVisible_Alert(true)
                    setTimeout(() => {
                        setIsVisible_Alert(false)
                    }, 3000);
                });
            }
        );
    };

    const save_changes = async () => {
        const data = doc(db, 'User Data', user.userInfo.id);
        await setDoc(data, {
            username: username_update
        }, { merge: true });
        setIsVisible_Alert(true)
        setTimeout(() => {
            setIsVisible_Alert(false)
        }, 3000);
    };

    const reverse_changes = () => {
        setUsername_update(details.username);
        setRead(true);
    };


    const handleEditClick = () => {
        setRead(false);
        inputRef.current.focus();
    };

    // Sign Out 
    const signOut_handle = () => {
        signOut(auth).then(() => {
            console.log("Sign-out successful.");


        }).catch((error) => {
            console.log(error);
        });
    }

    // Close Changes alert 
    const closeAlert = () => {
        setIsVisible_Alert(false);
    };



    return (

        <div>
            {
                loading ?
                    <div className="bg-[#6D28D9] w-full h-screen fixed top-0 left-0 flex justify-center items-center">
                        <div className="loader"></div>
                    </div>
                    :
                    <div className="bg-[#6D28D9] h-screen flex justify-center items-center">

                        {/* Changes alert  */}
                        {isVisible_Alert &&
                            <div className="z-10 cursor-pointer alert shadow-2xl p-3 rounded-lg bg-[#C5F3D7] border-l-8 border-green-400 show fixed right-3 top-5">
                                <span className="text-green-600"><FontAwesomeIcon icon={faCircleCheck} /></span>
                                <span className="px-3 msg text-green-600 font-semibold">Changes made Successfully</span>
                                <span onClick={closeAlert} className="text-green-600"><FontAwesomeIcon icon={faXmark} /></span>
                            </div>

                        }

                        <div className="bg-white px-3 rounded-2xl h-[450px] w-80 shadow_default_Profile">
                            <div className="relative flex justify-center items-center">
                                <button className="absolute top-3 text-xl left-2" onClick={(go_to_home) => navigate("/")}><FontAwesomeIcon icon={faXmark} /></button>
                                <img
                                    src={details.img_user ? details.img_user : defaultProfile}
                                    alt=""
                                    className={`shadow_default_Profile ${percentUpload >= 0 && percentUpload < 100 ? 'image-dark' : 'image-bright'} cursor-pointer h-32 my-5 w-32 rounded-full mx-auto object-contain`}
                                    onClick={() => document.getElementById('fileInput').click()}
                                />
                                <p className={`text-white font-bold absolute ${percentUpload > 99 ? "hidden" : "block"}`}>{percentUpload ? `${percentUpload.slice(0, 3)}%` : ""}</p>
                            </div>
                            <input accept="image/*" type="file" className="hidden" id="fileInput" onChange={handleFileChange} />
                            <p className="flex font-semibold my-3">
                                Name: <input type="text" readOnly={read} ref={inputRef} onChange={(e) => setUsername_update(e.target.value)} value={username_update} placeholder="Add Username" className="w-full ms-3 outline-none" />
                                <button><FontAwesomeIcon icon={faPen} className="px-2" onClick={handleEditClick} /></button>
                            </p>
                            <p className="flex font-semibold">Email:
                                <input type="email" readOnly defaultValue={details.email_user.length > 23 ? `${details.email_user.slice(0, 23)}...` : `${details.email_user}`} className="w-full ms-4 outline-none" placeholder="Add Email" />
                            </p>
                            {username_update != details.username ? (
                                <div className="my-10 flex justify-center">

                                    <button className="bg-[#6D28D9] w-32 h-12 rounded-lg me-3 text-white font-semibold p-3" onClick={save_changes}>Save Changes</button>
                                    <button className="bg-[#6D28D9] w-32 h-12 rounded-lg text-white font-semibold p-3" onClick={reverse_changes}>Cancel</button>
                                </div>
                            ) : ""}
                            <div className="flex justify-center items-center mt-10">
                                <button onClick={signOut_handle}
                                    className="mx-auto bg-[#6D28D9] w-32 h-12 rounded-lg text-white font-semibold p-3 hover:bg-[#5b22b3] transition-colors duration-300">
                                    Sign Out
                                </button>
                            </div>

                        </div>
                    </div>
            }
        </div>
    );
}

export default Profile;
