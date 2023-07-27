import React,{useEffect,useState,Fragment} from "react";

const Radiobox = ({prices ,handleFilters}) =>{
    const[value,setValues] = useState(0)
 const handlechange =(event)=>{
 handleFilters(event.target.value)
 setValues(event.target.value)
 }
    return prices.map((p, i) => (
        <div key={i} >
          <input
            onChange={handlechange}
            // Use includes() method to check if the id is in the checked array
      value={`${p._id}`} name={p}
            type="radio"
            className="mr-2 ml-4"
          />
          <label className="form-check-label">{p.name}</label>
        </div>
      ));
    };

export default Radiobox;