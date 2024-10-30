import { Link } from "react-router-dom"
import logo from "../assets/logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";


function Footer() {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // This adds a smooth scroll effect
        });
    };
    return (
        <div className="bg-[#6D28D9] pt-8 px-10 sm:px-16 w-full">
            <div className="grid sm:grid-cols-2 md:grid-cols-3">
                <div className="text-white flex flex-col gap-5 mx-auto">
                    <Link to={'/'} className="flex items-center me-auto min-w-40">
                        <div className="h-16 w-16">
                            <img src={logo} alt="logo" />
                        </div>
                        <div className="logo_name mx-1 ">
                            <p className='font-bold text-2xl'>MH Store</p>
                            <p className='font-semibold mb-0'>Your Own Store</p>
                        </div>
                    </Link>

                    <div className="font-bold text-[#6D28D9] gap-3 flex flex-wrap">
                        <button onClick={scrollToTop} className="bg-white w-36 h-10 rounded-full">Buy Now 🛒</button>
                        <Link className="bg-white w-36 h-10 rounded-full flex justify-center items-center">Watch Demo 📷</Link>
                    </div>

                    <div className="flex gap-3 ms-2">
                        <Link to={'https://www.linkedin.com/in/muhammadhuzaifa8320'} target="blank" className="border hover:scale-105 duration-75 text-white w-10 h-10 rounded-full flex justify-center items-center text-xl">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </Link>
                        <Link to={'https://github.com/huzaifa8320'} target="blank" className="border hover:scale-105 duration-75 text-white w-10 h-10 rounded-full flex justify-center items-center text-xl">
                            <FontAwesomeIcon icon={faGithub} />
                        </Link>
                    </div>

                </div>
                <div className="text-white font-semibold flex flex-col gap-3 mt-10 sm:mt-0">
                    <p className="text-2xl">Links</p>
                    <Link to={'/cart'}>
                        <p>Cart 🚚</p>
                    </Link>
                    <Link to={'/my_orders'}>
                        <p>My Orders 🚚</p>
                    </Link>
                    <Link to={'/profile'}>
                        <p>My Profile</p>
                    </Link>
                    <Link to={'/admin'}>
                        <p>Only For Admin 👨🏻‍💻</p>
                    </Link>
                </div>
                <div className="text-white min-w-48 max-w-full font-semibold mt-10 md:mt-0 flex flex-col gap-3 mx-auto">
                    <p className="text-2xl">Contact</p>
                    <Link className="max-w-72 break-words" to={'mailto:muhammadhuzaifa8320@gmail.com'}>
                        <p> muhammadhuzaifa8320@gmail.com</p>
                    </Link>
                    <Link to="https://wa.me/+923135909715" target="blank">
                        <p> +923135909715</p>
                    </Link>
                </div>
            </div>
            <div className="border-t text-white flex flex-col gap-3 text-center font-semibold p-5 mt-10">
                <h1>@2024 MH-Store 💖 All Right Reserved</h1>
                <Link to={'mailto:muhammadhuzaifa8320@gmail.com'}>Contact Developer ✨</Link>
            </div>
        </div>
    )
}

export default Footer