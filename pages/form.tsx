import { Form, Button, Select, message } from 'antd';
import 'antd/dist/antd.css';
import styles from '../styles/Form.module.css';
import { io } from 'socket.io-client';
import { useRouter } from 'next/dist/client/router';
import styled from 'styled-components';

const socket = io("https://5b21261bdf49.ngrok.io")

socket.on('server-send-room', (data: string) => {
    console.log(data, 'room');
    if (data) {
        window.localStorage.setItem('room', data);
    }
})

const { Option } = Select;

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const Text = styled.h1`
    text-align: center;
`

const Demo = () => {
    const [form] = Form.useForm();

    const router = useRouter();

    const room = window.localStorage.getItem('room')

    const onFinish = (values: any) => {
        const userID = window.localStorage.getItem('userID');

        window.localStorage.setItem('gender', values.gender);

        const gender = window.localStorage.getItem('gender')

        socket.emit("client-send-user", { userID: userID, gender: gender })

        socket.on('server-send-user', (user: object) => {
            console.log(user, 'user');
        })

        const hide = message.loading('Đang tìm phòng...', 0);

        setTimeout(hide, 1000);

        let loadRoom = setInterval(() => socket.emit("client-get-room", userID), 2000);

        if (room !== null) {
            clearInterval(loadRoom);
        }
        console.log(room, 'here');

        router.push('/');
    };

    return (
        <div className={styles.container}>
            <Text >Vui lòng chọn giới tính</Text>
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                {room ? (

                    <Form.Item {...tailLayout} className={styles.selected} >
                        <Button type="primary" htmlType="submit">
                            Tìm kiếm lại
                        </Button>
                    </Form.Item>

                ) : (
                    <>
                        <Form.Item
                            name="gender"
                            label="Gender"
                            className={styles.selected}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select a option and change input text above"
                                allowClear
                            >
                                <Option value="male">male</Option>
                                <Option value="female">female</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item {...tailLayout} className={styles.selected} >
                            <Button type="primary" htmlType="submit">
                                Tìm kiếm
                            </Button>
                        </Form.Item>
                    </ >
                )}
            </Form >
        </div >
    );
};

export default Demo
