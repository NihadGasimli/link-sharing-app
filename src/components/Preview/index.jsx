import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import styles from "./preview.module.css";
import { useNavigate } from "react-router";

export default function Preview() {

    const { user, links, getLinksFromDb } = useContext(AppContext);
    const userProfileLink = `${window.location.origin}/user/${user.id}`;

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        getLinksFromDb()
    }, [])

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(userProfileLink);
            setCopied(true); 

            setTimeout(() => {
                setCopied(false);
            }, 3000); 
        } catch (err) {
            console.error("Kopyalama xətası:", err);
        }
    };


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

    return (
        <>
            <div className={styles.container}>
                <div className={styles.backgroundDiv}></div>
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={() => { navigate("/") }}>Back to Editor</button>
                    <button className={styles.shareBtn} onClick={handleShare}>Share Link</button>
                </div>

                {copied && <div className={styles.successAlert}>✅ Link Copied!</div>} {/* Uğur mesajı */}

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
                </div>
            </div>
        </>
    )
}