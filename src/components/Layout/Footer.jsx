import { Facebook, Github, Instagram, Twitter } from "lucide-react";
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-dark-100 text-white py-6">
            <div className="container mx-auto px-4 ">
                <div className="flex flex-col items-start gap-8 lg:flex-row lg:justify-between lg:items-center">

                    <div className="flex flex-col gap-4 max-w-md ">
                        <a href="/" className="text-2xl md:text-4xl text-gradient font-bold">
                            CHILLFLIX
                        </a>
                        <p className="text-white/50 text-sm md:text-base">CHILLFLIX - Trang xem phim online miễn phí Vietsub. Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc, Trung Quốc,… đa dạng thể loại. Khám phá nền tảng phim trực tuyến và xem cùng bạn bè (WatchParty) hay nhất 2025 miễn phí!</p>
                    </div>


                    {/* Navigation Links */}
                    <div className="flex space-x-3 text-sm lg:text-base">
                        <a href="/about" className="hover:text-purple-400">
                            Giới thiệu
                        </a>
                        <a href="/services" className="hover:text-purple-400">
                            Dịch vụ
                        </a>
                        <a href="/contact" className="hover:text-purple-400">
                            Liên hệ
                        </a>
                        <a href="/privacy" className="hover:text-purple-400">
                            Chính sách
                        </a>
                        <a href="/terms" className="hover:text-purple-400">
                            Điều khoản
                        </a>
                        <a href="/ask" className="hover:text-purple-400">
                            Hỏi đáp
                        </a>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex space-x-4">
                        <a href="https://www.facebook.com/hoang.dat1410/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">
                            <Facebook />
                        </a>

                        <a href="https://github.com/eltad2003" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">
                            <Github />
                        </a>
                        <a href="https://www.instagram.com/eltad2003/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">
                            <Instagram />
                        </a>
                        <a href="https://twitter.com/eltad2003" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">
                            <Twitter />
                        </a>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="text-start lg:text-center mt-5 text-sm text-light-100">
                    © 2025 ChillFlix. All rights reserved by LE HOANG DAT.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
