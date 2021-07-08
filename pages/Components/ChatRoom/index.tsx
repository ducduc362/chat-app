import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import styles from '../../../styles/Chatroom.module.css';

const socket = io("https://matchingapp05052000.herokuapp.com")

type User = {
    uid: string,
    photoURL: string,
    email: string
}

interface AppProps {
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
    const { user } = props;

    const { uid } = user;

    window.localStorage.setItem("email", user.email);

    const dummySpace = useRef<HTMLDivElement>(null);

    const [newMessage, setNewMessage] = useState<string>("");
    const [messages, setMessages] = useState<ShowData[]>([]);

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        const room = window.localStorage.getItem('room');

        socket.emit("client-send-message", { userID: uid, roomID: room, message: newMessage })

        setNewMessage("");

        dummySpace.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        socket.on('server-send-message', (data) => {
            setMessages(data)
        })

    }, [])

    return (
        <div className={styles.content}>
            <ul className={styles.chat_room}>
                {messages.map((message: any, index) => (
                    <li key={index} className={message.userID === uid ? styles.sent : styles.received} >
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