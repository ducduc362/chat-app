import { Form, Button, Select, message } from 'antd';
import 'antd/dist/antd.css';
import { io } from 'socket.io-client';
import { useRouter } from 'next/dist/client/router';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import styles from '../styles/Form.module.css';

const socket = io("https://matchingapp05052000.herokuapp.com/")

socket.on('server-send-room', (data: string) => {
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

    const us = window.localStorage.getItem('userID');

    const [phong, setPhong] = useState("");

    let room = window.localStorage.getItem('room')

    const onFinish = (values: { gender: string; }) => {
        const userID = window.localStorage.getItem('userID');

        window.localStorage.setItem('gender', values.gender);

        const gender = window.localStorage.getItem('gender')

        socket.emit("client-send-user", { userID, gender })

        socket.on('server-send-user', (user: object) => { })

        const hide = message.loading('Đang tìm phòng...', 0);

        setTimeout(hide, 1000);
    };

    useEffect(() => {
        const loadRoom = setInterval(() => {
            room = window.localStorage.getItem('room');
            if (room == null) {
                room = "";
            }
            setPhong(room);
            socket.emit("client-get-room", us);
        }, 2000);

        if (phong !== "") {
            router.push('/');
        }
        return () => clearInterval(loadRoom);
    }, [phong]);

    const iGender = window.localStorage.getItem('gender')

    return (
        <div className={styles.container}>
            <Text >Vui lòng chọn giới tính</Text>
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                {iGender ? (
                    <>
                        <Form.Item
                            name="gender"
                            label="Gender"
                            className={styles.selected}
                            initialValue={iGender}
                            hidden
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
                                Tìm kiếm lại
                            </Button>
                        </Form.Item>
                    </>
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
