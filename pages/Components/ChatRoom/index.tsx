import firebase from "firebase";
import { useEffect, useRef, useState } from "react";
import Image from 'next/image'
import { io } from 'socket.io-client';
import styles from '../../../styles/Chatroom.module.css';

const socket = io("https://7d47926ba040.ngrok.io/")
// const socket = io("http://localhost:8000/", { transports: ['websocket'] })
type User = {
    uid: string,
    photoURL: string,
    email: string
}

type Data = {
    collection: Function
}

interface AppProps {
    db: Data,
    user: User
}

type Messages = {
    createdAt: Date,
    id: string,
    photoURL: string,
    uid: string,
    text: string
}

interface ShowData {
    data: Messages[]
}

export default function ChatRoom(props: AppProps) {
    const { db, user } = props;

    const { uid, photoURL } = user;

    window.localStorage.setItem("email", user.email);

    const dummySpace = useRef<HTMLDivElement>(null);

    const [newMessage, setNewMessage] = useState<string>("");
    const [messages, setMessages] = useState<ShowData[]>([]);

    type SnapProps = {
        id: string,
        data: Function
    }

    interface OnSnapshotProps {
        docs: SnapProps[],
    }

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        const room = window.localStorage.getItem('room');

        socket.emit("client-send-message", { userID: uid, roomID: room, message: newMessage })

        setNewMessage("");

        dummySpace.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        socket.on('server-send-message', (data) => {
            console.log(data);
            setMessages(data)
        })

    }, [])

    return (
        <div className={styles.content}>
            <ul className={styles.chat_room}>
                {messages.map((message: any, index) => (
                    <li key={index} className={message.userID === uid ? styles.sent : styles.received} >
                        {/* {message.photoURL ? (
                            <Image src={message.photoURL} alt="Avatar" width={40} height={40} />
                        ) : null} */}
                        <p className={styles.text}>{message.message}</p>
                    </li>
                ))}
            </ul>

            <section ref={dummySpace}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..."
                    />
                    <button type="submit" disabled={!newMessage?.trim()}>
                        Send
                    </button>
                </form>
            </section>
        </div >
    )
}

   // db.collection("messages").add({
        //     text: newMessage,
        //     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        //     uid,
        //     photoURL
        // });

             // const getMessage = () => {
        //     try {
        //         socket.on('server-send-message', async (data) => {
        //             await setMessages(data)
        //         })
        //     } catch (error) {
        //         console.log(error, 'err');
        //     }
        // }
        // getMessage();