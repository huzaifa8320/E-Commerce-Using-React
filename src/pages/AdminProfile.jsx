import { updateProfile, onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { auth, storage } from "../utils/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faPen, faUser } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Image } from "antd";
import { Link } from "react-router-dom";

function AdminProfile() {
    const [admin_data, setAdmin_Data] = useState(null);
    const [read, setRead] = useState(true);
    const inputRef = useRef(null);
    const [username, setUsername] = useState("");
    const [updateTrigger, setUpdateTrigger] = useState(false); // New state to trigger useEffect
    const [previewImage, setPreviewImage] = useState(null); // Added state for image preview
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user_real) => {
            if (user_real) {
                setAdmin_Data(user_real);
                setUsername(user_real.displayName || "");
            }
        });
        return () => unsubscribe();
    }, [updateTrigger]); // Add updateTrigger as a dependency

    const handleEditClick = () => {
        setRead(false);
        inputRef.current.focus();
    };

    const handleSaveClick = () => {
        updateProfile(auth.currentUser, {
            displayName: username,
        })
            .then(() => {
                setUpdateTrigger(!updateTrigger); // Toggle updateTrigger to rerun useEffect
            })
            .catch((error) => {
                console.error(error);
            });
        setRead(true);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);

            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);


            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                    console.log("Upload is " + progress + "% done");
                },
                (error) => {
                    console.error("Upload failed:", error);
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log("File available at", url);
                    setUploadProgress(0);



                    updateProfile(auth.currentUser, {
                        photoURL: url
                    })
                        .then(() => {
                            setUpdateTrigger(!updateTrigger);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            );
        }
    };

    return (
        <div className="bg-[#214162] h-screen w-full relative flex justify-center items-center">
            <Link to={'/admin/orders'} className="absolute z-10 top-0 left-0 sm:text-white m-5 text-2xl"><FontAwesomeIcon icon={faAnglesLeft} /></Link>
            <div className="bg-white h-screen w-full sm:w-[350px] sm:h-[450px] sm:rounded-md flex flex-col items-center p-4">
                <div className="w-full mt-3 flex justify-center relative items-center">
                    {previewImage || admin_data?.photoURL ? (
                        <Image
                            src={previewImage || admin_data.photoURL}
                            alt="Admin"
                            style={{ width: '176px', height: '176px' }}
                            className="object-cover shadow rounded-full"
                        />
                    ) : (
                        <div className="rounded-full border justify-center w-44 h-44 relative items-center flex">
                            <FontAwesomeIcon icon={faUser} className="text-gray-400 cursor-pointer text-6xl" />
                        </div>
                    )}
                    <div className="absolute top-0 right-2 w-5 flex cursor-pointer">
                        <input
                            type="file"
                            className="w-full cursor-pointer absolute inset-0 opacity-0 h-full"
                            onChange={handleImageChange}
                        />
                        <button className="cursor-pointer">
                            <FontAwesomeIcon icon={faPen} />
                        </button>
                    </div>
                </div>
                <div className="mt-5 font-semibold w-full flex items-center">
                    <label className="mr-2">Name:</label>
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        ref={inputRef}
                        type="text"
                        readOnly={read}
                        className="outline-none flex-grow border-b border-gray-300"
                        value={username}
                    />
                    <FontAwesomeIcon className="cursor-pointer ml-2" onClick={handleEditClick} icon={faPen} />
                </div>
                <div className="mt-2 font-semibold w-full">Email: {admin_data?.email}</div>
                {uploadProgress > 0 && (
                    <div className="my-5">
                        <p>Upload Progress: {Math.round(uploadProgress)}%</p>
                        <progress value={uploadProgress} max="100" />
                    </div>
                )}
                {username !== admin_data?.displayName && (
                    <button
                        onClick={handleSaveClick}
                        className="mt-4 px-4 py-2 bg-[#214162] text-white rounded-md"
                    >
                        Save
                    </button>
                )}
            </div>
        </div>
    );
}

export default AdminProfile;
