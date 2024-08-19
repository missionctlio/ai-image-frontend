import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { chat } from '../api';
import '../styles/Chat.css'; // Import CSS for Chat component styling
import { AiOutlineSend } from 'react-icons/ai'; // Import send icon from react-icons
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

const LOCAL_STORAGE_KEY = 'chatMessages';
const THEME_LOCAL_STORAGE_KEY = 'theme'; // Key for storing theme in localStorage
const UUID_LOCAL_STORAGE_KEY = 'UserId'; // Key for storing UUID in localStorage

const Chat = () => {
    const [userQuery, setUserQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState('dark'); // Default theme
    const [uuid, setUuid] = useState(null); // State to store UUID
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(true);

    // Load messages, theme, and UUID from localStorage on initial render
    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        setMessages(savedMessages);

        const savedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
        if (savedTheme) {
            setTheme(savedTheme);
        }

        let savedUuid = localStorage.getItem(UUID_LOCAL_STORAGE_KEY);
        if (!savedUuid) {
            savedUuid = uuidv4(); // Generate a new UUID if not present
            localStorage.setItem(UUID_LOCAL_STORAGE_KEY, savedUuid);
        }
        setUuid(savedUuid);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }, [theme]);
    
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    // Adjust textarea height based on content
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height to auto to calculate scrollHeight
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on scrollHeight
        }
    };

    // Scroll to the bottom of the chat container
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Adjust height and scroll position on initial render or when messages change
    useEffect(() => {
        adjustTextareaHeight();
        scrollToBottom(); // Scroll to bottom when messages change or on initial render
    }, [messages]);

    const handleInputChange = (event) => {
        setUserQuery(event.target.value);
        adjustTextareaHeight();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent new line
            handleSubmit(event); // Submit form
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!userQuery.trim()) return;

        // Add user message to chat
        const newMessages = [
            ...messages,
            { text: userQuery, type: 'user' },
        ];
        setMessages(newMessages);
        setLoading(true);
        setError(null);

        try {
            const result = await chat(userQuery, uuid); // Pass UUID to chat function
            setMessages([
                ...newMessages,
                { text: result.response, type: 'bot' },
            ]);
        } catch (err) {
            setError('Error fetching response');
        } finally {
            setLoading(false);
            setUserQuery(''); // Clear input field
        }
    };

    return (
        <div className={`chat-container ${theme}`}> {/* Apply theme class */}
            <div className={`chat-messages ${theme}`}>
                {messages.slice().reverse().map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.type}-message theme-selector ${theme}-theme`}
                    >
                        <ReactMarkdown
                            remarkPlugins={[gfm]}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <pre>
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {message.text}
                        </ReactMarkdown>
                    </div>
                ))}
            </div>

            <div ref={messagesEndRef} className={`input-container ${theme}`}>
                <textarea
                    className={`theme-selector ${theme}-theme`}
                    value={userQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown} // Add key down event listener
                    ref={textareaRef}
                    placeholder="Type your message here..."
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`send-button theme-selector ${theme}-theme`}
                >
                    <AiOutlineSend size={24} /> {/* Send icon */}
                </button>
            </div>
            {error && <div className={`error ${theme}`}>{error}</div>}
        </div>
    );
};

export default Chat;
