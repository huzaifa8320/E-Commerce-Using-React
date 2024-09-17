import { Link } from "react-router-dom"

function ProductCard( {item}) {
    return (
        <Link to={`/productdetails/${item.id}`} className="lg:w-1/4 md:w-1/2 p-4 w-full  border hover:shadow-lg">
        <div className="">
            <span className=" h-48 rounded overflow-hidden flex justify-center">
                <img
                    alt="ecommerce"
                    className="object-cover object-center h-full block"
                src={item.thumbnail}
                />
            </span>
            <div className="mt-4">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                    {item.category.toUpperCase()}
                </h3>
                <h2 className="text-gray-900 title-font text-lg font-medium">
                    {item.title}
                </h2>
                <p className="mt-1">${item.price}</p>
            </div>
        </div>
        </Link>

    )
}

export default ProductCard