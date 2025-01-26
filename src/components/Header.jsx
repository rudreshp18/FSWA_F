import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router';

export default function Header({ currentSection, changeSection }) {
    const navigate = useNavigate();
    return (
        <header className="bg-blue-600 shadow-lg">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <h1 className="text-white text-2xl font-bold">FSWA</h1>
                <nav className="flex space-x-4 items-center">
                    <button className={`bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-100 transition-all ${currentSection === 'task' && 'bg-orange-400'}`} onClick={() => changeSection('task')}>
                        Task
                    </button>
                    <button className={`bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-100 transition-all ${currentSection === 'feed' && 'bg-orange-400'}`} onClick={() => changeSection('feed')}>
                        Feed
                    </button>
                    <div className="relative group">
                        <FaUserCircle className="text-white text-3xl cursor-pointer" />
                        <div className="absolute right-0 mt-2 w-32 bg-white text-blue-600 text-center py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { navigate('/'); localStorage.clear() }}>
                            Logout
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
} 