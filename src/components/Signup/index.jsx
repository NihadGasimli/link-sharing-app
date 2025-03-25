import { useContext } from "react";
import Create from "../Signup-Form";
import styles from "./signup.module.css";
import { AppContext } from "../../context/AppContext";
import SuccessAlert from "../SuccessAlert";


export default function Signup() {

    const { alert } = useContext(AppContext);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.logoDiv}>
                    <img src='/logo.svg' alt='logo' />
                    <h2>devlinks</h2>
                </div>
                <div className={styles.main}>
                    <h1>Create account</h1>
                    <p>Let’s get you started sharing your links!</p>
                    <Create />
                </div>

                <div className={styles.alertDiv}>
                    {alert.visible && <SuccessAlert message={alert.message} />}
                </div>
            </div>
        </>
    )
}