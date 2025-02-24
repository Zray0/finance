import React from 'react';
import '../styles/chatbotbutton.css'; // Import the CSS file
import chatIcon from '../images/chat-bot.jpg'; // Replace with the path to your chatbot icon

function ChatbotButton() {
    const chatbotLink = "https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/02/24/12/20250224121742-KEF3J71T.json"; // Replace with your chatbot link

    return (
        <div className="chatbot-button" onClick={() => window.open(chatbotLink, '_blank')}>
            <img src={chatIcon} alt="Chatbot" />
        </div>
    );
}

export default ChatbotButton;
