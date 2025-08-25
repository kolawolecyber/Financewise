import { useAuth } from "../context/AuthContext";

const GlobalLoader = () => {
  const { loading } = useAuth();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <p className="text-gray-600 text-lg font-medium animate-pulse">
           📊 Fetching your data…
     
      </p>
    </div>
  );
};

export default GlobalLoader;
