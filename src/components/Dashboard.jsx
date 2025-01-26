import React from 'react'
import TaskManagement from './TaskManagement'
import Header from './Header'
import Feed from './Feed'

export default function Dashboard() {
    const [section, setSection] = React.useState('task')

    return (
        <div className='w-screen max-h-screen bg-blue-400 overflow-hidden top-0 absolute'>
            <Header currentSection={section} changeSection={(data) => setSection(data)} />
            {
                section === 'task' ? <TaskManagement /> : <Feed />
            }
        </div>
    )
}
