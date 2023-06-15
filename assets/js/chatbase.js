const CHAT_BUTTON_SIZE = 50; // size of the chat button in pixels
const CHAT_BUTTON_RADIUS = CHAT_BUTTON_SIZE / 2; // radius of the chat button in pixels
const CHAT_BUTTON_BACKGROUND_COLOR = "black"; // background color of the chat button
const scriptTag = document.currentScript;
let ICON_COLOR = "white";
let USER_ADDED_CHAT_ICON = null;
let has_been_opened = false;

// create the chat button element
const chatButton = document.createElement("div");
// apply styles to the chat button
chatButton.setAttribute("class", "chatbase-bubble-button");
chatButton.setAttribute("id", "chatbase-bubble-button");
chatButton.style.position = "fixed";
chatButton.style.bottom = "20px";
chatButton.style.right = "20px";
chatButton.style.width = CHAT_BUTTON_SIZE + "px";
chatButton.style.height = CHAT_BUTTON_SIZE + "px";
chatButton.style.borderRadius = CHAT_BUTTON_RADIUS + "px";
chatButton.style.backgroundColor = CHAT_BUTTON_BACKGROUND_COLOR;
chatButton.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
chatButton.style.cursor = "pointer";
chatButton.style.zIndex = 2;
chatButton.style.transition = "all .2s ease-in-out";

const messageBubbles = document.createElement("div");
messageBubbles.setAttribute("id", "chatbase-message-bubbles");
messageBubbles.style.position = "fixed";
messageBubbles.style.bottom = "80px";
messageBubbles.style.borderRadius = "10px";
messageBubbles.style.fontFamily = "sans-serif";
messageBubbles.style.fontSize = "16px";
messageBubbles.style.zIndex = 2;
messageBubbles.style.cursor = "pointer";
messageBubbles.style.flexDirection = "column";
messageBubbles.style.gap = "50px";
messageBubbles.style.marginLeft = "20px";
messageBubbles.style.maxWidth = "70vw";
messageBubbles.style.display = "none";

// Create the 'X' button element
const messageBubblesCloseButton = document.createElement("div");
messageBubblesCloseButton.setAttribute(
  "id",
  "chatbase-message-bubbles-close-button"
);
messageBubblesCloseButton.innerHTML = "&#10005;";
messageBubblesCloseButton.style.position = "absolute";
messageBubblesCloseButton.style.top = "-7px";
messageBubblesCloseButton.style.right = "-7px";
messageBubblesCloseButton.style.fontWeight = "bold";
messageBubblesCloseButton.style.display = "none";
messageBubblesCloseButton.style.justifyContent = "center";
messageBubblesCloseButton.style.alignItems = "center";
messageBubblesCloseButton.style.zIndex = 2;
messageBubblesCloseButton.style.width = "22px";
messageBubblesCloseButton.style.height = "22px";
messageBubblesCloseButton.style.borderRadius = "50%";
messageBubblesCloseButton.style.textAlign = "center";
messageBubblesCloseButton.style.fontSize = "12px";
messageBubblesCloseButton.style.cursor = "pointer";

messageBubbles.appendChild(messageBubblesCloseButton);

document.body.appendChild(messageBubbles);

chatButton.addEventListener("mouseenter", (event) => {
  chatButton.style.transform = "scale(1.08)";
});
chatButton.addEventListener("mouseleave", (event) => {
  chatButton.style.transform = "scale(1)";
});

// create the chat button icon element
const chatButtonIcon = document.createElement("div");
chatButtonIcon.setAttribute("id", "chatbase-chat-button-icon");
// apply styles to the chat button icon
chatButtonIcon.style.display = "flex";
chatButtonIcon.style.alignItems = "center";
chatButtonIcon.style.justifyContent = "center";
chatButtonIcon.style.width = "100%";
chatButtonIcon.style.height = "100%";
chatButtonIcon.style.zIndex = 2;

// add the chat button icon to the chat button element

chatButton.appendChild(chatButtonIcon);

// add the chat button to the page

// toggle the chat component when the chat button is clicked
chatButton.addEventListener("click", toggleChat);

function toggleChat() {
  // toggle the chat component
  if (chat.style.display === "none") {
    has_been_opened = true;
    messageBubbles.style.display = "none";
    chat.style.display = "flex";

    chatButtonIcon.innerHTML = getChatButtonCloseIcon();
  } else {
    has_been_opened = false;
    chat.style.display = "none";
    chatButtonIcon.innerHTML = getChatButtonIcon();
  }
}

messageBubbles.addEventListener("click", () => {
  has_been_opened = true;
  messageBubbles.style.display = "none";
  chat.style.display = "flex";
  chatButtonIcon.innerHTML = getChatButtonCloseIcon();
});

const chat = document.createElement("div");
chat.setAttribute("id", "chatbase-bubble-window");

chat.style.position = "fixed";
chat.style.flexDirection = "column";
chat.style.justifyContent = "space-between";
chat.style.bottom = "80px";
chat.style.width = "85vw";
chat.style.height = "70vh";
chat.style.boxShadow =
  "rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, rgba(150, 150, 150, 0.2) 0px 0px 0px 1px";

chat.style.display = "none";
chat.style.borderRadius = "10px";
chat.style.zIndex = 2;
chat.style.overflow = "hidden";

document.body.appendChild(chat);

chat.innerHTML = `<iframe
src="https://www.chatbase.co/chatbot-iframe/${scriptTag.id}"
width="100%"
height="100%"
frameborder="0"
></iframe>`;

// Create a condition that targets viewports at least 768px wide
const mediaQuery = window.matchMedia("(min-width: 550px)");

function handleChatWindowSizeChange(e) {
  // Check if the media query is true
  if (e.matches) {
    chat.style.height = "600px";
    chat.style.width = "400px";
    messageBubbles.style.maxWidth = "300px";
  }
}

// Register event listener
mediaQuery.addEventListener("change", handleChatWindowSizeChange);

// Initial check
handleChatWindowSizeChange(mediaQuery);

const getChatbotStyles = async () => {
  const response = await fetch(
    `https://www.chatbase.co/api/get-chatbot-styles?chatbotId=${scriptTag.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const { styles, initialMessages } = await response.json();

  chatButton.style.backgroundColor =
    styles.button_color || CHAT_BUTTON_BACKGROUND_COLOR;

  if (styles.align_chat_button === "left") {
    chatButton.style.left = "20px";
    chatButton.style.right = "unset";
    chat.style.left = "20px";
    chat.style.right = "unset";
    messageBubbles.style.left = "20px";
    messageBubbles.style.right = "unset";
  } else {
    chatButton.style.right = "20px";
    chatButton.style.left = "unset";
    chat.style.right = "20px";
    chat.style.left = "unset";
    messageBubbles.style.right = "20px";
    messageBubbles.style.left = "unset";
  }

  document.body.appendChild(chatButton);

  if (styles.chat_icon) {
    USER_ADDED_CHAT_ICON = `<img src="https://backend.chatbase.co/storage/v1/object/public/chat-icons/${styles.chat_icon}" class="chatbase-bubble-img" id="chatbase-bubble-img" />`;
  }

  const iconColor = getContrastingTextColor(
    styles.button_color || CHAT_BUTTON_BACKGROUND_COLOR
  );

  ICON_COLOR = iconColor;
  chatButtonIcon.innerHTML = getChatButtonIcon();

  initialMessages.forEach((message, index) => {
    const messageElementContainer = document.createElement("div");
    messageElementContainer.style.display = "flex";
    messageElementContainer.style.justifyContent =
      styles.align_chat_button === "left" ? "flex-start" : "flex-end";
    const messageElement = document.createElement("div");

    messageElement.style.backgroundColor =
      styles.theme === "dark" ? "black" : "white";

    messageElement.style.color = styles.theme === "dark" ? "white" : "black";

    messageElement.style.boxShadow =
      "rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, rgba(150, 150, 150, 0.2) 0px 0px 0px 1px";

    messageElement.style.borderRadius = "10px";
    messageElement.style.padding = "20px";
    messageElement.style.margin = "8px";
    messageElement.style.fontSize = "14px";
    messageElement.innerText = message;
    messageElement.style.opacity = 0;

    messageElement.style.transform = "scale(0.9)";
    messageElement.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    messageElementContainer.appendChild(messageElement);
    messageBubbles.appendChild(messageElementContainer);

    if (styles.auto_open_chat_window_after >= 0) {
      setTimeout(() => {
        if (has_been_opened) return;
        if (
          sessionStorage.getItem("message_bubbles_have_been_shown") === "true"
        )
          return;
        if (index === 0) {
          messageBubbles.style.display = "block";
        }
        messageElement.style.opacity = 1;
        messageElement.style.transform = "scale(1)";
        if (index === initialMessages.length - 1) {
          sessionStorage.setItem("message_bubbles_have_been_shown", "true");
        }
      }, styles.auto_open_chat_window_after * 1000 + index * 100);
    }
  });

  // Apply the same color and shadow as the messages
  messageBubblesCloseButton.style.backgroundColor =
    styles.theme === "dark"
      ? darkenOrLightenColor("#000000", 0.2)
      : darkenOrLightenColor("#FFFFFF", 0.12);

  messageBubblesCloseButton.style.color =
    styles.theme === "dark" ? "white" : "black";

  messageBubblesCloseButton.style.boxShadow =
    "rgba(150, 150, 150, 0.15) 0px 6px 24px 0px, rgba(150, 150, 150, 0.15) 0px 0px 0px 1px";

  messageBubbles.addEventListener("mouseenter", () => {
    messageBubblesCloseButton.style.display = "flex";
  });

  // Hide the 'X' button when leaving the messageBubbles
  messageBubbles.addEventListener("mouseleave", () => {
    messageBubblesCloseButton.style.display = "none";
  });

  // Hide the messageBubbles component when the 'X' button is clicked
  messageBubblesCloseButton.addEventListener("click", (event) => {
    // prevent click event from bubbling up to the messageBubbles
    event.stopPropagation();
    messageBubbles.style.display = "none";
  });
};

function getChatButtonIcon() {
  const CHAT_BUTTON_ICON = `
  <svg id="chatbase-chat-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.3" stroke="${ICON_COLOR}" width="24" height="24">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>`;

  return USER_ADDED_CHAT_ICON || CHAT_BUTTON_ICON;
  // return USER_ADDED_CHAT_ICON
}

function getChatButtonCloseIcon() {
  const CHAT_BUTTON_CLOSE_ICON = `
  <svg id="chatbase-close-icon" class="closeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.3" stroke="${ICON_COLOR}" width="24" height="24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
  `;
  return CHAT_BUTTON_CLOSE_ICON;
}

function getContrastingTextColor(bgColor) {
  // Ensure the input is in the format #RRGGBB
  if (bgColor.charAt(0) === "#") {
    bgColor = bgColor.substr(1);
  }

  // Convert the input color to RGB
  const r = parseInt(bgColor.substr(0, 2), 16);
  const g = parseInt(bgColor.substr(2, 2), 16);
  const b = parseInt(bgColor.substr(4, 2), 16);

  // Calculate the luminance value using the WCAG formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return the appropriate text color based on the luminance value
  return luminance > 0.5 ? "black" : "white";
}

function darkenOrLightenColor(color, percentage) {
  // Ensure the input is in the format #RRGGBB
  if (color.charAt(0) === "#") {
    color = color.substr(1);
  }

  const getColorValue = (value) => {
    // Clamp the value between 0 and 255
    return Math.min(255, Math.max(0, value));
  };

  // Convert the input color to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // Calculate the luminance value using the WCAG formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Determine whether the color is light or dark
  const isLight = luminance > 0.5;

  // Calculate the adjustment value
  const adjustment = isLight ? -1 * Math.abs(percentage) : Math.abs(percentage);

  // Adjust the color values
  const newR = getColorValue(r + Math.round(255 * adjustment));
  const newG = getColorValue(g + Math.round(255 * adjustment));
  const newB = getColorValue(b + Math.round(255 * adjustment));

  // Convert the adjusted color values back to the hex format
  const newColor =
    "#" +
    newR.toString(16).padStart(2, "0") +
    newG.toString(16).padStart(2, "0") +
    newB.toString(16).padStart(2, "0");

  return newColor;
}

getChatbotStyles();

document.onclick = function (e) {
  console.log(e.target.id);
  if (
    e.target.id !== "chatbase-bubble-window" &&
    e.target.id !== "chatbase-bubble-button" &&
    e.target.id !== "chatbase-bubble-img" &&
    e.target.id !== "chatbase-close-icon" &&
    e.target.id !== "chatbase-chat-icon" &&
    e.target.id !== "chatbase-chat-button-icon"
  ) {
    if (has_been_opened) {
      chat.style.display = "none";
      chatButtonIcon.innerHTML = getChatButtonIcon();
      has_been_opened = false;
    }
    console.log("close chat");
  }
};
