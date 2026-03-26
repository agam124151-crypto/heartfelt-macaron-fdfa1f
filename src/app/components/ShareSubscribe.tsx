import { Facebook, Send, MessageCircle } from "lucide-react";
import { useState } from "react";

interface ShareSubscribeProps {
  articleTitle: string;
  articleUrl: string;
}

export function ShareSubscribe({ articleTitle, articleUrl }: ShareSubscribeProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Store subscription in localStorage
      const subscribers = JSON.parse(localStorage.getItem("subscribers") || "[]");
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem("subscribers", JSON.stringify(subscribers));
      }
      
      setIsSubscribed(true);
      setShowSuccess(true);
      setEmail("");
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(articleTitle + " " + articleUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-red-500 dark:border-red-600 rounded-lg p-8 my-8">
      {/* Social Share Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleShareFacebook}
          className="p-3 rounded-full bg-[#1877F2] hover:bg-[#0c63d4] transition-colors"
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          <Facebook className="size-6 text-white fill-white" />
        </button>
        
        <button
          onClick={handleShareTelegram}
          className="p-3 rounded-full bg-[#0088cc] hover:bg-[#006699] transition-colors"
          aria-label="Share on Telegram"
          title="Share on Telegram"
        >
          <Send className="size-6 text-white" />
        </button>
        
        <button
          onClick={handleShareWhatsApp}
          className="p-3 rounded-full bg-[#25D366] hover:bg-[#1da851] transition-colors"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
        >
          <MessageCircle className="size-6 text-white" />
        </button>
        
        <button
          onClick={handleShareX}
          className="p-3 rounded-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          aria-label="Share on X"
          title="Share on X"
        >
          <svg 
            className="size-6 text-white dark:text-black" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>
      </div>

      {/* Subscribe Section */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Join 5,00,000+ Subscribers
        </h3>
        
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email address"
            required
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            SUBSCRIBE
          </button>
        </form>

        {showSuccess && (
          <div className="mb-3 p-3 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg">
            <p className="text-green-700 dark:text-green-400 font-medium">
              🎉 Successfully subscribed! Welcome to our community.
            </p>
          </div>
        )}
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Be a part of our ever growing community.{" "}
          <button 
            onClick={handleShareX}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Join us on X
          </button>
        </p>
      </div>
    </div>
  );
}
