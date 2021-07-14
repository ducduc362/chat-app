import { useRef, useState, useEffect } from "react";
import { io } from 'socket.io-client';
import styled from 'styled-components';

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

const Content = styled.div`
    background-color: #282c34;
    max-width: 100%;
`
const Chatroom = styled.ul`
    padding: 10px;
    min-height: 80vh;
    margin: 10vh 0;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;

    li{
        display: flex;
        align-items: center;
    }

    span{
        color: gray;
    }

    &::-webkit-scrollbar {
        width: 0.25rem;
    }
      
    &::-webkit-scrollbar-track {
        background: #1e1e24;
    }
      
    &::-webkit-scrollbar-thumb {
        background: #6649b8;
    }
`

const Chatform = styled.form`
    height: 10vh;
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: rgb(24, 23, 23);
    display: flex;
    font-size: 1.5em;

    input{
        line-height: 1.5;
        width: 80%;
        font-size: 1.5rem;
        background: rgb(58, 58, 58);
        color: white;
        outline: none;
        border: none;
        padding: 0 10px;
    }

    button {
        width: 20%;
        background-color: rgb(56, 56, 143);
        color: white;
        cursor: pointer;
        font-size: 1.25rem;
        display: inline-block;
        border: none;
        text-align: center;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    
`

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
        <Content>
            <Chatroom>
                {messages.map((message) => (
                    <li key={message.key} className={message.userID === uid ?
                        'sent' : 'received'} >
                        <p className={styles.text}>{message.message}</p>
                    </li>
                ))}
            </Chatroom>
            <section ref={dummySpace}>
                <Chatform onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..."
                    />
                    <button type="submit" disabled={!newMessage?.trim()}>
                        Send
                    </button>
                </Chatform>
            </section>
        </Content>
    )
}