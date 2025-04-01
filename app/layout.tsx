import { ReactNode } from 'react';
import './global.css';

export const metadata = {
    title: "oGX Assistant",
    description:  "Ask everything you need to know about AIESEC Exchange Program!",
}

interface RootLayoutProps {
    children: ReactNode;
}

const RootLayout = ({ children } : RootLayoutProps) => {
    return(
        <html lang='en'>
            <body>
                {children}
            </body>
        </html>
    );
}

export default RootLayout;