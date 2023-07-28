import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCart, removeItem } from "./CartHelpers";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Checkout from "./Checkout";


const Cart = () => {
    const [items, setItems] = useState([])



    useEffect(() => {
        setItems(getCart());
    }, [])
    
    const showItems = items => {
        return (
            <div>
                <h2> Your Cart has {`${items.length}`} items</h2>
                <hr />
                {items.map((product, i) =>
                    <Card key={i} product={product}
                        showAddToCartButton={false}
                        cartUpdate={true}
                        showRemoveProductButton={true}
                        setItems={setItems}
                    />
                )}
            </div>
        )
    }
    const noItemsMessage = () => {
       return(
        <h2> Your Cart is Empty
        <br />
        <Link to="/shop"> Continue Shopping</Link>
    </h2>

       )
    }





    return (<Layout title="Shopping  cart"
        description="Manage your cart itemss ADD, REMOVE !!!"
        className="container-fluid">
        <div className="row">
            <div className="col-6">
                {items.length > 0 ? showItems(items) : noItemsMessage()}
            </div>
            <div className="col-6">
                <h2 className="mb-4">Your cart summary</h2>
                <hr />
                <Checkout products={items} />
            </div>
        </div>
    </Layout>

    )
}
export default Cart;