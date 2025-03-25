// Render Prop
import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from "./form.module.css";
import { useNavigate } from 'react-router';
import { database, ref, set, push } from "../../firebase";
import { get } from 'firebase/database';
import { AppContext } from "../../context/AppContext.jsx"


const Basic = () => {

    const { users, setUser, getData, updateUser, showAlert } = useContext(AppContext);

    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    const [errors, setErrors] = useState({ email: null, password: null });

    return (
        <div>
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={async (values, { setSubmitting }) => {
                    if (users) {

                        if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                            setErrors({ ...errors, email: 'Invalid email address' });
                        }

                        else if (!values.password) {
                            setErrors({ ...errors, password: 'Please write password!' });
                        }
                        else {
                            for (let i in users) {
                                if (users[i].userData?.email === values.email && users[i].userData?.password === values.password) {
                                    showAlert("Logged in succesfully!")
                                    updateUser({ ...users[i].userData, id: users[i].userId });
                                    const currentTime = new Date().getTime(); // Cari zaman (millisaniyə)
                                    localStorage.setItem("loginTime", currentTime);
                                    setTimeout(() => {
                                        navigate("/");
                                    }, 3000);
                                    return;
                                }
                            }
                            alert("Account not found!")
                        }
                    }
                    else {
                        alert("Please wait!")
                    }

                }}
            >
                {({ isSubmitting }) => (
                    <Form className={styles.form}>
                        <div className={`${styles.emailDiv} ${errors.email ? styles.error : null}`}>
                            <h2>Email address</h2>
                            <div className={styles.input}>
                                <Field type="email" name="email" placeholder="e.g. alex@email.com" />
                                <img src="/email.svg" alt="logo" />
                                {errors.email ? <p>Can’t be empty</p> : null}
                            </div>
                        </div>
                        <div className={`${styles.passwordDiv} ${errors.password ? styles.error : null}`}>
                            <h2>Password</h2>
                            <div className={styles.input}>
                                <Field type="password" name="password" placeholder="Enter your password" />
                                <img src="/password.svg" alt="logo" />
                                {errors.password ? <p>{errors.password}</p> : null}
                            </div>
                        </div>
                        <button type="submit" disabled={isSubmitting} className={styles.loginButton}>
                            Login
                        </button>
                        <p className={styles.createButton}>Don’t have an account? <span onClick={() => { navigate("/signup") }}>Create account</span></p>
                    </Form>
                )}
            </Formik>
        </div >
    )
};

export default Basic;