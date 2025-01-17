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
  const modalPay = document.getElementById('exampleModal');

  // Esta función se llamará cuando el usuario haga clic en el botón de PayPal
  const createOrder = (data, action, datos) => {
    console.log("revisando el store 2", datos )
    return action.order.create({
      "purchase_units": [
        {
          "reference_id": 584,
          "description":datos?.description,
          "amount": {
            "currency_code": "USD",
            "value":datos.total,
            "breakdown": {
              "item_total": { "currency_code":"USD", "value":datos.total},
              "shipping": { "currency_code":"USD", "value":"0"},
              "tax_total": { "currency_code":"USD", "value":"0"},
              "discount": { "currency_code":"USD", "value":"0"}
            }
          },
          "items": [
            {
              "name":datos?.description,
              "unit_amount": {
                "currency_code": "USD",
                "value":datos.total / datos.quantity
              },
              "tax": {
                "currency_code": "USD",
                "value": 0
              },
              "quantity": datos.quantity,
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
    const monto = store.currentPaypal.total;
    const cantidad = store.currentPaypal.quantity;
    const idEvento = store.currentPaypal.idEvento;
    console.log("DATOS:", monto, cantidad, idEvento);
    const { savePaymentInfo } = actions;
    const resp = await savePaymentInfo(
      data.orderID,
      data.payerID,
      data.paymentID,
      monto,
      cantidad,
      idEvento,
      props.index);

    alert("Pago Exitoso");
    const modal = bootstrap.Modal.getInstance(modalPay);
    modal.hide();
    modalPay.addEventListener('hidden.bs.modal', () => {
      modal.dispose();
    }, {once:true});

    setIsSuccess(true);
  }

  const onCancel = (data, action) => {
    alert("Pago Cancelado" + JSON.stringify(data))
    //alert("onCancelActions" + JSON.stringify(action))
  }

  const onError = (data, action) => {
    console.log("Error en datos" + JSON.stringify(data))
    //console.log("onErrorActions" + JSON.stringify(action))
    setIsError(true)
  }

  return (
    <>
    {isSuccess&&<div className="alert alert-success alert-dismissible fade show" role="alert">
      

  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>}
{isError&&<div className="alert alert-danger alert-dismissible fade show" role="alert">
      Hubo un error al procesar el pago

  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>}
<PayPalScriptProvider options={{ "client-id": process.env.PAYPAL_CLIENT_ID }}>
      <PayPalButtons createOrder={(data, action)=>createOrder(data, action,{"description":store.currentPaypal.description,"total":store.currentPaypal.total,"quantity":store.currentPaypal.quantity})} onApprove={onApprove} onCancel={onCancel} onError={onError} />
      
    </PayPalScriptProvider>
    </>
    
  );
};