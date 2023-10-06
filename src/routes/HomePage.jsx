import React from "react";
import { useFirebase } from "../components/context/firebaseContext";
import { AuthUser } from "../components/auth/AuthUser";


export default function HomePage() {

const {needToConnect} = useFirebase()

    return(
        <div>
            {needToConnect && <AuthUser />}
            <h1>Bienvenue !</h1>
        </div>
    );
}