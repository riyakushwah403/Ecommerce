import React from "react";
import { API } from '../config';

const ShowImage= ({p,url}) =>{
return(<div className="product-image">

    {console.log("product photyo ::::::::::::",`${API}/${url}/photo/${p._id}`)}
    {p && 

    <img src={`${API}/${url}/photo/${p._id}`} alt={`product.name`} className=" mb-3" style={{maxHeight:'100%', maxWidth:'100%'}}></img>
    }
</div>)
}
export default ShowImage;