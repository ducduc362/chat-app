import React, { useEffect, useState } from "react";
import firebase from "firebase";
import ChatRoom from "./Components/ChatRoom";
import { useRouter } from "next/dist/client/router";
import styleSignIn from '../styles/SignIn.module.css';
import styleSignOut from '../styles/SignOut.module.css';
import { io } from 'socket.io-client';

const socket = io("https://5b21261bdf49.ngrok.io")

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyCV7878uJtuWZdCUmfe-AdHBNBsFi3TOFs",
        authDomain: "chat-22b55.firebaseapp.com",
        databaseURL: "https://chat-22b55-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "chat-22b55",
        storageBucket: "chat-22b55.appspot.com",
        messagingSenderId: "288126055205",
        appId: "1:288126055205:web:86772a74bc245e60e160cc",
        measurementId: "G-8GD29QPM7Z"
    });
} else {
    firebase.app();
}

const auth = firebase.auth();

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
        localStorage.clear();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
};


export default function Home() {
    const [user, setUser] = useState<any>(() => auth.currentUser);

    const router = useRouter();

    const leaveRoom = () => {

        const uid = window.localStorage.getItem('userID');
        const room = window.localStorage.getItem('room')
        const gender = window.localStorage.getItem('gender')

        socket.emit('client-out-room', { userID: uid, roomID: room, gender: gender })

        socket.on('server-out-room', (data) => {
            console.log(data, 'check');
            if (data == 'success') {
                localStorage.removeItem('room');
                router.push('/form');
            }
            else {
                console.log(data);
            }
        });

    }

    useEffect(() => {
        const iGender = window.localStorage.getItem('gender');

        auth.onAuthStateChanged((iUser) => {
            if (iUser && iGender) {
                setUser(iUser);
            } else if (iUser && iGender == null) {
                setUser(iUser);
                router.push('/form');
            }
            else {
                setUser(null)
            }
        })

    }, []);

    return (
        <>
            {user ? (
                <div className={styleSignOut.container}>
                    <nav id={styleSignOut.sign_out}>
                        <h2>Chat With Friends</h2>
                        <div>
                            <button type="submit" id={styleSignOut.leave_room} onClick={leaveRoom} >Leave room</button>
                            <button type="submit" onClick={signOut}>Sign Out</button>
                        </div>
                    </nav>
                    <ChatRoom user={user} />
                </div>
            ) : (
                <div className={styleSignIn.container}>
                    <div className={styleSignIn.content}>
                        <section id={styleSignIn.sign_in}>
                            <h1>Welcome to Chat Room</h1>
                            <button type="submit" onClick={signInWithGoogle}>Sign In With Google</button>
                        </section>
                    </div>
                </div>
            )}
        </>
    )
}
