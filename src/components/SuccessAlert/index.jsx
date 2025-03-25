import { CheckCircle } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { useContext } from "react";
import styles from "./successalert.module.css";

const SuccessAlert = () => {
  const { alert, showAlert } = useContext(AppContext);

  // If the alert is not visible, don't render anything
  if (!alert.visible) return null;

  // Destructure message from the alert object
  const { message } = alert;

  return (
    <div className={styles.successAlert}>
      <CheckCircle className={styles.icon} />
      <p className={styles.successAlertText}>{message}</p>
    </div>
  );
};

export default SuccessAlert;
