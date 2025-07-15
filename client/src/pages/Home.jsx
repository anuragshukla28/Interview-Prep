import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-4 flex justify-center"
        >
          <Code2 className="text-blue-600 w-16 h-16" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
          Welcome to <span className="text-blue-600">Interview Prep Portal</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Sharpen your coding skills, track your journey, and explore handpicked resources like CP sheets, YouTube tutorials, blogs & more.
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/questions"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg transition"
          >
            🚀 Get Started
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
