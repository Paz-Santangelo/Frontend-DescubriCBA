import { useUser } from "../../context/UserContext";
import "./destinationsList.css";

const DestinationsList = () => {
  const { user } = useUser();
  const isLoggedIn = user && user.role;

  return (
    <div
      className={`destinations-container ${isLoggedIn ? "logged-in" : ""}`}
    >
      <h2 className="destinations-title">Seleccione un Destino</h2>
    </div>
  );
};

export default DestinationsList;
