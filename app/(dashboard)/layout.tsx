import { UserButton } from '@clerk/nextjs';
import { PropsWithChildren } from 'react'
const Dashboardlayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="w-screen h-screen relative">
            <aside className="absolute w-[200px] top-0 left-0 border-r-2 h-full border-black/10">
                moood
            </aside>
            <div className="ml-[200px] h-full">
                <header className="h-[60px] border-b border-black/10">
                    <div className='h-full w-full flex items-center justify-end px-6'>
                        <UserButton />
                    </div>
                </header>
                <div className='h-[calc(100vh-60px)]'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Dashboardlayout;