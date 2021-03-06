import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/dist/client/router";
import firebase from "firebase";
import styled from "styled-components";
import ChatRoom from "./Components/ChatRoom";
import { SKContext } from '../store/SocketContext';

type User = {
    gender: string
}

const Container = styled.div`
    background-color: rgb(40, 44, 52);
    width: 100%;
    height: 100vh;
    overflow: auto;
`

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
        await auth.signInWithPopup(provider);
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
    const socket = useContext(SKContext);

    const [user, setUser] = useState<firebase.User | null>
        (() => auth.currentUser);

    const router = useRouter();

    const leaveRoom = () => {
        const uid = window.localStorage.getItem('userID');
        const room = window.localStorage.getItem('room')
        const gender = window.localStorage.getItem('gender')

        socket.emit('client-out-room', { userID: uid, roomID: room, gender })
    }

    useEffect(() => {
        const iGender = window.localStorage.getItem('gender');

        socket.emit('client-get-user', window.localStorage.getItem('userID'));

        socket.on('server-send-user', (data: User) => {
            if (typeof data.gender !== "undefined") {
                window.localStorage.setItem('gender', data.gender);
            }
        });

        socket.on('server-out-room', (data) => {
            if (data === 'success') {
                localStorage.removeItem('room');
                router.push('/form');
            }
            else {
                // eslint-disable-next-line no-console
                console.log(data);
            }
        });

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

    }, [router, socket]);

    return (
        <>
            {user ? (
                <>
                    <div id="div_sign_out">
                        <nav id="sign_out">
                            <h2>Chat With Friends</h2>
                            <div id="divbutton">
                                <button type="submit" id="leave_room" onClick={leaveRoom} >Leave room</button>
                                <button type="submit" onClick={signOut}>Sign Out</button>
                            </div>
                        </nav>
                    </div>
                    <Container>
                        <ChatRoom user={user} socket={socket} />
                    </Container>
                </>
            ) : (
                <div id="container_sign_in">
                    <div id="div_sign_in">
                        <section id="sign_in">
                            <h1>Welcome to Chat Room</h1>
                            <button type="submit" onClick={signInWithGoogle}>Sign In With Google</button>
                        </section>
                    </div>
                </div>
            )}
        </>
    )
}
