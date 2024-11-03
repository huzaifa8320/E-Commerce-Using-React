import { Link } from "react-router-dom"

function ProductCard( {item}) {
    return (
        <Link to={`/productdetails/${item.id}`} data-aos="zoom-in" className="mx-auto p-4 w-72 border hover:shadow-lg">
        <div className="">
            <span className="h-48 rounded overflow-hidden flex justify-center">
                <img
                    alt="ecommerce"
                    className="object-cover w-full h-full "
                    src={`${item.image}`} 
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