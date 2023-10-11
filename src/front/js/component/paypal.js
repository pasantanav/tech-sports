import React, { useContext, useState , useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import ReactModal from "react-modal";
import { Context } from "../store/appContext";

export default function PayPal(props) {
  useEffect(() => {
    console.log("monto", props.costo)
  }, [ ]);
  const { store, actions } = useContext(Context);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);


  // Esta función se llamará cuando el usuario haga clic en el botón de PayPal
  const createOrder = (data, action) => {
    return action.order.create({
      "purchase_units": [
        {
          "reference_id": 584,
          "description": "Attempt n.1 for Quote ID 1234",
          "amount": {
            "currency_code": "USD",
            "value":850,
            "breakdown": {
              "item_total": { "currency_code":"USD", "value":"850"},
              "shipping": { "currency_code":"USD", "value":"0"},
              "tax_total": { "currency_code":"USD", "value":"0"},
              "discount": { "currency_code":"USD", "value":"0"}
            }
          },
          "items": [
            {
              "name": "OnePlus 6 T-rex 12\" name for 14\"\" blabla \" more double quotes",
              "unit_amount": {
                "currency_code": "USD",
                "value":850
              },
              "tax": {
                "currency_code": "USD",
                "value": 0
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
      ]
,
    });
  };

  const onApprove = async (data) => {
    console.log("DATAL:", data)
    const { savePaymentInfo } = actions;
      const resp = await savePaymentInfo(
      //  "orderId": data.orderID,
      //  "payerId": data.payerID,
      //  "pid": data.paymentSourceID,
      //  "paymentId": data.paymentID
      data.orderID,
      data.payerID,
      data.paymentSourceID,
      data.paymentID
      ,props.index);

  console.log("exitoso")
    setIsSuccess(true);
  }

  const onCancel = (data, action) => {
    alert("onCancelData" + JSON.stringify(data))
    alert("onCancelActions" + JSON.stringify(action))
  }

  const onError = (data, action) => {
    console.log("onErrorData" + JSON.stringify(data))
    console.log("onErrorActions" + JSON.stringify(action))
    setIsError(true)
  }

  return (
    <>
    {isSuccess&&<div className="alert alert-success alert-dismissible fade show" role="alert">
      ¡Transaction completed!

  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>}
{isError&&<div className="alert alert-danger alert-dismissible fade show" role="alert">
      There was an error processing your payment

  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>}
<PayPalScriptProvider options={{ "client-id": process.env.PAYPAL_CLIENT_ID }}>
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} onCancel={onCancel} onError={onError} />
      
    </PayPalScriptProvider>
    </>
    
  );
};