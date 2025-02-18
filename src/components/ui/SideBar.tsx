import { useState } from "react";
import NavItem from "../NavItem";

interface Chat {
  id: string;
  title: string;
}

interface SidebarProps {
  chats: Chat[];
  chatId: string | null;
  openChat: (id: string) => void;
  newChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, chatId, openChat, newChat }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* Toggle Button (Only on Small Screens) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-1 z-50 p-2 bg-gray-200 rounded-md md:hidden"
      >
        {isOpen ? "✖️" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform bg-white border-r border-gray-200 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        aria-label="Sidenav"
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white">
          {chats.length > 0 && (
            <ul className="space-y-2">
              {chats.map((chat) => (
                <NavItem
                  key={chat.id}
                  active={chatId === chat.id}
                  onClick={() => {
                    openChat(chat.id);
                    setIsOpen(false); // Close sidebar on mobile
                  }}
                >
                  <span className="truncate text-sm">{chat.title}</span>
                </NavItem>
              ))}
            </ul>
          )}
          <ul
            className={`pt-5 space-y-2 ${
              chats.length > 0 ? "mt-5 border-t border-gray-200" : ""
            }`}
          >
            <NavItem
              active={!chatId}
              onClick={() => {
                newChat();
                setIsOpen(false); // Close sidebar on mobile
              }}
            >
              <svg
                className="w-6 h-6 text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z"
                />
              </svg>
              <span className="ml-3 truncate text-sm">New chat</span>
            </NavItem>
          </ul>
        </div>
      </aside>

      {/* Overlay (closes sidebar when clicked on mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
