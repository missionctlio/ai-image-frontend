import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'https://esm.sh/react-markdown@latest'; // Import react-markdown from esm.sh
import { chatStream } from '../api';
import '../styles/Chat.css'; // Import CSS for Chat component styling
import { AiOutlineSend } from 'react-icons/ai'; // Import send icon from react-icons
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon for loading state
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import { THEME_LOCAL_STORAGE_KEY } from './ThemeSelector';
import remarkGfm from 'https://esm.sh/remark-gfm@latest'; // Import remark-gfm from esm.sh
import { Prism as SyntaxHighlighter } from 'https://esm.sh/react-syntax-highlighter@latest'; // Import SyntaxHighlighter from esm.sh
import { materialDark } from 'https://esm.sh/react-syntax-highlighter@latest/dist/esm/styles/prism'; // Import Prism styles from esm.sh
import { materialLight } from 'https://esm.sh/react-syntax-highlighter@latest/dist/esm/styles/prism'; // Import Prism styles from esm.sh
const LOCAL_STORAGE_KEY = 'chatMessages';
const UUID_LOCAL_STORAGE_KEY = 'UserId'; // Key for storing UUID in localStorage

const Chat = () => {
    const [userQuery, setUserQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState('dark'); // Default theme
    const [uuid, setUuid] = useState(null); // State to store UUID
    const [firstChunkReceived, setFirstChunkReceived] = useState(false); // New state to track first chunk
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Load messages, theme, and UUID from localStorage on initial render
    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        setMessages(savedMessages);

        let savedUuid = localStorage.getItem(UUID_LOCAL_STORAGE_KEY);
        if (!savedUuid) {
            savedUuid = uuidv4(); // Generate a new UUID if not present
            localStorage.setItem(UUID_LOCAL_STORAGE_KEY, savedUuid);
        }
        setUuid(savedUuid);
    }, []);

    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

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
            { text: '', type: 'bot', isLoading: true }, // Placeholder for the bot response
        ];
        setMessages(newMessages);
        setError(null);
        setFirstChunkReceived(false); // Reset state for new request

        try {
            const eventSource = chatStream(userQuery, uuid, (chunk) => {
                setMessages((prevMessages) => {
                    const lastMessageIndex = prevMessages.length - 1;
                    const lastMessage = prevMessages[lastMessageIndex];

                    // Update the last bot message with the new chunk
                    const updatedMessages = [...prevMessages];
                    updatedMessages[lastMessageIndex] = {
                        ...lastMessage,
                        text: (lastMessage.text || '') + chunk,
                        isLoading: true, // Indicate that the message is still loading
                    };

                    return updatedMessages;
                });

                // Set the state to true once the first chunk is received
                if (!firstChunkReceived) {
                    setFirstChunkReceived(true);
                }
            });

            eventSource.onopen = () => {
                setLoading(true);
                // Optionally handle connection open state
            };

            eventSource.onclose = () => {
                setLoading(false);
                setUserQuery(''); // Clear input field

                // Mark the last message as complete
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    const lastMessageIndex = prevMessages.length - 1;
                    if (lastMessageIndex >= 0) {
                        updatedMessages[lastMessageIndex] = {
                            ...updatedMessages[lastMessageIndex],
                            isLoading: false,
                        };
                    }
                    return updatedMessages;
                });
            };

            eventSource.onerror = (err) => {
                setError('Error fetching response');
                setLoading(false);
                eventSource.close();
            };
        } catch (err) {
            setError('Error fetching response');
            setLoading(false);
        }
    };

    return (
        <div className={`chat-container `}> {/* Apply theme class */}
            <div className={`chat-messages ${theme}-theme`}>
                {loading && (
                    <div className="loading-icon">
                        <FaSpinner size={24} className="spinner" /> {/* Loading spinner */}
                    </div>
                )}
                {messages.slice().reverse().map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.type}-message ${theme}-theme`}
                    >
                        <Markdown
                            components={{
                                code: ({node, inline, className, children, ...props}) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            language={match[1]}
                                            style={materialDark} // You can change the style if needed
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                            remarkPlugins={[remarkGfm]}
                            className={`markdown ${theme}-theme`}
                        >
                            {message.text || ''}
                        </Markdown>
                    </div>
                ))}
            </div>

            <div ref={messagesEndRef} className={`input-container ${theme}-theme`}>
                <textarea
                    className={`textarea theme-selector ${theme}-theme`}
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
                    className={`send-button ${theme}-theme`}
                >
                    <AiOutlineSend size={24} /> {/* Send icon */}
                </button>
            </div>
            {error && <div className={`error ${theme}`}>{error}</div>}
        </div>
    );
};

export default Chat;
