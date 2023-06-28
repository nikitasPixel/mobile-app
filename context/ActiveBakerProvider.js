import React, {useState} from "react";
import ActiveBakerContext from "./ActiveBakerContext";

const ActiveBakerProvider = ({ children }) => {

    const [active_baker, setActiveBaker] = useState({id: null, remote_id: null, first_name: "", last_name: ""});

    return (
        <ActiveBakerContext.Provider value = {{active_baker, setActiveBaker}}>{children}</ActiveBakerContext.Provider>
    );
}

export default ActiveBakerProvider;