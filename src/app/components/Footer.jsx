import { Instagram } from "lucide-react";
import React from "react";

export default function Footer() {
  return (
    <div className="bg-[#BAADA6ff]">
      <footer className="bg-[#BAADA6ff] w-full lg:w-[1233px] mx-auto text-[13px] tracking-widest py-16 px-4 text-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left">
          {/* Column 1: Logo */}
          <div className="flex items-center justify-center lg:justify-start">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-16 h-16"
            />
          </div>

          {/* Column 2: Contact Details */}
          <div className="text-white space-y-2 flex justify-center flex-col items-center lg:items-start">
            <p className="flex items-center">
              <Instagram
                className="text-white mr-1"
                size={14}
                strokeWidth={1.5}
              />
              @SHAPED.FITNESS
            </p>
            <p>012 345 6789</p>
            <p>shaped@shaped.com</p>
          </div>

          {/* Column 3: Navigation Links */}
          <div className="space-y-2 flex items-center justify-center flex-col ">
            <a href="#" className="block hover:opacity-80">HOME</a>
            <a href="#" className="block hover:opacity-80">SERVICES</a>
            <a href="#" className="block hover:opacity-80">TRAINERS</a>
          </div>

          {/* Column 4: More Links */}
          <div className="space-y-2 flex items-center justify-center flex-col ">
            <a href="#" className="block hover:opacity-80">FAQS</a>
            <a href="#" className="block hover:opacity-80">POLICY</a>
            <a href="#" className="block hover:opacity-80">BOOK NOW</a>
          </div>
        </div>
      </footer>
    </div>
  );
}