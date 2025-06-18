import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useRef } from "react";
import styles from "./preview.module.css";
import { useNavigate } from "react-router";
import { QRCodeCanvas } from "qrcode.react";


export default function Preview() {

    const { user, links, getLinksFromDb } = useContext(AppContext);
    const userProfileLink = `${window.location.origin}/user/${user.id}`;

    const [showQrModal, setShowQrModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const modalRef = useRef(null);


    useEffect(() => {
        getLinksFromDb()
    }, [])

    const navigate = useNavigate();

    const platforms = [
        { name: "GitHub", lower: "github", src: "/github-logo-white.svg" },
        { name: "YouTube", lower: "youtube", src: "/youtube-logo-white.svg" },
        { name: "LinkedIn", lower: "linkedin", src: "/linkedin-logo-white.svg" },
        { name: "Facebook", lower: "facebook", src: "/facebook-logo-white.svg" },
        { name: "Twitter", lower: "twitter", src: "/twitter-logo-white.svg" },
        { name: "Twitch", lower: "twitch", src: "/twitch-logo-white.svg" },
        { name: "Dev.to", lower: "devto", src: "/devto-logo-white.svg" },
        { name: "CodeWars", lower: "codewars", src: "/codewars-logo-white.svg" },
        { name: "FreeCodeCamp", lower: "freecodecamp", src: "/freecodecamp-logo-white.svg" },
        { name: "GitLab", lower: "gitlab", src: "/gitlab-logo-white.svg" },
        { name: "HashNode", lower: "hashnode", src: "/hashnode-logo-white.svg" },
        { name: "StackOverflow", lower: "stackoverflow", src: "/stackoverflow-logo-white.svg" }
    ];

    const handleClickOpen = (link) => {
        window.open(link, "_blank");
    };

    useEffect(() => {
        if (showQrModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showQrModal]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowQrModal(false);
            }
        };

        if (showQrModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showQrModal]);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.backgroundDiv}></div>
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={() => { navigate("/") }}>Back to Editor</button>
                    <div className={styles.shareButtons}>
                        <button className={styles.shareBtn} onClick={() => setShowQrModal(true)}>Share</button>
                    </div>
                </div>

                <div className={styles.userCard}>
                    <img src={user?.image} alt="" className={styles.userImage} />
                    <h1>{user?.firstName} {user?.lastName}</h1>
                    <p className={styles.email} onClick={() => {
                        window.location.href = `mailto:${user?.email}`;
                    }}>{user?.email}</p>
                    <div className={styles.links}>
                        {
                            links && Object.keys(links).length > 0
                                ? Object.entries(links).map(([key, value], index) => {
                                    if (value?.platform) {
                                        const platform = platforms.find(
                                            (platform) => platform.lower.toLowerCase() === value.platform.toLowerCase()
                                        );

                                        const selectedPlatformName = platform ? platform.name : "";

                                        return (
                                            <button
                                                key={`link-${key}`}
                                                onClick={() => handleClickOpen(value.link)}
                                                className={`${styles.linkBtn} ${styles[value?.platform + "Btn"]}`}
                                            >
                                                {platform ? <img src={platform.src} alt={value.platform} /> : null}
                                                {selectedPlatformName}
                                                <img src='/arrow-right.svg' alt='' className={styles.arrowRight} />
                                            </button>
                                        );
                                    } else {
                                        return <button key={index} className={styles.linkBtn} disabled></button>;
                                    }
                                })
                                : null
                        }
                    </div>
                    {showQrModal && (
                        <div className={styles.qrModalOverlay}>
                            <div className={styles.qrModal} ref={modalRef}>
                                <button className={styles.closeBtn} onClick={() => setShowQrModal(false)}>✖</button>
                                <h2>Scan the QR Code</h2>
                                <QRCodeCanvas value={userProfileLink} size={200} />
                                <p className={styles.linkText}>{userProfileLink}</p>
                                <button className={styles.copyBtn} onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(userProfileLink);
                                        setCopySuccess(true);
                                        setTimeout(() => setCopySuccess(false), 2000);
                                    } catch (err) {
                                        console.error("Kopyalama xətası:", err);
                                    }
                                }}>
                                    {copySuccess ? "✅ Copied!" : "📋 Copy Link"}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}