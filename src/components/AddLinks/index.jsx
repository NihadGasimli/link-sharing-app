import { useEffect, useState } from "react";
import styles from "./links.module.css";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function AddLinks({ links, handleChange, handleRemove, handleClick, cardCounter, user, saveLinksToDb, getLinksFromDb }) {

    useEffect(() => {
        if (user?.id) {
            getLinksFromDb();
        }
    }, [user]);

    return (
        <>
            <div className={styles.container}>
                <h1>Customize your links</h1>
                <p>Add/edit/remove links below and then share all your profiles with the world!</p>
                <button className={styles.addBtn} onClick={handleClick}>+ Add new link</button>
                <div className={styles.cards}>
                    {!links.length ? <div className={styles.emptyLinksDiv}>
                        <img src="/emptyLinks.svg" alt="image" />
                        <h2>Let’s get you started</h2>
                        <p>Use the “Add new link” button to get started. Once you have more than one link, you can reorder and edit them. We’re here to help you share your profiles with everyone!</p>
                    </div> :
                        <>
                            {Object.keys(links).map((key, index) => (
                                <div className={styles.card} key={key}>
                                    <div className={styles.heading}>
                                        <div className={styles.leftSide}>
                                            <img src="/Frame248.svg" alt="" />
                                            <h2>Link #{index + 1}</h2>
                                        </div>
                                        <p onClick={() => handleRemove(index)}>Remove</p>
                                    </div>
                                    <div className={styles.platformDiv}>
                                        <p>Platform</p>
                                        <FormControl className={styles.formControl} sx={{ m: 1, minWidth: 120 }}>
                                            <Select
                                                value={links[key]?.platform || ""}
                                                onChange={(event) => handleChange(event, key, "platform")}
                                                displayEmpty
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem className={styles.formControlItem} value={"github"}>
                                                    <img src="/github-logo.svg" alt="" />GitHub
                                                </MenuItem>
                                                <MenuItem className={styles.formControlItem} value={"youtube"}>
                                                    <img src="/youtube-logo.svg" alt="" />YouTube
                                                </MenuItem>
                                                <MenuItem className={styles.formControlItem} value={"facebook"}>
                                                    <img src="/facebook-logo.svg" alt="" />Facebook
                                                </MenuItem>
                                                <MenuItem className={styles.formControlItem} value={"linkedin"}>
                                                    <img src="/linkedin-logo.svg" alt="" />LinkedIn
                                                </MenuItem>
                                                <MenuItem className={styles.formControlItem} value={"twitter"}>
                                                    <img src="/twitter-logo.svg" alt="" />Twitter
                                                </MenuItem>
                                                <MenuItem className={styles.formControlItem} value={"twitch"}>
                                                    <img src="/twitch-logo.svg" alt="" />Twitch
                                                </MenuItem>
                                                <MenuItem className={styles.formControlItem} value={"devto"}>
                                                    <img src="/devto-logo.svg" alt="" />Dev.to
                                                </MenuItem>
                                                <MenuItem className={styles.formControlItem} value={"codewars"}>
                                                    <img src="/codewars-logo.svg" alt="" />CodeWars
                                                </MenuItem>
                                                <MenuItem className={styles.formControlItem} value={"freecodecamp"}>
                                                    <img src="/freecodecamp-logo.svg" alt="" />FreeCodeCamp
                                                </MenuItem>
                                                <MenuItem className={styles.formControlItem} value={"gitlab"}>
                                                    <img src="/gitlab-logo.svg" alt="" />GitLab
                                                </MenuItem>
                                                <MenuItem className={styles.formControlItem} value={"hashnode"}>
                                                    <img src="/hashnode-logo.svg" alt="" />HashNode
                                                </MenuItem>
                                                <MenuItem className={styles.formControlItem} value={"stackoverflow"}>
                                                    <img src="/stackoverflow-logo.svg" alt="" />StackOverflow
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className={styles.linkDiv}>
                                        <p>Link</p>
                                        <div className={styles.span}>
                                            <input
                                                type="text"
                                                className={styles.linkInput}
                                                value={links[key]?.link || ""}
                                                placeholder="https://www.github.com/benwright"
                                                onChange={(event) => handleChange(event, key, "link")}
                                            />
                                            <img src="/link-logo.svg" alt="" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={saveLinksToDb} className={styles.saveBtn}>Save</button>
                        </>
                    }
                </div >
            </div >
        </>
    )
}