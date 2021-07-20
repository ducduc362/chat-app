/* eslint-disable react/jsx-props-no-spreading */
import '../styles/globals.css'
import 'antd/dist/antd.css';
import type { AppProps } from 'next/app'
import SocketContext from "../store/SocketContext";


function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SocketContext>
            <Component {...pageProps} />
        </SocketContext>
    )
}
export default MyApp
