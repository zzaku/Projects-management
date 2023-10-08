import { Navigate } from "react-router";
import { useFirebase } from "../components/context/firebaseContext";

export const ProtectedRoute = ({ redirectPath = '/', children}) => {
    const {currentUserID} = useFirebase()

    if (!currentUserID) {
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};