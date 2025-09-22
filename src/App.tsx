import "leaflet/dist/leaflet.css";
import "./App.css";
import Map from "./Map/Map";
import Header from "./Header/Header";
import DownBar from "./Profile/DownBar";
import { auth } from "./firebaseConfig";
import { useIsMobile } from "./hooks/useMediaQuery";
import { useEffect } from "react";
import { setUser, type SerializableUser } from "./Auth/authSlice";
import { type User } from "firebase/auth";
import { useDispatch } from "react-redux";
import MessageWrapper from "./Add/MessageWrapper";
import { useInitializeDevices } from "./hooks/useInitializaDevices";
function App() {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  useInitializeDevices();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      let serializableUser: SerializableUser | null = null;
      if (user) {
        serializableUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
      }
      dispatch(setUser(serializableUser));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="appLayout">
      <div className="header-overlay">
        <Header />
      </div>
      <div className="mainContentArea">
        {isMobile && <DownBar />}
        <MessageWrapper />
        <Map />
      </div>
    </div>
  );
}

export default App;
