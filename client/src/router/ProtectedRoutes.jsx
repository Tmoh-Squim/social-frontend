import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user?.user);
  const { loading } = useSelector((state) => state.user);

  if (loading === false) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }
};

export default ProtectedRoute;