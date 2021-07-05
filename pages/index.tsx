import React, { useEffect, useState } from "react";
import firebase from "firebase";
import ChatRoom from "./Components/ChatRoom";

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyBgPYywAAYgyH1Qf_VPoOFSkqHRNSuWWdU",
        authDomain: "chat-app-7d924.firebaseapp.com",
        projectId: "chat-app-7d924",
        storageBucket: "chat-app-7d924.appspot.com",
        messagingSenderId: "447753363638",
        appId: "1:447753363638:web:fbdb3e607cd6cf663f8617",
        measurementId: "G-5F2DWMEXYR",
    });
} else {
    firebase.app();
}

const auth = firebase.auth();
const db = firebase.firestore();

const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.useDeviceLanguage();

    try {
        await auth.signInWithPopup(provider)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
};

const signOut = async () => {
    try {
        await firebase.auth().signOut();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
};

export default function Home() {
    const [user, setUser] = useState(() => auth.currentUser);

    useEffect(() => {
        auth.onAuthStateChanged((iUser) => {
            if (iUser) {
                setUser(iUser)
            } else {
                setUser(null)
            }
        })
    }, []);

    return (
        <div className="App">
            {user ? (
                <>
                    <nav id="sign_out">
                        <h2>Chat With Friends</h2>
                        <button type="submit" onClick={signOut}>Sign Out</button>
                    </nav>
                    <ChatRoom user={user} db={db} />
                </>
            ) : (
                <section id="sign_in">
                    <h1>Welcome to Chat Room</h1>
                    <button type="submit" onClick={signInWithGoogle}>Sign In With Google</button>
                </section>
            )}
        </div>
    )
}

