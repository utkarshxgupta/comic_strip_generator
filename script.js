// Get the elements from the document
const comicForm = document.getElementById("comic-form");
const generateBtn = document.getElementById("generate-btn");
const comicDisplay = document.getElementById("comic-display");
const downloadBtn = document.getElementById("download-btn");

// Define the API URL and the API key
const API_URL =
  "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud";
const API_KEY =
  "VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM";

// Define the array to store the comic panels
let comicPanels = [];

// Define the function to generate a comic panel from text
async function generateComicPanel(text) {
  // Create a payload object with the text input
  const payload = {
    inputs: text,
  };

  // Send a POST request to the API with the payload and the headers
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Accept: "image/png",
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  // Return the response as a blob
  return response.blob();
}

// Define the function to display a comic panel on the page
function displayComicPanel(imageBlob, index) {
  // Create a URL from the image blob
  const imageUrl = URL.createObjectURL(imageBlob);

  // container for image and konva stage
  const container = document.createElement("div");

  // Set the container class to comic-panel-container
  container.className = "comic-panel-container";

  // Append the container to the comic display element
  comicDisplay.appendChild(container);
    
  // dummy image
  // const imageUrl = "https://picsum.photos/512/512";

  // Create an image element
  const image = document.createElement("img");

  // Set the image source to the URL
  image.src = imageUrl;

  // Set the image class to comic-panel
  image.className = "comic-panel";

  // Set the image id to panel-{index}
  image.id = `panel-${index}`;

  // Append the image to the container element
  container.appendChild(image);

  // Add the image blob to the comic panels array
  comicPanels.push(imageBlob);

  // Create a stage element for the Konva library
  const stage = document.createElement("div");

  // Set the stage id to stage-{index}
  stage.id = `stage-${index}`;
  stage.className = "comic-panel stage";

  // Append the stage to the comic display element
  container.appendChild(stage);

  // Initialize the Konva stage with the stage element overlapping the image
  const konvaStage = new Konva.Stage({
    container: `stage-${index}`,
    width: image.width,
    height: image.height,
    x: image.offsetLeft,
    y: image.offsetTop,
  });

  // Initialize the Konva layer
  const layer = new Konva.Layer();

  // Add the layer to the stage
  konvaStage.add(layer);

  // Define the function to add a speech bubble on the image
  function addSpeechBubble() {
    // Prompt the user to enter the text for the speech bubble
    const text = prompt("Enter the text for the speech bubble:");
    
    // If the text is not empty, proceed
    if (text) {
      // Create a Konva label
      const label = new Konva.Label({
        x: 50,
        y: 50,
        z: 50,
        draggable: true,
      });

      // Add a Konva tag to the label
      label.add(
        new Konva.Tag({
          fill: "white",
          stroke: "black",
          pointerDirection: "right",
          pointerWidth: 20,
          pointerHeight: 20,
          lineJoin: "round",
          shadowColor: "black",
          shadowBlur: 10,
          shadowOffsetX: 10,
          shadowOffsetY: 10,
          shadowOpacity: 0.2,
        })
      );

      // Add a Konva text to the label
      label.add(
        new Konva.Text({
          text: text,
          fontFamily: "Arial",
          fontSize: 14,
          padding: 10,
          fill: "black",
        })
      );

      // Add the label to the layer
      layer.add(label);

      // Draw the layer
      layer.draw();
    }
  }

  // Define the function to add a text annotation on the image
  function addTextAnnotation() {
    // Prompt the user to enter the text for the annotation
    const text = prompt("Enter the text for the annotation:");

    // If the text is not empty, proceed
    if (text) {
      // Create a Konva text
      const textNode = new Konva.Text({
        text: text,
        x: 50,
        y: 50,
        z: 50,
        fontSize: 20,
        draggable: true,
        width: 200,
        fill: "white",
        stroke: "black",
        strokeWidth: 2,
      });

      // Add the text to the layer
      layer.add(textNode);

      // Draw the layer
      layer.draw();
    }
  }

  // Define the function to handle the context menu event on the image
  function handleContextMenu(event) {
    // Prevent the default behavior
    event.preventDefault();
    console.log(event.target);
    console.log("stage", konvaStage.container().children[0].children[0]);
    // If the event target is the image, proceed
    if (event.target === konvaStage.container().children[0].children[0]) {
      // Create a custom menu element
      const customMenu = document.createElement("div");

      // Set the custom menu class to custom-menu
      customMenu.className = "custom-menu";

      // Set the custom menu position to the event coordinates
      customMenu.style.left = `${event.pageX}px`;
      customMenu.style.top = `${event.pageY}px`;

      // Create a menu item element for the speech bubble option
      const speechBubbleOption = document.createElement("div");

      // Set the menu item class to custom-menu-item
      speechBubbleOption.className = "custom-menu-item";

      // Set the menu item text to Add speech bubble
      speechBubbleOption.innerText = "Add speech bubble";

      // Set the menu item click event listener to the add speech bubble function
      speechBubbleOption.addEventListener("click", addSpeechBubble);

      // Append the menu item to the custom menu
      customMenu.appendChild(speechBubbleOption);

      // Create a menu item element for the text annotation option
      const textAnnotationOption = document.createElement("div");

      // Set the menu item class to custom-menu-item
      textAnnotationOption.className = "custom-menu-item";

      // Set the menu item text to Add text annotation
      textAnnotationOption.innerText = "Add text annotation";

      // Set the menu item click event listener to the add text annotation function
      textAnnotationOption.addEventListener("click", addTextAnnotation);

      // Append the menu item to the custom menu
      customMenu.appendChild(textAnnotationOption);

      // Append the custom menu to the document body
      document.body.appendChild(customMenu);
    }
  }

  // Define the function to handle the click event on the document
  function handleClick(event) {
    // Get the custom menu element from the document
    const customMenu = document.querySelector(".custom-menu");

    // If the custom menu exists, remove it from the document body
    if (customMenu) {
      document.body.removeChild(customMenu);
    }
  }

  // Add a context menu event listener to the image element
  konvaStage.addEventListener("contextmenu", handleContextMenu);

  // Add a click event listener to the document
  document.addEventListener("click", handleClick);
}

// Define the function to generate a comic from the form inputs
async function generateComic(event) {
  // Prevent the default behavior of the form submission
  event.preventDefault();

  // Disable the generate button
  generateBtn.disabled = true;

  // Change the generate button text to Generating...
  generateBtn.innerText = "Generating...";

  // add a loading indicator
  comicDisplay.innerHTML = `<div class="loading-indicator"></div>`;

  // Clear the comic display element
  comicDisplay.innerHTML = "";

  // Clear the comic panels array
  comicPanels = [];

  // Loop through the form inputs
  for (let i = 0; i < comicForm.length - 1; i++) {
    // Get the input element
    const input = comicForm[i];
    console.log(input);
    // Get the input value
    const text = input.value;

    // Generate a comic panel from the input value
    const imageBlob = await generateComicPanel(text);

    // dummy image
    // const imageBlob = "https://picsum.photos/512/512";

    // Display the comic panel on the page
    displayComicPanel(imageBlob, i + 1);
  }

  // Enable the generate button
  generateBtn.disabled = false;

  // Change the generate button text to Generate
  generateBtn.innerText = "Generate";
}

// Add a submit event listener to the comic form
comicForm.addEventListener("submit", generateComic);