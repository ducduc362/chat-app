/* eslint-disable react/jsx-props-no-spreading */
import { Form, Button, Select, message } from 'antd';
import 'antd/dist/antd.css';
import { io } from 'socket.io-client';
import { useRouter } from 'next/dist/client/router';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

const socket = io("https://realtimechatappbdh.herokuapp.com/")

socket.on('server-send-room', (data: string) => {
    if (data) {
        window.localStorage.setItem('room', data);
    }
});

const { Option } = Select;

const Text = styled.h1`
    text-align: center;
`

const Flexbox = styled.div`
    font-family: sans-serif;
    margin: 0 auto;
    max-width: 728px;
    text-align:center;
`

const Border = styled.div`
    flex-direction: column;
    display: flex;
    justify-content: center;
    height: 100vh;
    box-sizing: border-box;
`

const StyledButton = styled(Button)`
    padding : 30px 30px;
    span{
        padding-bottom: 30px;
    }
`;

const Demo = () => {

    const [form] = Form.useForm();

    const router = useRouter();

    const [phong, setPhong] = useState("");

    let room = window.localStorage.getItem('room')
    const us = window.localStorage.getItem('userID');
    const iGender = window.localStorage.getItem('gender')

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
            // eslint-disable-next-line react-hooks/exhaustive-deps
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

    return (
        <div>
            <Flexbox>
                <Border>
                    <Form form={form} name="control-hooks" onFinish={onFinish}>
                        {iGender ? (
                            <>
                                <Form.Item
                                    name="gender"
                                    label="Gender"
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
                                <Form.Item>
                                    <StyledButton type="primary" htmlType="submit" >
                                        Tìm kiếm lại
                                    </StyledButton>
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <Text>Vui lòng nhập giới tính</Text>
                                <Form.Item
                                    name="gender"
                                    label="Gender"
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
                                <Form.Item >
                                    <Button type="primary" htmlType="submit">
                                        Tìm kiếm
                                    </Button>
                                </Form.Item>
                            </ >
                        )}
                    </Form>
                </Border>
            </Flexbox>
        </div >
    );
};

export default Demo
