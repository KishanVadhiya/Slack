import { Box, Divider, Stack, TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChannelChat = ({ selectedChannel, selectedChannelId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');


  useEffect(() => {
    // console.log("inside useEffect: ", selectedChannelId);
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          const response = await axios.get(
            `http://localhost:5000/api/channels/${selectedChannelId}/messages`,
            // 'http://localhost:5000/api/channels/66eba8ff1a04e377bef6989e/messages',
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          // console.log("responsewfewrewqr: ", response);
          
          if (response.status === 200) {
            const msg=[];
            for (let i = 0; i < response.data.length; i++) {
              // setMessages([...messages, { text: response.data[i].message, sender: response.data[i].sender }]);
              msg.push({ text: response.data[i].message, sender: response.data[i].sender });
            }
            setMessages(msg);
          }
          else{
            throw new Error('Error fetching messages');
          }
          // setMessages([response.data]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  },[selectedChannelId]);
  // console.log("Messages: ", messages);
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      
      // console.log("selectedChannelId: ", selectedChannelId);
      const sendMessage = async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            // console.log("token is present",token);
            await axios.post(
              `http://localhost:5000/api/channels/${selectedChannelId}/messages`,
              // 'http://localhost:5000/api/channels/66eba8ff1a04e377bef6989e/messages',
              {
                message: newMessage,
              },
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }

      sendMessage();
      setMessages([...messages, { text: newMessage, sender: 'You' }]);
      setNewMessage('');

    }
  };
	const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents the default action of the Enter key
      handleSendMessage();
    }
  };

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h1 className='font-bold text-xl'>
        {selectedChannel ? '# ' + selectedChannel : 'No channel selected'}
      </h1>
      <p className='flex mt-7 ml-4'>
        <img src="message-fill.svg" className='w-4 mx-2' alt="" />
        Messages
      </p>
      <Box sx={{ display: 'flex' }}>
        <Divider
          sx={{
            width: '15%',
            backgroundColor: '#39063a',
            marginLeft: '-1rem',
            marginTop: '4px',
          }}
        />
        <Divider
          sx={{
            width: '100%',
            backgroundColor: '#e5e7eb26',
            marginTop: '4px',
          }}
        />
      </Box>

      {/* Message List Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <Box key={index} sx={{ marginBottom: '1rem' }}>
              <strong>{message.sender}:</strong> {message.text}
            </Box>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </Box>

      {/* Input Field at the bottom */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '1rem',
          padding: '0.5rem',
          borderRadius: '12px',
          backgroundColor: '#f5f5f5',
        }}
      >
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
					onKeyDown={handleKeyDown}
          placeholder='Type a message...'
          variant="outlined"
          sx={{
            flexGrow: 1,
            marginRight: '1rem',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          sx={{
            borderRadius: '12px',
            bgcolor: '#611f69',
            textTransform: 'none',
          }}
        >
          Send
        </Button>
      </Box>
    </Stack>
  );
};

export default ChannelChat;
