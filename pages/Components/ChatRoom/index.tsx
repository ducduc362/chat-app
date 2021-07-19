import { useRef, useState, useEffect } from "react";
import { message } from "antd";
import { io } from 'socket.io-client';
import { Container, Content, Chatroom, Chatform } from './styles';

const socket = io('https://realtimechatappbdh.herokuapp.com/', { transports: ['websocket', 'clear'] });

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