import { useEffect, useRef, useState } from "react";
import styles from "./profileDetails.module.css";
import { get, ref, set } from "firebase/database";
import { database } from "../../firebase";

export default function ProfileDetails({ user, setUser, updateUser, showAlert }) {

    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({ firstName: false, lastName: false, email: false, image: false })
    const fileInputRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const extractExtension = base64 => base64.match(/data:image\/([a-zA-Z0-9]+);base64,/)?.[1];
                const extension = extractExtension(reader?.result);
                if (extension === "jpg" || extension === "jpeg" || extension == "png") {
                    setErrors({ ...errors, image: false });
                    setImage(reader.result);
                }
                else {
                    setErrors({ ...errors, image: true });
                    setImage(null)
                }

            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleSave = async () => {
        let newErrors = { ...errors };

        if (!image) newErrors.image = true;
        else newErrors.image = false;

        if (!firstNameRef?.current.value.trim()) newErrors.firstName = true;
        else newErrors.firstName = false;

        if (!lastNameRef?.current.value.trim()) newErrors.lastName = true;
        else newErrors.lastName = false;

        if (!emailRegex.test(emailRef.current.value.trim())) newErrors.email = true;
        else newErrors.email = false;

        setErrors(newErrors);

        if (!newErrors.firstName && !newErrors.lastName && !newErrors.image && !newErrors.email) {
            const userRef = ref(database, `users/${user.id}`);

            try {
                showAlert("User updated succesfully!")
                const updatedUserData = {
                    ...user,
                    firstName: firstNameRef.current.value,
                    lastName: lastNameRef.current.value,
                    email: emailRef.current.value,
                    image: image,
                    updatedAt: new Date().toISOString(),
                };

                await set(userRef, updatedUserData);

                updateUser(updatedUserData);

            } catch (error) {
                console.error("Error saving user data:", error.message);
            }
        }
    };


    useEffect(() => {
        if (user) {
            setImage(user?.image || "");
            if (firstNameRef.current) firstNameRef.current.value = user.firstName || "";
            if (lastNameRef.current) lastNameRef.current.value = user.lastName || "";
            if (emailRef.current) emailRef.current.value = user.email || "";
        }
    }, [user]);


    return (
        <>
            <div className={styles.container}>
                <h1>Profile Details</h1>
                <p>Add your details to create a personal touch to your profile.</p>

                <div className={styles.profilePhotoDiv}>
                    <p>Profile picture</p>
                    <div className={styles.uploadImageDiv} onClick={handleImageClick} style={{
                        backgroundImage: image ? `url(${image})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="p-2 border rounded"
                        />
                        <div className={`${styles.uploadImageText} ${image ? styles.changeImageText : null}`}>
                            <img src={image ? `/image-logo-white.svg` : `/image-logo.svg`} alt="Profile photo" />
                            <p>{image ? "Change image" : "+ Upload Image"}</p>
                        </div>
                    </div>
                    <div>
                        <p>Image must be below 1024x1024px. Use PNG or JPG format.</p>
                        {errors.image ? <p style={{ color: "red" }}>Format can be only PNG or JPG. Try again.</p> : null}
                    </div>
                </div>

                <div className={styles.infoDiv}>
                    <div className={`${styles.firstNameDiv} ${errors.firstName ? styles.haveError : null}`}>
                        <label>First name*</label>
                        <input placeholder="e.g. John" className={styles.infoInput} ref={firstNameRef} />
                    </div>

                    <div className={`${styles.lastNameDiv} ${errors.lastName ? styles.haveError : null}`}>
                        <label>Last name*</label>
                        <input placeholder="e.g. Appleseed" className={styles.infoInput} ref={lastNameRef} />
                    </div>

                    <div className={`${styles.emailDiv} ${errors.email ? styles.haveError : null}`}>
                        <label>Email</label>
                        <input placeholder="e.g. email@example.com" className={styles.infoInput} ref={emailRef} />
                    </div>
                </div>

                <hr></hr>
                <button className={styles.saveBtn} onClick={handleSave}>Save</button>
            </div>
        </>
    )
}