import React from 'react';
import {Button} from 'antd';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const generateUniqueId = () => {
    const now = Date.now();  // Gets the current timestamp in milliseconds

    // Generate the UUID
    const uniqueId = uuidv4();

    // Concatenate the components
    return `${now}-${uniqueId}`;
};

const ButtonVis: React.FC = () => {


    const navigate = useNavigate();

    const handleClick = () => {
        // Handle navigation to the main page
        //console.log('Entering Main Page');
        //alert("a");
        window.localStorage.removeItem("author")
        window.localStorage.removeItem("title")
        const uniqueId = generateUniqueId();
        navigate("/story-editor/"+uniqueId);
    };

    return (
        <Button
            type="primary"
            style={{paddingTop:'10px', paddingBottom:'30px', marginBottom:'50px'}}
            onClick={() => handleClick()}
        >
            <b> Create your visualization story </b>
        </Button>
);
};

export default ButtonVis;