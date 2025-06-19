import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import Logo from './assets/Logo.png';
const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-12 mt-20" style = {{ width: "118.5%", height: "270px", marginLeft: "-113px", marginBottom: "-150px"}}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="space-y-4">
            <img 
              src={Logo}
              alt="SereniTrack" 
              className="h-12 w-auto" 
            />
            <p className="text-gray-300 text-sm mr-14">
              Empowering mental wellness through AI
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/about" className="hover:text-blue-200 transition">About</a></li>
                  <li><a href="/blog" className="hover:text-blue-200 transition">Blog</a></li>
                  <li><a href="/careers" className="hover:text-blue-200 transition">Careers</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/privacy" className="hover:text-blue-200 transition">Privacy</a></li>
                  <li><a href="/terms" className="hover:text-blue-200 transition">Terms</a></li>
                  <li><a href="/security" className="hover:text-blue-200 transition">Security</a></li>
                </ul>
              </div>

              <div className="col-span-2 md:col-span-1">
                <h3 className="font-semibold mb-4">Connect</h3>
                <div className="flex space-x-4 ml-20">
                  <a href="#" className="hover:text-blue-200 transition">
                    <FaTwitter size={20} />
                  </a>
                  <a href="#" className="hover:text-blue-200 transition">
                    <FaLinkedin size={20} />
                  </a>
                  <a href="#" className="hover:text-blue-200 transition">
                    <FaGithub size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-10 pt-8 text-center md:text-left">
          <p className="text-sm text-blue-200">
            © {new Date().getFullYear()} SereniTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;