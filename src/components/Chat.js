import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { chat } from '../api';
import '../styles/Chat.css'; // Import CSS for Chat component styling

const LOCAL_STORAGE_KEY = 'chatMessages';

const Chat = () => {
    const [userQuery, setUserQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Load messages from localStorage on initial render
    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        setMessages(savedMessages);
    }, []);

    // Save messages to localStorage whenever they change
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

    // Handle change in textarea
    const handleInputChange = (event) => {
        setUserQuery(event.target.value);
        adjustTextareaHeight();
    };

    // Scroll to the bottom of the chat container
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Adjust height on initial render
    useEffect(() => {
        adjustTextareaHeight();
        scrollToBottom();
    }, [messages]);

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
            const result = await chat(userQuery);
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
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.type}-message`}
                    >
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* To scroll to bottom */}
            </div>
            <div className="input-container">
                <textarea
                    value={userQuery}
                    onChange={handleInputChange}
                    ref={textareaRef}
                    placeholder="Type your message here..."
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </div>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default Chat;
