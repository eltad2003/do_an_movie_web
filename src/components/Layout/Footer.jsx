import { Facebook, Github, Instagram, Twitter } from "lucide-react";
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-dark-100 text-white py-6 mt-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between items-center">
                    {/* Logo or Brand Name */}
                    <div className="text-lg font-bold">
                        <a href="/" className="hover:text-gray-400">
                            ChillFlix
                        </a>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex space-x-6">
                        <a href="/about" className="hover:text-gray-400">
                            About
                        </a>
                        <a href="/services" className="hover:text-gray-400">
                            Services
                        </a>
                        <a href="/contact" className="hover:text-gray-400">
                            Contact
                        </a>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex space-x-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                            <Facebook />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                            <Twitter />
                        </a>

                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                            <Github />
                        </a>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="text-center mt-4 text-sm text-gray-400">
                    © 2025 ChillFlix. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
