import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
export default function PayPal(props) {

  // Esta función se llamará cuando el usuario haga clic en el botón de PayPal
  const createOrder = (data, actions) => {
    return actions.order.create({
      "purchase_units": [
        {
          "reference_id": 1234,
          "description": "Attempt n.1 for Quote ID 1234",
          "amount": {
            "currency_code": "USD",
            "value": 14.4,
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
  const onApprove = (data, actions) => {
    console.log({ data })
    console.log({ actions })
  }
  const onCancel = (data, actions) => {
    alert("onCancelData" + JSON.stringify(data))
    alert("onCancelActions" + JSON.stringify(actions))
  }
  const onError = (data, actions) => {
    console.log("onErrorData" + JSON.stringify(data))
    console.log("onErrorActions" + JSON.stringify(actions))
  }

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.PAYPAL_CLIENT_ID }}>

      <PayPalButtons createOrder={createOrder} onApprove={onApprove} onCancel={onCancel} onError={onError} />
    </PayPalScriptProvider>
  );
};