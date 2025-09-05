import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../Resusable/Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token =localStorage.getItem("token");

  const links = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "categories" },
    { name: "AI Tools", path: "features" },
    { name: "Contact Us", path: "contact-us" },
    { name: "About", path: "about" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 
        bg-black/5  backdrop-blur-sm 
        border-b-4 border-emerald-200/20 
        shadow-xl hover:shadow-2xl 
        rounded-2xl 
        transition-all duration-300 
        ring-1 ring-blue-100/30"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          AI News Assistant
        </Link>

       <div className="flex flex-row justify-center items-center gap-5">
         {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                } hover:text-blue-600`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA Button */}
        <div className="">
          <Button
            content={token ? "Dashboard" :"Get Started"}
            condition={true}
            data={true}
            click={() => navigate("/register")}
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 transition-transform duration-200 active:scale-95"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
       </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden bg-white px-4 pb-6 pt-2 space-y-3 flex flex-col items-center 
          transition-all duration-300 transform"
        >
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
