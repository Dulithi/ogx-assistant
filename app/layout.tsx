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
            <h1 className="text-left align-text-top font-extrabold text-xl px-6 py-4 fixed bg-white w-full shadow-sm"><span className="bg-clip-text text-transparent bg-gradient-to-r to-gv from-gta via-gte">oGX Assistant</span></h1>
      
                {children}
            </body>
        </html>
    );
}

export default RootLayout;