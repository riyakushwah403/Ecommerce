import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getCategories, list } from "./apiCore";
import Card from "./Card";

const Search = () => {

    const [data, setData] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false
    })
    const { categories, category, search, results, searched } = data
    const loadCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setData({ ...data, categories: data.category })
            }
        })
    }

    useEffect(() => {
        loadCategories()
    }, []);
    // const searchData = () => {
    //     if (search) {
    //         list({ search: search || undefined, category: category })
    //             .then(response => {
    //                 if (response.error) {
    //                     console.log(response.error);
    //                 } else {
    //                     setData({ ...data, results: response, searched: true })
    //                 }
    //             })
    //     }

    // };

    const searchData = () => {
        if (search) {
          list({ search: search || undefined, category: category })
            .then(response => {
              if (response && response.error) {
                console.log(response.error);
              } else {
                if (setData && typeof setData === "function") {
                  setData({ ...data, results: response, searched: true });
                } else {
                  console.log("setData is not a valid function.");
                }
              }
            })
            .catch(error => {
              console.log("Error occurred:", error);
            });
        } else {
          console.log("Search is empty.");
        }
      };
      

    const searchSubmit = (event) => {
        event.preventDefault()
        searchData();
    }
    const handleChange = (name) => (event) => {
        setData({ ...data, [name]: event.target.value, searched: false });
    }
    const searchMessage = (searched, results) => {
        if (searched && results.length > 0) {
            console.log("results??????????????",results)
            return `Found ${results.lenght} products`
        }
        if (searched && results.length < 1) {
            return `No products found`
        }

    }


    const searchedProducts = (results = []) => {
        return (
            <div>
                <h2 className="mt-4 mb-4"></h2>
                {searchMessage(searched, results)}
                <div className="row">
                    {results.map((product, i) => (<Card key={i} product={product} />))}
                </div>
            </div>
        )
    }

    const searchForm = () => {
        return (
            <form onSubmit={searchSubmit}>
                <span className="input-group-text">
                    <div className="input-group  input-group-lg">

                        <div className="input-group-prepend">

                            <select className="btn mr-2 " onChange={handleChange('category')}>
                                <option value="All">Pick Category</option>
                                {categories.map((c, i) => (<option key={i} value={c._id}>{c.name}</option>))}
                            </select>
                        </div>
                        <input type="search" className="form-control" onChange={handleChange("search")}
                            placeholder="Search Here" />
                    </div>
                    <div className="btn input-group-append" style={{ border: "none" }}>
                        <button className="input-group-text">Search</button>
                    </div>
                </span>
            </form>
        )
    }
    return (
        <div className="row">

            <div className="container"> {searchForm()}</div>
            <div className="container-fluid  mb-3">
                {searchedProducts(results)}</div>

        </div>
    );
};
export default Search;