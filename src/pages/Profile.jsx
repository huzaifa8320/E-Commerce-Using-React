import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import defaultProfile from "../assets/defaultProfile.png";
import { useNavigate } from "react-router";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Profile() {
    const { user, setUser } = useContext(UserContext);
    const [details, setDetails] = useState();
    const [loading, setLoading] = useState(true);
    const [percentUpload, setPercentUpload] = useState();
    const [username_update, setUsername_update] = useState();
    const [read, setRead] = useState(true);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const storage = getStorage();

    useEffect(() => {
        const fetchData = async () => {
            if (user.isLogin) {
                console.log('user is login');
                const unsub = onSnapshot(doc(db, "User Data", user.userInfo.uid), (doc) => {
                    setDetails(doc.data());
                    setUsername_update(doc.data().username);
                    setLoading(false);
                });
            } else {
                console.log('user is not log');
            }
        };
        fetchData();
    }, [user, navigate]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                setPercentUpload(`${progress}`);
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log(downloadURL);
                    const data = doc(db, 'User Data', user.userInfo.uid);
                    await setDoc(data, {
                        img_user: downloadURL
                    }, { merge: true });
                    alert("Data updated successfully");
                });
            }
        );
    };

    const save_changes = async () => {
        const data = doc(db, 'User Data', user.userInfo.uid);
        await setDoc(data, {
            username: username_update
        }, { merge: true });
        alert("Username updated successfully");
    };

    const reverse_changes = () => {
        setUsername_update(details.username);
        setRead(true);
    };


    const handleEditClick = () => {
        setRead(false);
        inputRef.current.focus();
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
                        <div className="bg-white px-3 rounded-2xl h-[450px] w-80 shadow_default_Profile">
                            <div className="relative flex justify-center items-center">
                                <img
                                    src={details.img_user ? details.img_user : defaultProfile}
                                    alt=""
                                    className={`shadow_default_Profile ${percentUpload >= 0 && percentUpload < 100 ? 'image-dark' : 'image-bright'} cursor-pointer h-32 my-5 w-32 rounded-full mx-auto object-contain`}
                                    onClick={() => document.getElementById('fileInput').click()}
                                />
                                <p className={`text-white font-bold absolute ${percentUpload > 99 ? "hidden" : "block"}`}>{percentUpload ? `${percentUpload.slice(0, 3)}%` : ""}</p>
                            </div>
                            <input accept="image/*" type="file" className="hidden" id="fileInput" onChange={handleFileChange} />
                            <p className="border flex font-semibold my-3">
                                Name: <input type="text" readOnly={read} ref={inputRef} onChange={(e) => setUsername_update(e.target.value)} value={username_update} placeholder="Add Username" className="w-full ms-3 outline-none" />
                                <button><FontAwesomeIcon icon={faPen} className="px-2" onClick={handleEditClick} /></button>
                            </p>
                            <p className="border flex font-semibold">Email:
                                <input type="email" readOnly defaultValue={details.email_user.length > 23 ? `${details.email_user.slice(0, 23)}...` : `${details.email_user}`} className="w-full ms-4 outline-none" placeholder="Add Email" />
                            </p>
                            {username_update !== details.username ? (
                                <div className="my-10 flex justify-center">

                                    <button className="bg-[#6D28D9] w-32 h-12 rounded-lg me-3 text-white font-semibold p-3" onClick={save_changes}>Save Changes</button>
                                    <button className="bg-[#6D28D9] w-32 h-12 rounded-lg text-white font-semibold p-3" onClick={reverse_changes}>Cancel</button>
                                </div>
                            ) : ""}
                            <div className="border flex justify-center items-center mt-10">
                                <button
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
