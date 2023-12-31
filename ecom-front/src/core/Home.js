import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";
const Home = () => {

    const [productsBySell, setProductsBySell] = useState([])
    const [productsByArrival, setproductsByArrival] = useState([])
    const [error, setError] = useState(false)


    const loadProductsBySell = () => {
        getProducts('sold').then(data => {
            console.log("DATA<<<<<<<<<<<<<>>>>>>>>>>>>>>>",data);
            if (data.error) {
                setError(data.error)
            } else {
                setProductsBySell(data.products)
            }
        })
    }

    const loadProductsByArrival = () => {
        getProducts('createdAt').then(data => {
 console.log("arrival>>>>>>>>>>>>", data);
            if (data.error) {
                setError(data.error)
            } else {
                setproductsByArrival(data.products)
               
            }
        })
    }

    useEffect(() => {
        loadProductsByArrival()
        loadProductsBySell()
    }, [])

    return (<Layout title="Home Page" description="node React E-commrce App">
        <Search />
       <h2 className="mb-4">Best Sellers</h2>
      <div className="row">
      {productsBySell.map((product,i) => (
        <div  key={i} className="col-4 mb-3"> <Card  product={product}/> </div>
      ))}
     </div>
       <h2 className="mb-4">Best Arrivals</h2>
       <div className=" row">
       {productsByArrival.map((product,i) => (
         <div key={i} className="col-4 mb-3"> <Card  product={product}/> </div>
       ))}
       </div>
    </Layout>
    )
}
export default Home;