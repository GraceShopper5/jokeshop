import React from 'react'
import axios from 'axios'
import StripeCheckout from 'react-stripe-checkout'

// test
const STRIPE_PUBLISHABLE = 'pk_test_sgAizXIzyMiJy3bIT2C5N5D6'
const PAYMENT_SERVER_URL = 'http://localhost:8080'

// live
// const STRIPE_PUBLISHABLE = 'pk_live_MY_PUBLISHABLE_KEY'
// const PAYMENT_SERVER_URL = 'http://myapidomain.com'

const CURRENCY = 'USD'
const fromDollarToCent = amount => amount * 100

const successPayment = data => {
  alert('Payment Successful')
}

const errorPayment = data => {
  alert('Payment Error')
}

const onToken = (amount, description) => token =>
  axios
    .post(PAYMENT_SERVER_URL, {
      description,
      source: token.id,
      currency: CURRENCY,
      amount: fromDollarToCent(amount)
    })
    .then(successPayment)
    .catch(errorPayment)

const Checkout = ({name, description, amount}) => (
  <StripeCheckout
    name={name}
    description={description}
    amount={fromDollarToCent(amount)}
    token={onToken(amount, description)}
    currency={CURRENCY}
    stripeKey={STRIPE_PUBLISHABLE}
  />
)

export default Checkout
