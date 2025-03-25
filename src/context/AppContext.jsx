import { createContext, useEffect, useState } from "react";
import { database, ref, set, push } from "../firebase";
import { get, remove } from "firebase/database";
import LZString from 'lz-string';


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(LZString.decompressFromUTF16(storedUser)) : null;
  });
  const [users, setUsers] = useState(null);
  const [links, setLinks] = useState([]);
  const [cardCounter, setCardCounter] = useState(0);
  const [alert, setAlert] = useState({ message: "", visible: false });

  const showAlert = (message) => {
    setAlert({ message, visible: true });
    setTimeout(() => setAlert({ message: "", visible: false }), 3000);
  };

  useEffect(() => {
    if (user) {
      const compressedUser = LZString.compressToUTF16(JSON.stringify(user));
      sessionStorage.setItem('user', compressedUser);
    }
  }, [user]);


  const updateUser = (userData) => {
    setUser(userData);
    const compressedUser = LZString.compressToUTF16(JSON.stringify(userData));
    sessionStorage.setItem('user', compressedUser);
    
  };

  async function getData() {
    try {
      const snapshot = await get(ref(database, "users"));
      if (snapshot.exists()) {
        let allUsers = [];
        snapshot.forEach((childSnapshot) => {
          let userId = childSnapshot.key;
          let userData = childSnapshot.val();

          const data = { userId, userData };
          allUsers.push(data);
        });

        setUsers(allUsers);
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (event, key, field) => {
    setLinks((prevLinks) => {
      // Yalnız lazım olan dəyişəni güncəlləyirik
      const updatedLinks = [...prevLinks];
      updatedLinks[key] = { ...updatedLinks[key], [field]: event.target.value };
      return updatedLinks;
    });
  };


  async function saveLinksToDb() {
    try {
      const userRef = ref(database, `users/${user.id}/links`);
      const snapshot = await get(userRef);
      const existingData = snapshot.exists() ? snapshot.val() : {};

      const updatedUserData = {
        ...existingData,
        ...links
      };

      await set(userRef, updatedUserData);
      // alert("Saved succesfully!");
      showAlert("Saved succesfully!")
    } catch (error) {
      console.error("Error saving user data:", error.message);
    }
  }

  async function getLinksFromDb() {
    try {
      const userRef = ref(database, `users/${user.id}/links`);
      const snapshot = await get(userRef);
      const existingData = snapshot.exists() ? snapshot.val() : {};

      setLinks(existingData);
      setCardCounter(existingData.length);
    } catch (error) {
      console.error("Error saving user data:", error.message);
    }
  }

  const handleClick = () => {
    setLinks((prevLinks) => {
      const linksArray = Array.isArray(prevLinks) ? prevLinks : [];

      return [
        ...linksArray,
        { platform: "", link: "" }
      ];
    });

    setCardCounter((prevCounter) => prevCounter + 1);
  };

  const deleteLinkFromDb = async (index) => {
    try {
      const userRef = ref(database, `users/${user.id}/links/${index}`);
      await remove(userRef);
    } catch (error) {
      console.error("Error deleting link from database:", error.message);
    }
  };

  const handleRemove = (index) => {
    deleteLinkFromDb(index);

    setLinks((prevLinks) => {
      const linksArray = Array.isArray(prevLinks) ? prevLinks : [];

      if (index >= 0 && index < linksArray.length) {
        return linksArray.filter((_, i) => i !== index);
      }

      return linksArray;
    });

    setCardCounter((prevCounter) => Math.max(prevCounter - 1, 0));
  };

  return (
    <AppContext.Provider value={{ user, setUser, links, setLinks, handleChange, handleRemove, handleClick, cardCounter, setCardCounter, users, setUsers, getData, saveLinksToDb, getLinksFromDb, updateUser, alert, showAlert, setAlert }}>
      {children}
    </AppContext.Provider>
  );
};
