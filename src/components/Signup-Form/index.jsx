// Render Prop
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from "./form.module.css";
import { useNavigate } from 'react-router';
import { database, ref, set, push } from "../../firebase";
import { get } from 'firebase/database';
import { AppContext } from '../../context/AppContext';


const Create = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({ email: null, password: null });

    const { users, showAlert } = useContext(AppContext);

    return (
        <div>
            <Formik
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validate={values => {
                    setErrors(prevErrors => {
                        const newErrors = { ...prevErrors };

                        if (values.password.length < 8 && values.password) {
                            newErrors.password = "Password must be at least 8 characters";
                        } else if (values.password !== values.confirmPassword && values.confirmPassword) {
                            newErrors.password = "Please check again";
                        } else {
                            newErrors.password = null; // Əgər error yoxdursa, onu state-dən sil
                        }

                        if (values.email) {
                            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                newErrors.email = { invalid: "Invalid email address" };
                            } else {
                                newErrors.email = null; // Əgər error yoxdursa, onu state-dən sil
                            }
                        } else {
                            newErrors.email = null; // Əgər error yoxdursa, onu state-dən sil
                        }

                        return newErrors;
                    });
                }}
                onSubmit={async (values, { }) => {
                    if (!errors.email && !errors.password) {

                        for (let i in users) {
                            if (values.email === users[i].userData.email) {
                                alert("An account exists with this email.")
                                return;
                            }
                        }

                        try {
                            const newUserRef = push(ref(database, "users"));

                            await set(newUserRef, {
                                email: values.email,
                                password: values.password,
                                createdAt: new Date().toISOString(),
                            });
                            showAlert("User registered succesfully!")
                            setTimeout(() => {
                                navigate("/login");
                            }, 3000);
                        } catch (error) {
                            console.error("Error saving user data:", error.message);
                        }
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form className={styles.form}>
                        <div className={`${styles.emailDiv} ${errors.email ? styles.error : ''}`}>
                            <h2>Email address</h2>
                            <div className={styles.input}>
                                <Field type="email" name="email" placeholder="e.g. alex@email.com" />
                                <img src="/email.svg" alt="logo" />
                                {errors.email && <p>{errors.email.invalid}</p>}
                            </div>
                        </div>

                        <div className={`${styles.passwordDiv} ${errors.password ? styles.error : ''}`}>
                            <h2>Create password</h2>
                            <div className={styles.input}>
                                <Field type="password" name="password" placeholder="Password" />
                                <img src="/password.svg" alt="logo" />
                                {errors.password && <p>{errors.password}</p>}
                            </div>
                        </div>

                        <div className={`${styles.confirmPasswordDiv} ${errors.password ? styles.error : ''}`}>
                            <h2>Confirm password</h2>
                            <div className={styles.input}>
                                <Field type="password" name="confirmPassword" placeholder="Confirm Password" />
                                <img src="/password.svg" alt="logo" />
                                {errors.password && <p>{errors.password}</p>}
                            </div>
                        </div>

                        <p className={styles.passwordAware}>Password must contain at least 8 characters</p>
                        <button type="submit" disabled={isSubmitting} className={styles.createButton}>
                            Create new account
                        </button>
                        <p className={styles.loginButton}>
                            Already have an account? <span onClick={() => navigate("/login")}>Login</span>
                        </p>
                    </Form>
                )}
            </Formik>

        </div>
    )
};

export default Create;