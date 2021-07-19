import { Form, Button, Select, message, Radio } from 'antd';
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

const Flexbox = styled.div`
    font-family: sans-serif;
    text-align: center;
    max-width: 728px;
    margin: 0 auto;
`

const Border = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    padding: 10%;
`

const StyledButton = styled(Button)`
    height: 45px;
`;

const Demo = () => {
    const [form] = Form.useForm();

    const router = useRouter();

    const [phong, setPhong] = useState("");
    const [gioitinh, setGioitinh] = useState("");

    const success = async () => {
        message.destroy()
        await message.success('Tìm phòng thành công', 2);
    };

    const onFinish = (values: { gender: string; }) => {
        const userID = window.localStorage.getItem('userID');

        window.localStorage.setItem('gender', values.gender);

        const gender = window.localStorage.getItem('gender')

        socket.emit("client-send-user", { userID, gender })


        message.loading('Đang tìm phòng...', 0);
    };

    useEffect(() => {
        let room = window.localStorage.getItem('room');
        const us = window.localStorage.getItem('userID');
        const gt = window.localStorage.getItem('gender');

        const loadRoom = setInterval(() => {
            room = window.localStorage.getItem('room');
            if (room == null) {
                room = "";
            }
            setPhong(room);

            socket.emit("client-get-room", us);
        }, 500);

        if (gt !== null) {
            setGioitinh(gt);
        }

        if (phong !== "") {
            router.push('/');
            success();
        }

        return () => clearInterval(loadRoom);
    }, [phong, router]);

    return (
        <div>
            <Flexbox>
                <Border>
                    <Form form={form} name="control-hooks" onFinish={onFinish}>
                        {gioitinh ? (
                            <>
                                <Form.Item
                                    name="gender"
                                    label="Gender"
                                    initialValue={gioitinh}
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
                                    <StyledButton type="primary" htmlType="submit">
                                        Tìm kiếm lại
                                    </StyledButton>
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <h1>Vui lòng chọn giới tính</h1>
                                <Form.Item
                                    name="gender"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Radio.Group>
                                        <Radio value="male">Male</Radio>
                                        <Radio value="female" checked>Female </Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <h4 style={{ color: "red" }}>* Giới tính chỉ chọn được 1 lần</h4>
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
