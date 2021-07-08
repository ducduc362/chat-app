import { Form, Button, Select, message } from 'antd';
import 'antd/dist/antd.css';
import styles from '../styles/Form.module.css';
import Router from "next/router";
import { io } from 'socket.io-client';

const socket = io("https://7d47926ba040.ngrok.io/")

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

const Demo = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        const user = window.localStorage.getItem('email');

        window.localStorage.setItem('gender', JSON.stringify(values.gender));

        socket.emit("client-send-user", { userID: user, gender: values.gender })

        const hide = message.loading('Action in progress..', 0);
        setTimeout(hide, 1000);
        Router.push("/")
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>Vui lòng chọn giới tính</h1>
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
                    <Button htmlType="button" onClick={onReset} style={{ marginLeft: 7 }}>
                        Reset
                    </Button>
                </Form.Item>
            </Form >
        </div >
    );
};

export default Demo