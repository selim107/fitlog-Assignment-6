import './globals.css'; import Header from '@/components/Header'; import Footer from '@/components/Footer'; import ToastProvider from '@/components/ToastProvider'; import {PlanProvider} from '@/context/PlanContext';
export const metadata={title:'FitLog — Workout Library',description:'A dark, no-nonsense workout library and daily plan.'};
export default function RootLayout({children}){return <html lang="en"><body><PlanProvider><Header/><main>{children}</main><Footer/><ToastProvider/></PlanProvider></body></html>}
