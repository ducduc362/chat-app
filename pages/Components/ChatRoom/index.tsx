import { useRef, useState } from "react";
import { io } from 'socket.io-client';
import styles from '../../../styles/Chatroom.module.css';

const socket = io("https://matchingapp05052000.herokuapp.com/")

type User = {
    uid: string,
}

interface AppProps {
    user: User
}

type Messages = {
    uid: string,
    key: string,
    message: string
}

export default function ChatRoom(props: AppProps) {
    const { user } = props;

    const { uid } = user;

    window.localStorage.setItem('userID', uid);

    const dummySpace = useRef<HTMLDivElement>(null);

    const [newMessage, setNewMessage] = useState<string>("");
    const [messages, setMessages] = useState<Messages[]>([]);

    socket.emit('client-join-room', window.localStorage.getItem('room'));

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        const room = window.localStorage.getItem('room');

        socket.emit("client-send-message", { userID: uid, roomID: room, message: newMessage })

        setNewMessage("");

        dummySpace.current?.scrollIntoView({ behavior: "smooth" });

        socket.on('server-send-message', (data) => {
            setMessages(data)
        })
    }

    return (
        <div className={styles.content}>
            <ul className={styles.chat_room}>
                {messages.map((message) => (
                    <li key={message.key} className={message.uid === uid ?
                        styles.sent : styles.received} >
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