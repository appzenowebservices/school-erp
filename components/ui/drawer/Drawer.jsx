"use client"
import { useState } from 'react';
import { IoIosColorPalette } from 'react-icons/io';

const themes = [
    {
        name: 'Swiggy',
        colors: {
            '--color-background': '#fbd9c8',
            '--color-background-section': '#FFFFFF',
            '--color-primary-text': '#4A4A4A',
            '--color-primary-text-inverse': '#FFFFFF',

            '--color-secondary-text': '#6D6D6D',
            '--color-accent': '#f0303e',
            '--color-muted': '#9E9E9E',
        },
    },
    {
        name: 'Zomato',
        colors: {
            '--color-background': '#FFFAF0',
            '--color-background-section': '#FFFFFF',
            '--color-primary-text': '#3E2723',
            '--color-primary-text-inverse': '#FFFFFF',

            '--color-secondary-text': '#5D4037',
            '--color-accent': '#FF1744',
            '--color-muted': '#BDBDBD',
        },
    },
    {
        name: '6amKart',
        colors: {
            '--color-background': '#005555',          // Dark background for sleekness
            '--color-background-section': '#1A1A1A',  // Slightly lighter for section contrast
            '--color-primary-text': '#fffff',
            '--color-primary-text-inverse': '#fffff',
            '--color-secondary-text': '#fffff',
            '--color-accent': '#116371',
            '--color-accent-muted': '#589ba6',

            '--color-muted': '#9E9E9E',             // Muted gray for less important elements
        },
    }

];

export default function ThemeSelector() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => setIsOpen(!isOpen);

    const handleColorChange = (variable, value) => {
        document.documentElement.style.setProperty(variable, value);
    };

    const applyTheme = (theme) => {
        Object.entries(theme).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    };

    return (
        <div>
            {/* Theme Icon Button */}
            <button onClick={toggleDrawer}>
                <IoIosColorPalette className="p-2 rounded-full shadow-md bg-accent text-primary-text-inverse hover:bg-accent/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 w-10 h-10 mb-2" />
            </button>

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} bg-background w-90 p-10 shadow-lg `}
            >
                <h5 className="flex items-center mb-6 text-base font-semibold text-primary-text uppercase ">
                    <IoIosColorPalette className="w-4 h-4 mr-2 " /> Customize Theme
                </h5>

                {/* Close Button */}
                <button
                    onClick={toggleDrawer}
                    className="absolute top-2.5 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    ✕
                </button>

                {/* Custom Color Section */}
                <div className="mb-6">
                    {/* <h6 className="text-sm font-medium  mb-4 text-primary-text">Custom Colors</h6> */}
                    {[
                        ['--color-background', 'Background'],
                        ['--color-background-section', 'Section Background'],
                        ['--color-primary-text', 'Primary Text'],
                        ['--color-secondary-text', 'Secondary Text'],
                        ['--color-accent', 'Accent'],
                        ['--color-muted', 'Muted'],
                    ].map(([variable, label]) => (
                        <div key={variable} className="mb-4">
                            <label className="block mb-3 text-sm  text-primary-text font-semibold ">{label}</label>
                            <input
                                type="color"
                                onChange={(e) => handleColorChange(variable, e.target.value)}
                                className="w-full h-10 border rounded-lg focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                    ))}
                </div>

                {/* Popular Themes Section */}
                <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-6">
                    <h6 className="text-base text-primary-text font-semibold">🌟 Popular Themes</h6>

                    <div className="grid grid-cols-2 gap-4">
                        {themes.map((theme) => (
                            <button
                                key={theme.name}
                                onClick={() => applyTheme(theme.colors)}
                                className="p-4 rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 flex items-center justify-center"
                                style={{
                                    backgroundColor: theme.colors['--color-accent'],
                                    color: theme.colors['--color-primary-text'],
                                }}
                            >
                                <span className="text-sm font-medium">{theme.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}