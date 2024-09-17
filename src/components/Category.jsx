function Category({category , isChoosen , onClick}) {
    
    return(
        <div onClick={onClick} className={`${isChoosen ? "bg-purple-700 text-white" : "bg-white text-purple-700 border" }  h-12 flex items-center justify-center font-semibold cursor-pointer hover:bg-purple-500 hover:text-white`}>{category.name}</div>
    )
}

export default Category