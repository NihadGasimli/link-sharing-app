import { useContext, useEffect, useState } from 'react';
import styles from "./app.module.css";
import AddLinks from './components/AddLinks';
import { AppContext } from "./context/AppContext";
import ProfileDetails from './components/ProfileDetails';
import { useNavigate } from 'react-router';
import SuccessAlert from './components/SuccessAlert';

export default function App() {
  const [whichPage, setWhichPage] = useState("links");
  const { links, handleChange, handleRemove, setLinks, setCardCounter, handleClick, cardCounter, user, setUser, saveLinksToDb, getLinksFromDb, updateUser, alert, setAlert, showAlert } = useContext(AppContext);

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

  const checkSession = () => {
    const loginTime = sessionStorage.getItem("loginTime");
    if (loginTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - parseInt(loginTime, 10);

      if (elapsedTime > 60 * 15 * 1000) {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("loginTime");
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    checkSession();
    const timer = setInterval(checkSession, 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login")
    };
  }, [])

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <ul>
          <li className={styles.navbarLogo}>
            <img src='/logo.svg' alt='logo' />
            <h2>devlinks</h2>
          </li>

          <li className={styles.navbarLinksAndProfile}>
            <div className={`${styles.navbarLinks} ${whichPage === "links" ? styles.selected : ""}`}
              onClick={() => setWhichPage("links")}>
              <img src={whichPage === "links" ? `links-purple.svg` : `links-gray.svg`} alt='logo' />
              <h2>Links</h2>
            </div>

            <div className={`${styles.navbarProfile} ${whichPage === "profile" ? styles.selected : ""}`}
              onClick={() => setWhichPage("profile")}>
              <img src={whichPage === "profile" ? `profile-purple.svg` : `profile-gray.svg`} alt='logo' />
              <h2>Profile Details</h2>
            </div>
          </li>

          <li>
            <button className={styles.previewBtn} onClick={() => { navigate("/preview") }}><p>Preview</p></button>
          </li>
        </ul>
      </nav>

      <div className={styles.main}>
        <div className={styles.leftSide}>
          <div className={styles.phone}>
            <img src='/phone-1.svg' alt='' className={styles.phone1} />
            <img src='/phone-2.svg' alt='' className={styles.phone2} />
            <div className={styles.infoDiv}>
              <div className={`${styles.profileInfo} ${user?.firstName && user?.lastName && user?.email ? styles.profileInfoText : ""}`}>
                <div className={styles.profilePhoto} style={{
                  backgroundImage: user?.image ? `url(${user?.image})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}>
                </div>
                {user?.firstName && user?.lastName ? (
                  <p className={styles.profileNameText}>{user.firstName + " " + user.lastName}</p>
                ) : (
                  <>
                    <div className={styles.profileName}></div>
                  </>
                )}
                {user?.email ? <p className={styles.profileEmailText}>{user.email}</p> : <div className={styles.profileEmail}></div>}
              </div>

              <div className={styles.links}>
                {Array.from({ length: Math.max(5, Object.keys(links).length) }).map((_, index) => {
                  const entry = Object.entries(links)[index];
                  if (entry) {
                    const [key, value] = entry;
                    if (value?.platform) {
                      const platform = platforms.find(
                        (platform) => platform.lower.toLowerCase() === value.platform.toLowerCase()
                      );

                      const selectedPlatformName = platform ? platform.name : "";

                      return (
                        <button key={`link-${key}`} onClick={() => handleClickOpen(value.link)}
                          className={`${styles.linkBtn} ${styles[value?.platform + "Btn"]}`}>
                          {platform ? <img src={platform.src} alt={value.platform} /> : null}
                          {selectedPlatformName}
                          <img src='/arrow-right.svg' alt='' className={styles.arrowRight} />
                        </button>
                      );
                    }
                  } else {
                    return <button key={index} className={styles.linkBtn} disabled></button>;
                  }
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightSide}>
          {whichPage === "links" ? <AddLinks links={links} setLinks={setLinks} cardCounter={cardCounter} setCardCounter={setCardCounter} handleChange={handleChange} handleRemove={handleRemove} handleClick={handleClick} user={user} saveLinksToDb={saveLinksToDb} getLinksFromDb={getLinksFromDb} showAlert={showAlert} />
            : <ProfileDetails user={user} setUser={setUser} updateUser={updateUser} showAlert={showAlert}/>}
        </div>

        <div className={styles.alertDiv}>
          {alert.visible && <SuccessAlert message={alert.message} />}
        </div>
      </div>
    </div >
  );
}
