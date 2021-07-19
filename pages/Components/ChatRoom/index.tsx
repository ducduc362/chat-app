import { useRef, useState, useEffect } from "react";
import { message } from "antd";
import { io } from 'socket.io-client';
import styled from 'styled-components';

const socket = io('https://realtimechatappbdh.herokuapp.com/', { transports: ['websocket'] });

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

const Container = styled.main`
    max-width: 728px;
    margin: 0 auto;
    text-align: center;
`

const Content = styled.div`
    padding: 10px;
    min-height: 85vh;
    margin: 10vh 0 5vh 0;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;

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

const Chatroom = styled.ul`
    li{
        display: flex;
        align-items: center;
    }

    span{
        color: gray;
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
        padding: 5px 10px;
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

    const notification = () => {
        message.error('Bạn cùng phòng đã thoát phòng!');
    };

    const focusInput = () => {
        const gender = window.localStorage.getItem('gender')
        socket.emit("client-user-is-typing", { roomID: room, gender })
    }

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

        socket.emit('client-get-message-first', window.localStorage.getItem('room'));

        socket.on('server-send-message', (data) => {
            setMessages(data)
        })
    }, [messages, user?.uid])

    useEffect(() => {
        const gender = window.localStorage.getItem('gender');

        socket.on('server-has-user-out', (data) => {
            if (gender !== data) {
                notification();
            }
        })
    }, [])

    useEffect(() => {
        socket.emit('client-join-room', window.localStorage.getItem('room'));
    }, [])

    return (
        <Container>
            <Content>
                <Chatroom>
                    {messages.map((eachmessage) => (
                        <li key={eachmessage.key}
                            className={eachmessage.userID === user?.uid ? 'sent' : 'received'}
                        >
                            <p>{eachmessage.message}</p>
                        </li>
                    ))}
                </Chatroom>
            </Content>
            <section ref={dummySpace}>
                <Chatform onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newMessage}
                        onFocus={focusInput}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..."
                    />
                    <button type="submit" disabled={!newMessage?.trim()}>
                        Send
                    </button>
                </Chatform>
            </section>
        </Container >
    )
}