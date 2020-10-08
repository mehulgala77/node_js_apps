
import React, { useState } from 'react';
import './App.css';
import StripeCheckout from 'react-stripe-checkout'

function App() {

  const [product, setProduct] = useState({
    name: 'React JS from FB',
    price: 10,
    productBy: 'Facebook'
  })

  const handlePayment = async token => {

    const body = {
      token,
      product
    }

    const headers = {
      'Content-Type': 'application/json'
    }

    try {
    
      const response = await fetch('http://localhost:8282/payment', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })

      console.log(response);

    } catch (err) {
      console.log(err);
    }

   }

   {/* Note: Use Env Variable in React */}
   console.log(process.env.REACT_APP_PUBLISHABLE_KEY);
   
  return (
    <div className="App">
      <header className="App-header">

        <h1>React JS from FB</h1>

        {/* Note: Show Stripe Payment Button */}
        <StripeCheckout 
          stripeKey={process.env.REACT_APP_PUBLISHABLE_KEY}
          token={handlePayment}
          name="Buy React"
          amount={product.price * 100}
        >
        {/* Note: Change the Stripe Payment Button */}
          <button className="btn-large blue">
            Buy React in Just {product.price}$
          </button>

        </StripeCheckout>

      </header>
    </div>
  );
}

export default App;
