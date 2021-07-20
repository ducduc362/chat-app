import { Form, Button, Select, message, Radio, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/dist/client/router';
import React, { useState, useEffect, useContext } from 'react';
import { SKContext } from '../store/SocketContext';

const { Option } = Select;

const Demo = () => {
    const socket = useContext(SKContext);

    const [form] = Form.useForm();

    const router = useRouter();

    const [phong, setPhong] = useState("");
    const [gioitinh, setGioitinh] = useState("");

    const success = async () => {
        message.destroy()
        await message.success('Tìm phòng thành công', 1);
    };

    function confirm() {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: '* Giới tính chỉ chọn được 1 lần',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
        }
        );
    }

    const onFinish = (values: { gender: string; }) => {
        const userID = window.localStorage.getItem('userID');

        window.localStorage.setItem('gender', values.gender);

        const gender = window.localStorage.getItem('gender')

        socket.emit("client-send-user", { userID, gender })

        message.loading('Đang tìm phòng...', 0);
    };

    useEffect(() => {
        socket.on('server-send-room', (data: string) => {
            if (data) {
                window.localStorage.setItem('room', data);
            }
        });

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
    }, [phong, router, socket]);

    return (
        <div>
            <div id="container_form">
                <div id="div_form">
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
                                    <Button type="primary" htmlType="submit" id="style_button">
                                        Tìm kiếm lại
                                    </Button>
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
                                        <Radio value="male" onClick={confirm}>Male</Radio>
                                        <Radio value="female" onClick={confirm} checked>Female </Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item >
                                    <Button type="primary" htmlType="submit">
                                        Tìm kiếm
                                    </Button>
                                </Form.Item>
                            </ >
                        )}
                    </Form>
                </div>
            </div>
        </div >
    );
};

export default Demo
