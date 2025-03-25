import styles from "./userProfile.module.css";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router";

export default function UserProfile() {

    const { users } = useContext(AppContext);

    const navigate = useNavigate();

    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [links, setLinks] = useState({});
    const [loading, setLoading] = useState(true);

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
        for (let i in users) {
            if (users[i].userId === userId) {
                setUser(users[i].userData)
                setLinks(users[i].userData.links)
                setLoading(false);
                return
            }
        }
    }, [users]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 4000);
    }, [])

    return (
        <>
            <div className={styles.container}>
                <div className={styles.backgroundDiv}></div>
                <div className={styles.header}>
                    <button className={styles.shareBtn}>Share Link</button>
                </div>
                <div className={styles.userCard}>
                    {loading ? <img src="/loading.gif" alt="loading" className={styles.loading} /> :
                        <>
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
                        </>
                    }
                </div>
            </div>
        </>
    )
}