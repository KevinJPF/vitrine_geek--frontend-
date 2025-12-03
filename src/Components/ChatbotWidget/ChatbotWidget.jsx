/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, ArrowDown } from "lucide-react";
import styles from "./ChatbotWidget.module.css";
import { usePostData } from "../../Hooks/usePostData";

const ChatbotWidget = () => {
  const { postApiData } = usePostData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "text",
      text: "Olá! Como posso ajudar você hoje?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Pequeno delay para garantir que o DOM foi renderizado
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendToBackend = async (text) => {
    const resposta = await postApiData("chat", {
      message: text,
      history: messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content:
          m.type === "products"
            ? JSON.stringify({
                type: "products",
                items: m.items,
              })
            : m.text ?? "",
      })),
    });

    return resposta;
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (inputValue.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      type: "text",
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const messageText = inputValue;
    setInputValue("");

    try {
      const response = await sendToBackend(messageText);
      const botReply = response.reply;

      const botMessage = {
        id: messages.length + 2,
        sender: "bot",
        timestamp: new Date(),
        type: botReply.type || "text",
        text: botReply.type === "text" ? botReply.content : "",
        items: botReply.type === "products" ? botReply.items : [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        type: "text",
        text: "Erro ao conectar com o servidor.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.chatbotContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div>
              <h5 className={styles.headerTitle}>Chat de Suporte</h5>
              <div className={styles.chatStatus}>Online agora</div>
            </div>
            <button className={styles.closeButton} onClick={toggleChat}>
              <X size={24} />
            </button>
          </div>

          <div
            className={styles.chatMessages}
            ref={messagesContainerRef}
            onScroll={handleScroll}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.sender === "user"
                    ? styles.messageUser
                    : styles.messageBot
                }`}
              >
                <div className={styles.messageBubble}>
                  {/* TEXTO */}
                  {(!message.type || message.type === "text") && (
                    <p>{message.text}</p>
                  )}

                  {/* PRODUTOS */}
                  {message.type === "products" && message.items?.length > 0 && (
                    <div className={styles.productList}>
                      {message.items.map((item) => (
                        <div key={item.id} className={styles.productCard}>
                          <img
                            src={item.imagem}
                            className={styles.productImage}
                            alt={item.nome}
                          />

                          <div className={styles.productInfo}>
                            <strong>{item.nome}</strong>
                            <p>R$ {Number(item.preco).toFixed(2)}</p>

                            <a
                              className={styles.productButton}
                              href={item.link}
                              target="_blank"
                            >
                              Ver produto
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.messageTime}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {showScrollButton && (
            <button
              className={styles.scrollToBottomButton}
              onClick={scrollToBottom}
            >
              <ArrowDown size={20} />
            </button>
          )}

          <div className={styles.chatInputContainer}>
            <div className={styles.chatInputForm}>
              <input
                type="text"
                className={styles.chatInput}
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button
                type="button"
                className={styles.sendButton}
                disabled={inputValue.trim() === ""}
                onClick={handleSendMessage}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className={`${styles.chatButton} ${
          isOpen ? styles.openChatButton : ""
        }`}
        onClick={toggleChat}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default ChatbotWidget;
