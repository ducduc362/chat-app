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

const Container = styled.div`
    background-color: rgb(40, 44, 52);
    width: 100%;
`

const Content = styled.div`
    max-width: 728px;
    margin: 0 auto;
`
const Chatroom = styled.ul`
    padding: 10px;
    min-height: 85vh;
    margin: 10vh 0;
    overflow-y: hidden;
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
        background: transparent;
    }
      
    &::-webkit-scrollbar-track {
        background: #1e1e24;
    }
      
    &::-webkit-scrollbar-thumb {
        background: #6649b8;
    }
`

const Chatform = styled.form`
    max-width: 728px;
    background: rgb(58, 58, 58);
    border-radius: 50px;
    height: 5vh;
    width: 100%;
    position: fixed;
    bottom: 0;
    display: flex;
    font-size: 1.5em;

    input{
        line-height: 1.5;
        width: 100%;
        font-size: 1.5rem;
        background: rgb(58, 58, 58);
        color: white;
        outline: none;
        border: none;
        padding: 0 10px;
        border-top-left-radius: 50px;
        border-bottom-left-radius: 50px;
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
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    
`

export default function ChatRoom(props: AppProps) {
    const { user } = props;

    const dummySpace = useRef<HTMLInputElement>(null);

    const [newMessage, setNewMessage] = useState<string>("");

    const [messages, setMessages] = useState<Messages[]>([]);

    const [room, setRoom] = useState<string>("");

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        socket.emit("client-send-message", { userID: user?.uid, roomID: room, message: newMessage })

        setNewMessage("");

        dummySpace.current?.scrollIntoView({ block: 'end', behavior: "smooth" });
    }

    useEffect(() => {
        const iRoom = window.localStorage.getItem('room');

        window.localStorage.setItem('userID', user?.uid);

        if (iRoom) {
            setRoom(iRoom);
        }

        socket.emit('client-join-room', window.localStorage.getItem('room'));

        socket.emit('client-get-message-first', window.localStorage.getItem('room'));

        socket.on('server-send-message', (data) => {
            setMessages(data)
        })

    }, [user?.uid])

    return (
        <Container>
            <Content>
                <Chatroom>
                    {messages.map((message) => (
                        <li key={message.key}
                            className={message.userID === user?.uid ? 'sent' : 'received'}
                        >
                            <p>{message.message}</p>
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
        </Container>
    )
}