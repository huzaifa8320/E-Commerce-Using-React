import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import googleLogo from '../assets/google_logo.png';


function Login() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [eye, setEye] = useState(true)
    const [error_Alert_Text, setError_Alert_Text] = useState("")

    const navigate = useNavigate()

    const showEye = () => {
        eye ? setEye(false) : setEye(true)
    }

    // Check User Login 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user_real) => {
            if (user_real) {
                navigate("/");
            }
        });
        return () => unsubscribe(); 
    }, [navigate]);
    

    // Sign up with email 
    const signup = () => {
        createUserWithEmailAndPassword(auth, email, pass)
            .then(async (userCredential) => {
                // Signed up 
                const user = userCredential.user;

                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/invalid-email') {
                    setError_Alert_Text("Please Enter a valid Email");
                }
               else if (errorCode === 'auth/missing-password') {
                    setError_Alert_Text("Please Enter Password");
                }
               else if (errorCode === 'auth/weak-password') {
                    setError_Alert_Text("Password At least 6 word");
                }

                setTimeout(() => {
                    setError_Alert_Text('')
                }, 3000);
                // ..
            });
    }


    // Google account
    const handleSignInWithGoogle = () => {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;

            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });

    }
    const closeWarningAlert = () => {
        setError_Alert_Text('')
    }

    return (
        <div className="flex justify-center overflow-auto h-screen bg-gradient-to-r from-[#6c28d9d2] to-[#6D28D9]">
            {/* Changes alert Error  */}
            {error_Alert_Text &&
                <div className="z-10 cursor-pointer alert shadow-2xl p-3 rounded-lg bg-[#FEDA9E] border-l-8 border-[#FEA601] show fixed right-3 top-5">
                    <span className="text-[#DA7F0B]"><FontAwesomeIcon icon={faCircleExclamation} /></span>
                    <span className="px-3 msg text-[#BE9049] font-semibold">{error_Alert_Text}</span>
                    <span onClick={closeWarningAlert} className="text-[#DA7F0B]"><FontAwesomeIcon icon={faXmark} /></span>
                </div>

            }
            <div className="w-[420px] m-auto flex flex-col justify-center rounded-2xl bg-white max-[400px]:bg-[#6D28D9] max-[400px]:text-white max-[400px]:rounded-none shadown_default_login h-[550px] max-[400px]:h-screen px-8">
                <div className="flex relative">
                    <Link to={"/"} className="text-3xl absolute borde text-center font-semibold"><FontAwesomeIcon icon={faXmark} className="text-xl" /></Link>
                    <h1 className="text-3xl text-center font-bold mb-3 mx-auto">Sign up</h1>
                </div>
                <form>
                    {/* Username  */}
                    <div className="div_email bg-[#F3F4F6] my-5 rounded-lg h-12 ps-3 flex items-center">
                        <input onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" className="text-[#7a808b] bg-transparent outline-none font-semibold  w-full placeholder:text-[#9CA3AF]" />
                    </div>
                    {/* Email  */}
                    <div className="div_email bg-[#F3F4F6] my-5 rounded-lg h-12 ps-3 flex items-center">
                        <input onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="Email" className="text-[#7a808b] bg-transparent outline-none font-semibold  w-full placeholder:text-[#9CA3AF]" />
                    </div>
                    {/* Password  */}
                    <div className="div_email bg-[#F3F4F6] my-5 rounded-lg h-12 ps-3 flex items-center">
                        <input onChange={(e) => setPass(e.target.value)} type={eye ? "password" : "text"} autoComplete="current-password" placeholder="Password" className="text-[#7a808b]  bg-transparent outline-none font-semibold  w-full placeholder:text-[#9CA3AF]" />
                        <button type="button" onClick={showEye}><FontAwesomeIcon icon={eye ? faEye : faEyeSlash} color="#7433DB" className="px-3" /></button>
                    </div>
                </form>
                <div className="flex flex-col gap-2">
                    <button className="bg-[#7331DA] max-[400px]:bg-white max-[400px]:text-[#6D28D9] text-white p-3 my-2 font-semibold rounded-lg" onClick={signup}>Signup</button>
                    <p className="text-[#808080] font-semibold text-center my-3 max-[400px]:text-white">Already have an account?
                        <Link to='/Login' className="text-[#6c28d9d2] ms-1 max-[400px]:text-white underline">Login</Link>
                    </p>
                    <div className="flex relative justify-center items-center">
                        <p className="border border-[#C7C7C7] w-full absolute"></p>
                        <p className="bg-white px-2 text-xl z-0 text-[#808080] max-[400px]:bg-[#6D28D9] max-[400px]:text-white mb-1 font-semibold">or</p>
                    </div>
                    <button className="bg-[#F3F4F6] relative text-[#808080] font-semibold p-3 rounded-lg my-3 flex items-center" onClick={handleSignInWithGoogle}>
                        <img src={googleLogo} alt="img" className="absolute w-10 max-[400px]:w-8 max-[400px]:h-8 h-10" />
                        <p className="mx-auto">Continue With Google</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login;