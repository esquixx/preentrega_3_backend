document.addEventListener('DOMContentLoaded', () => {
    
    let chatBox = document.getElementById('chatbox')

    Swal.fire({
        title: 'Authentication',
        input: 'text',
        text: 'Set username for the chat',
        inputValidator: (value) => {
            return !value.trim() && 'Please, write a username!'
        },
        allowOutsideClick: false
    }).then((result) => {
        const user = result.value;
        document.getElementById('user').innerHTML = `<b>${user}</b>`
        const socket = io()

        chatBox.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                const messageText = chatBox.value.trim()
                if (messageText.length > 0) {
                    const newMessage = {
                        user,
                        message: messageText
                    }
                    socket.emit('message', newMessage);
                    chatBox.value = ''
                }
            }
        })

        const renderMessages = (data) => {
            const divLogs = document.getElementById('messagesLogs')
            const messagesHTML = data.reverse().map((message) => `
                <div class='bg-secondary p-2 my-2 rounded-2'>
                    <p><i>${message.user}</i>: ${message.message}</p>
                </div>
            `).join('')
            divLogs.innerHTML = messagesHTML
        }

        socket.on('logs', renderMessages)

        socket.on('alerta', () => {
            Toastify({
                text: 'New user connected',
                duration: 1500,
                newWindow: true,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: {
                    background: "#7dd56f",
                    background: "-webkit-linear-gradient(to right, #28b487, #7dd56f)",
                    background: "linear-gradient(to right, #28b487, #7dd56f)",
                },
                onClick: function () {},
            }).showToast()
        })
    })
})
