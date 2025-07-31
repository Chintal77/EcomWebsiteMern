import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../payment.css';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || '');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });
  const [retryOrder, setRetryOrder] = useState(null);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }

    const existingRetryOrder = JSON.parse(localStorage.getItem('retryOrder'));
    if (existingRetryOrder) {
      setRetryOrder(existingRetryOrder);
      localStorage.removeItem('retryOrder');
    }
  }, [shippingAddress, navigate]);

  const generateTransactionId = () =>
    'TXN' + Math.floor(100000 + Math.random() * 900000);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!paymentMethodName) {
      toast.error('❌ Please select a payment method');
      return;
    }

    if (paymentMethodName === 'Card') {
      const { number, expiry, cvv } = cardDetails;
      if (!number || !expiry || !cvv) {
        toast.error('❌ Please fill in all card details.');
        return;
      }
    }

    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const emailKey = userInfo?.email || 'guest';
    const ordersKey = `orders_${emailKey}`;
    const orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');

    if (orders.length === 0) {
      toast.error('❌ No orders found to update.');
      return;
    }

    const updatedOrders = orders.map((order) => {
      if (
        retryOrder &&
        JSON.stringify(order.items) === JSON.stringify(retryOrder.items) &&
        order.total === retryOrder.total &&
        order.date === retryOrder.date
      ) {
        return {
          ...order,
          status: 'Paid',
          paymentMode: paymentMethodName,
          transactionId: generateTransactionId(),
        };
      }

      if (!retryOrder && order === orders[orders.length - 1]) {
        return {
          ...order,
          status: 'Paid',
          paymentMode: paymentMethodName,
          transactionId: generateTransactionId(),
        };
      }

      return order;
    });

    localStorage.setItem(ordersKey, JSON.stringify(updatedOrders));
    toast.success('✅ Payment successful.....');
    navigate('/orders');
  };

  const paymentOptions = [
    { id: 'PayPal', label: 'PayPal', icon: '/icons/paypal.png' },
    { id: 'Stripe', label: 'Stripe', icon: '/icons/stripe.png' },
    { id: 'PhonePe', label: 'PhonePe', icon: '/icons/phonepe.png' },
    { id: 'GPay', label: 'GPay', icon: '/icons/gpay.png' },
    { id: 'Paytm', label: 'Paytm', icon: '/icons/paytm.png' },
    { id: 'Card', label: 'Credit/Debit Card', icon: '/icons/card.png' },
  ];

  return (
    <div>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Select Payment Method</h1>
        <Form onSubmit={submitHandler}>
          {paymentOptions.map((method) => (
            <div
              key={method.id}
              className={`payment-option ${
                paymentMethodName === method.id ? 'selected' : ''
              }`}
              onClick={() => setPaymentMethod(method.id)}
            >
              <Form.Check
                inline
                name="paymentMethod"
                type="radio"
                id={method.id}
                value={method.id}
                checked={paymentMethodName === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <img
                src={method.icon}
                alt={method.label}
                className="payment-icon"
              />
              <label htmlFor={method.id}>{method.label}</label>
            </div>
          ))}

          {paymentMethodName === 'Card' && (
            <div className="card-details">
              <Form.Group className="mb-3" controlId="cardNumber">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, number: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="expiry">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="cvv">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                />
              </Form.Group>
            </div>
          )}

          <div className="mb-3">
            <Button type="submit" className="w-100">
              Place Order
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
