



import { useEffect } from "react";



import { useLocation } from "react-router-dom";


// import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/styles/adyen.css";


export default function Checkout() {



const { state } = useLocation();



const session = state?.session;



  console.log("SESSION:", session);



  useEffect(() => {



let dropin: any;



    async function init() {



      if (!session) {



        console.error("No Adyen session found");



        return;



      }



      try {



        console.log("Initializing Adyen Checkout...");



const checkout = await AdyenCheckout({



          environment: "test",



          clientKey: "test_QZE5U3YA3REU3GDBMGUG4CYGIITZWBS5",



          session,



        });



        console.log("Adyen Checkout initialized");



        dropin = checkout.create("dropin");



        dropin.mount("#dropin-container");



        console.log("Adyen Drop-in mounted");



      } catch (error) {



        console.error("Adyen Checkout initialization failed:", error);



      }



    }



    init();



    return () => {



      if (dropin) {



        dropin.unmount();



      }



    };



  }, [session]);



  return (



    <div className="min-h-screen flex items-center justify-center bg-gray-50">



      <div id="dropin-container" className="w-full max-w-md" />



    </div>



  );



}

function AdyenCheckout(arg0: { environment: string; clientKey: string; session: any; }) {
    throw new Error("Function not implemented.");
}
