import { Form, Button, Select, message } from 'antd';
import 'antd/dist/antd.css';
import styles from '../styles/Form.module.css';
import { io } from 'socket.io-client';
import { useRouter } from 'next/dist/client/router';
import styled from 'styled-components';

const socket = io("https://matchingapp05052000.herokuapp.com")

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

const MyForm = styled(Form)`
    width: 20%;
`

const Demo = () => {
    const [form] = Form.useForm();

    const router = useRouter();

    const onFinish = (values: any) => {
        const user = window.localStorage.getItem('email');
        const room = window.localStorage.getItem('room')

        window.localStorage.setItem('gender', JSON.stringify(values.gender));

        socket.emit("client-send-user", { userID: user, gender: values.gender })

        const hide = message.loading('Action in progress..', 0);

        if (room == null) {
            let search = setInterval(() => hide, 1000);
        } else {
            clearInterval(search);
        }

        let loadRoom = setInterval(() => socket.emit("client-get-room", user), 2000);

        if (room !== null) {
            clearInterval(loadRoom);
        }

        router.push('/');
    };

    return (
        <div className={styles.container}>
            <Text >Vui lòng chọn giới tính</Text>
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
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
                        Submit
                    </Button>
                </Form.Item>
            </Form >
        </div >
    );
};

export default Demo