import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const PaypalModal =()=>{
    return(
        <>        <div id="paypal-button" ></div>
        <button type="button" className="primary" data-toggle="modal" data-target="#exampleModal" style="justify-tracks: left;">
          Pagar
        </button>
        <div className="modal fade" id="basicModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">X</button>
                        <h4 className="modal-title" id="myModalLabel">Terms and Conditions for Registration</h4>
                        </div>
                        <div className="modal-body">
                            <h3>Insert terms and conditions here</h3>
                        </div>
                        <div className="modal-footer">
                            <center>
                            <PayPalButtons/>
                            <PayPalScriptProvider/>
                            </center>
                        </div>
                    </div>
                </div>
        </div>
        </>

    );
}
export default PaypalModal;