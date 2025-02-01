import Link from 'next/link';
import { FaFacebookSquare, FaInstagram, FaYoutube, FaTiktok, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#ffc20e] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-[#003b91] font-medium">
              www.snacksyummies.com
            </span>
            <span className="text-[#003b91] font-medium px-2">|</span>
            <span className="text-[#003b91] font-medium">
              snacksyummies
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="https://facebook.com/snacksyummies" 
              target="_blank"
              className="text-[#003b91] hover:text-[#17469e] transition-colors"
            >
              <FaFacebookSquare className="w-4 h-4" />
            </Link>
            <Link 
              href="https://twitter.com/snacksyummies"
              target="_blank" 
              className="text-[#003b91] hover:text-[#17469e] transition-colors"
            >
              <FaTwitter className="w-4 h-4" />
            </Link>
            <Link 
              href="https://instagram.com/snacksyummies"
              target="_blank"
              className="text-[#003b91] hover:text-[#17469e] transition-colors"
            >
              <FaInstagram className="w-4 h-4" />
            </Link>
            <Link 
              href="https://tiktok.com/@snacksyummies"
              target="_blank"
              className="text-[#003b91] hover:text-[#17469e] transition-colors"
            >
              <FaTiktok className="w-4 h-4" />
            </Link>
            <Link 
              href="https://youtube.com/snacksyummies"
              target="_blank"
              className="text-[#003b91] hover:text-[#17469e] transition-colors"
            >
              <FaYoutube className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}