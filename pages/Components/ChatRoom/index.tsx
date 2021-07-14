import { useRef, useState, useEffect } from "react";
import { io } from 'socket.io-client';

const socket = io("https://realtimechatappbdh.herokuapp.com/");

type User = {
    uid: string,
}

interface AppProps {
    user: User
}

type Messages = {
    userID: string,
    key: string,
    message: string
}

export default function ChatRoom(props: AppProps) {
    const { user } = props;

    const { uid } = user;

    window.localStorage.setItem('userID', uid);

    const dummySpace = useRef<HTMLInputElement>(null);

    const [newMessage, setNewMessage] = useState<string>("");

    const [messages, setMessages] = useState<Messages[]>([]);

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        const room = window.localStorage.getItem('room');

        socket.emit("client-send-message", { userID: uid, roomID: room, message: newMessage })

        setNewMessage("");

        dummySpace.current?.scrollIntoView({ block: 'end', behavior: "smooth" });
    }

    useEffect(() => {
        socket.emit('client-join-room', window.localStorage.getItem('room'));

        socket.emit('client-get-message-first', window.localStorage.getItem('room'));

        socket.on('server-send-message', (data) => {
            setMessages(data)
        })
    }, [])

    return (
        <div className="content">
            <ul className="chat_room">
                {messages.map((message) => (
                    <li key={message.key} className={message.userID === uid ?
                        "sent" : "received"} >
                        <p>{message.message}</p>
                    </li>
                ))}
            </ul>
            <section ref={dummySpace}>
                <form id="chat_form" onSubmit={handleSubmit}>
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