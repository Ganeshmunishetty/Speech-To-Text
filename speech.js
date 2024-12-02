const recordBtn = document.getElementById('recordBtn');
const saveBtn = document.getElementById('saveBtn');
const output = document.getElementById('output');

let recognition;
let isRecording = false;

// Check if the browser supports the Web Speech API (SpeechRecognition)
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;

    // Start recording event
    recognition.onstart = () => {
        isRecording = true;
        recordBtn.textContent = "🛑 Stop Recording";
        recordBtn.style.backgroundColor = "#dc3545";
    };

    // Handle speech result
    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        output.value = transcript;
        saveBtn.disabled = false;
    };

    // Stop recording event
    recognition.onend = () => {
        isRecording = false;
        recordBtn.textContent = "🎤 Start Recording";
        recordBtn.style.backgroundColor = "#007BFF";
    };

    // Handle speech recognition errors
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("Error occurred in speech recognition. Please try again.");
    };

    // Handle Start/Stop Recording button click
    recordBtn.addEventListener('click', () => {
        if (isRecording) {
            recognition.stop();  // Stop recording
        } else {
            recognition.start(); // Start recording
        }
    });

    // Handle Save to File button click
    saveBtn.addEventListener('click', () => {
        const text = output.value.trim();

        if (text === "") {
            alert("Nothing to save. Please record your speech first.");
            return;
        }

        fetch('http://localhost/Speech To Text/speech.php', {  // Ensure this URL is correct
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Text saved successfully: ${data.filename}`);
                output.value = "";  // Clear text area
                saveBtn.disabled = true;  // Disable button
            } else {
                alert(`Failed to save the text: ${data.message}`);
            }
        })
        .catch(error => {
            console.error("Error saving text:", error);
            alert("Failed to save the text. Please try again.");
        });
    });

} else {
    alert("Your browser does not support speech recognition. Please try using Google Chrome.");
    recordBtn.disabled = true;
    saveBtn.disabled = true;
}

