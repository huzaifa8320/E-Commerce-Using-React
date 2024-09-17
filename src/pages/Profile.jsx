import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import defaultProfile from "../assets/defaultProfile.png";
import { useNavigate } from "react-router";

function Profile() {
    const { user, setUser } = useContext(UserContext)
    const [details, setDetails] = useState()
    const [loading, setLoading] = useState(true)
    const [percentUpload, setPercentUpload] = useState()
    const navigate = useNavigate()
    console.log("details", details);
    const storage = getStorage();

    useEffect(() => {
        const fetchData = async () => {
            if (user.isLogin) {
                console.log('user is login');
                console.log("userInfo", user.userInfo.uid);
                const unsub = onSnapshot(doc(db, "User Data", user.userInfo.uid), (doc) => {
                    console.log("Current data: ", doc.data());
                    setDetails(doc.data())
                    setLoading(false)
                });


            }
            else {
                console.log('user is not log');
            }
        };
        fetchData();
    }, [user, navigate]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log(file.name);

        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);


        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                setPercentUpload(`${progress}`)
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

                });
            }
        );
        // starr 



    };

    return (
        <div>

            {
                loading ?
                    <div className="bg-[#6D28D9] w-full h-screen fixed top-0 left-0 flex justify-center items-center">
                        < div className="loader" ></div >
                    </div >
                    :
                    <div className="bg-[#6D28D9] h-screen flex justify-center items-center">
                        <div className="bg-white rounded-2xl h-[450px] w-80 shadown_default_Profile">
                            <div className="relative flex justify-center items-center">
                                <img src={details.img_user ? details.img_user : defaultProfile} alt="" className={`shadown_default_Profile ${percentUpload <= 99 && percentUpload == 0 ? 'image-dark' : 'image-bright'} cursor-pointer h-32 my-5 w-32 rounded-full mx-auto object-contain`} onClick={() => document.getElementById('fileInput').click()} />
                                <p className={`text-white font-bold absolute ${percentUpload > 99 ? "hidden" : "block"}`}>{percentUpload ? `${percentUpload.slice(0, 3)}%` : ""}</p>
                            </div>
                            <input accept="image/*" type="file" className="hidden" id="fileInput" onChange={handleFileChange} />
                            <p className="border">Name: <input type="text" defaultValue={details.username ? details.username : "Add Username"}/></p>
                            <p>Email: {details.email_user}</p>
                        </div>
                    </div>

            }
        </div>
    )
}


export default Profile;