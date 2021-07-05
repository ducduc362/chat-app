import firebase from "firebase";
import { useEffect, useRef, useState } from "react";
import Image from 'next/image'

type User = {
    uid: string,
    photoURL: string,
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

    const dummySpace = useRef<HTMLDivElement>(null);

    const [newMessage, setNewMessage] = useState<string>();
    const [messages, setMessages] = useState<ShowData[]>([]);

    type SnapProps = {
        id: string,
        data: Function
    }

    interface OnSnapshotProps {
        docs: SnapProps[],
    }

    useEffect(() => {
        db.collection("messages")
            .orderBy("createdAt")
            .limit(100)
            .onSnapshot((querySnapshot: OnSnapshotProps) => {
                const data = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));

                setMessages(data);
            });
    }, [db]);

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        db.collection("messages").add({
            text: newMessage,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        });

        setNewMessage("");

        dummySpace.current?.scrollIntoView({ behavior: "smooth" });
    }

    interface MessageData {
        createdAt: Date,
        id: string,
        uid: string,
        photoURL: string,
        text: string
    }

    return (
        <main id="chat_room">
            <ul>
                {messages.map((message: MessageData) => (
                    <li key={message.id} className={message.uid === uid ? "sent" : "received"} >
                        {message.photoURL ? (
                            <Image src={message.photoURL} alt="Avatar" width={40} height={40} />
                        ) : null}
                        <p>{message.text}</p>
                    </li>
                ))}
            </ul>

            <section ref={dummySpace}>
                <form onSubmit={handleSubmit}>
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
        </main >
    )
}