
import React, { useEffect, useState } from "react";

const Checkbox = ({ categories , handleFilters}) => {
  const [checked, setChecked] = useState([]);

  const handleToggle = (c) => () => {
  const currentCategoryId = checked.indexOf(c._id);
    const newCheckedCategoryId = [...checked];

    if (currentCategoryId === -1) {
      newCheckedCategoryId.push(c._id);
    } else {
      newCheckedCategoryId.splice(currentCategoryId, 1);
    }

    console.log(newCheckedCategoryId);
    setChecked(newCheckedCategoryId);
    handleFilters(newCheckedCategoryId)
   
  };

  return categories.map((c, i) => (
    <li key={i} className="list-instyle">
      <input
        onChange={handleToggle(c)}
        // Use includes() method to check if the id is in the checked array
        checked={checked.includes(c._id)}
        type="checkbox"
        className="from-check-input"
      />
      <label className="form-check-label">{c.name}</label>
    </li>
  ));
};

export default Checkbox;
