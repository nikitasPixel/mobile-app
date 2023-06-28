import React, { useState } from "react";
import CategoryContext from "./CategoryContext";

const CategoryProvider = ({ children }) => {

    const [current_category, setCurrentCategory] = useState({name:"",id:"",parent:""});

    return (
        <CategoryContext.Provider value={{ current_category, setCurrentCategory }}>{children}</CategoryContext.Provider>
    );
}

export default CategoryProvider;