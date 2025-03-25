import { useContext, useEffect } from "react";
import Basic from "../Login-Form";
import styles from "./login.module.css";
import { AppContext } from "../../context/AppContext";
import SuccessAlert from "../SuccessAlert";


export default function Login() {

    const { alert } = useContext(AppContext);


    useEffect(() => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("loginTime");
    }, [])

    return (
        <>
            <div className={styles.container}>
                <div className={styles.logoDiv}>
                    <img src='/logo.svg' alt='logo' />
                    <h2>devlinks</h2>
                </div>
                <div className={styles.main}>
                    <h1>Login</h1>
                    <p>Add your details below to get back into the app</p>
                    <Basic />
                </div>

                <div className={styles.alertDiv}>
                    {alert.visible && <SuccessAlert message={alert.message} />}
                </div>
            </div>
        </>
    )
}