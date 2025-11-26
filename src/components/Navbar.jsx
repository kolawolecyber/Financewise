const Navbar = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
  
    const handleLogout = () => {
      logout();
      navigate("/login");
    };
  
    return (
      <nav className="bg-white p-4 shadow-lg border-b border-gray-100 sticky top-0 z-20"> {/* Elevated and clean */}
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo/Home */}
          <Link className="font-bold text-2xl text-indigo-600 tracking-tight flex items-center" to="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-2 align-text-bottom"><path d="M12 20h9"/><path d="M16 4h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/><path d="M10 2v4"/><path d="M14 2v4"/><path d="M17 14h-7"/><path d="M17 18h-7"/><path d="M7 7h4v4H7z"/></svg>
            FinanceFlow
          </Link>
  
          {/* Desktop links */}
          <div className="hidden md:flex gap-8 items-center text-sm font-medium"> 
            <Link className="text-gray-600 hover:text-indigo-600 transition" to="/">Home</Link>
            <Link className="text-gray-600 hover:text-indigo-600 transition" to="/goals">Goals</Link>
            <Link className="text-gray-600 hover:text-indigo-600 transition" to="/goal-dashboard">Overview</Link>
            <Link className="text-gray-600 hover:text-indigo-600 transition" to="/category">Categories</Link>
            <Link className="text-gray-600 hover:text-indigo-600 transition" to="/transactions">Transactions</Link>
            <Link className="text-gray-600 hover:text-indigo-600 transition" to="/profile">Profile</Link>
  
            {token && (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-150 shadow-md"
              >
                Logout
              </button>
            )}
          </div>
  
          {/* Hamburger for mobile */}
          <button
            className="block md:hidden p-2 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
  
        {/* Mobile menu - Responsive Dropdown */}
        {isOpen && (
          <div className="md:hidden flex flex-col mt-4 border-t border-gray-100 pt-4 space-y-3 bg-white absolute w-full left-0 shadow-xl z-10 p-4">
            <Link className="text-gray-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition font-medium" to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link className="text-gray-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition font-medium" to="/goals" onClick={() => setIsOpen(false)}>Manage Goals</Link>
            <Link className="text-gray-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition font-medium" to="/goal-dashboard" onClick={() => setIsOpen(false)}>Goal Overview</Link>
            <Link className="text-gray-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition font-medium" to="/category" onClick={() => setIsOpen(false)}>Category</Link>
            <Link className="text-gray-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition font-medium" to="/transactions" onClick={() => setIsOpen(false)}>Transactions</Link>
            <Link className="text-gray-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition font-medium" to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
  
            {token && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg font-semibold transition mt-3"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    );
};