import React, { useContext, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import ReactModal from "react-modal";

export default function PayPal(props) {
  const { store, actions } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);

  // Esta función se llamará cuando el usuario haga clic en el botón de PayPal
  const createOrder = (data, action) => {
    return action.order.create({
      "purchase_units": [
        {
          "reference_id": 1234,
          "description": "Attempt n.1 for Quote ID 1234",
          "amount": {
            "currency_code": "USD",
            "value": 75.,
            "breakdown": {
              "item_total": { "currency_code": "USD", "value": "12" },
              "shipping": { "currency_code": "USD", "value": "1" },
              "tax_total": { "currency_code": "USD", "value": "1.4" },
              "discount": { "currency_code": "USD", "value": "0" }
            }
          },
          "items": [
            {
              "name": "OnePlus 6 T-rex 12\" name for 14\"\" blabla \" more double quotes",
              "unit_amount": {
                "currency_code": "USD",
                "value": 12
              },
              "tax": {
                "currency_code": "USD",
                "value": 1.4
              },
              "quantity": 1,
              "sku": "OnePlus61",
              "category": "PHYSICAL_GOODS"
            }
          ],
          "shipping": {
            "address": {
              "address_line_1": "Some line 1",
              "address_line_2": "Some line 2",
              "admin_area_2": "Some city",
              "admin_area_1": "some state",
              "postal_code": "12345",
              "country_code": "GB"
            }
          }
        }
      ],
    });
  };

  const onApprove = async ({ data }) => {
    console.log(data)
    const { savePaymentInfo } = actions;
    resp = await savePaymentInfo({
      orderId: data.orderID,
      payerId: data.payerID,
      paymentSourceId: data.paymentSourceID,
      paymentId: data.paymentID
    });

    setIsOpen(true);
  }

  const onCancel = (data, action) => {
    alert("onCancelData" + JSON.stringify(data))
    alert("onCancelActions" + JSON.stringify(action))
  }

  const onError = (data, action) => {
    console.log("onErrorData" + JSON.stringify(data))
    console.log("onErrorActions" + JSON.stringify(action))
  }

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.PAYPAL_CLIENT_ID }}>
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} onCancel={onCancel} onError={onError} />
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>¡Transacción Exitosa!</h2>
            <p>Gracias por su compra.</p>
            <button onClick={() => setIsOpen(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </PayPalScriptProvider>
  );
};